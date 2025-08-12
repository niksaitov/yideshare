"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TimeSelect } from "@/components/ui/time-select";
import { Ride } from "@prisma/client";
import { useState } from "react";
import { CustomPhoneInput } from "@/components/ui/phone-input";
import { createStartEndDateTimes } from "@/lib/time";

const formatTimeForDisplay = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hour12 = ((hours + 11) % 12) + 1;
  const suffix = hours < 12 ? "AM" : "PM";
  return `${hour12.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${suffix}`;
};

// logic flow that handles next-day scenarios
const createUpdatedTimes = (
  startTimeStr: string,
  endTimeStr: string,
  originalStartTime: Date
) => {
  // use the original date as the base date for the time conversion
  const baseDate = new Date(originalStartTime);
  const { startTimeObject, endTimeObject } = createStartEndDateTimes(
    baseDate,
    startTimeStr,
    endTimeStr
  );
  return { startTimeObject, endTimeObject };
};

interface EditRideDialogProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  ride: Ride;
  onSave: (updatedRide: Partial<Ride>) => Promise<void>;
}

export default function EditRideDialog({
  open,
  setOpen,
  ride,
  onSave,
}: EditRideDialogProps) {
  const [organizerName, setOrganizerName] = React.useState(
    ride.ownerName || ""
  );
  const [phoneNumber, setPhoneNumber] = React.useState(ride.ownerPhone || "");
  const [phoneError, setPhoneError] = React.useState<string | undefined>(
    undefined
  );
  const [formData, setFormData] = useState({
    from: ride.beginning,
    to: ride.destination,
    description: ride.description || "",
    startTime: ride.startTime
      ? formatTimeForDisplay(new Date(ride.startTime))
      : "12:00 AM",
    endTime: ride.endTime
      ? formatTimeForDisplay(new Date(ride.endTime))
      : "12:00 AM",
    additionalPassengers: ride.totalSeats,
  });

  const ready =
    formData.from &&
    formData.to &&
    formData.startTime &&
    formData.endTime &&
    formData.additionalPassengers &&
    organizerName &&
    !phoneError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;

    const { startTimeObject, endTimeObject } = createUpdatedTimes(
      formData.startTime,
      formData.endTime,
      new Date(ride.startTime)
    );

    const updatedRide = {
      beginning: formData.from,
      destination: formData.to,
      startTime: startTimeObject,
      endTime: endTimeObject,
      description: formData.description,
      totalSeats: formData.additionalPassengers,
      ownerName: organizerName,
      ownerPhone: phoneNumber,
    };
    await onSave(updatedRide);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span />
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl w-[100vw] max-w-[100vw] bg-white m-1 max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Edit Ride</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Update the details of your ride listing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4">
          {/* organiser + phone */}
          <div className="space-y-2">
            <Label htmlFor="organizer">
              Organizer name <span className="text-red-500">*</span>{" "}
            </Label>
            <Input
              id="organizer"
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <CustomPhoneInput
              label="Phone Number"
              required
              value={phoneNumber}
              onChange={setPhoneNumber}
              onErrorChange={setPhoneError}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">
                Leaving from <span className="text-red-500">*</span>
              </Label>
              <Input
                id="from"
                value={formData.from}
                onChange={(e) =>
                  setFormData({ ...formData, from: e.target.value })
                }
                required
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">
                Heading to <span className="text-red-500">*</span>
              </Label>
              <Input
                id="to"
                value={formData.to}
                onChange={(e) =>
                  setFormData({ ...formData, to: e.target.value })
                }
                required
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <TimeSelect
                label={
                  <>
                    Start time <span className="text-red-500">*</span>
                  </>
                }
                value={formData.startTime}
                onChange={(timeStr) =>
                  setFormData({ ...formData, startTime: timeStr })
                }
              />
            </div>

            <div className="space-y-2">
              <TimeSelect
                label={
                  <>
                    End time <span className="text-red-500">*</span>
                  </>
                }
                value={formData.endTime}
                onChange={(timeStr) =>
                  setFormData({ ...formData, endTime: timeStr })
                }
                startTime={formData.startTime}
                isEndTime={true}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seats">
              Number of Open Seats <span className="text-red-500">*</span>
            </Label>
            <Input
              id="seats"
              type="number"
              min="1"
              max="10"
              placeholder="3"
              value={
                formData.additionalPassengers === 0
                  ? ""
                  : formData.additionalPassengers
              }
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  additionalPassengers: val === "" ? 0 : parseInt(val),
                });
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">
              Description <span>(optional)</span>
            </Label>
            <Textarea
              className="bg-white"
              id="desc"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="I have two suitcases, planning to order an UberXL..."
              rows={3}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={!ready}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
