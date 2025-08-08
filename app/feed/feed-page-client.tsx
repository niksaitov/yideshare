"use client";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { TopBar } from "@/components/top-bar";
import { FeedHeader } from "@/components/ui/FeedHeader";
import { FeedSortBar } from "@/components/ui/FeedSortBar";
import { FeedList } from "@/components/ui/FeedList";
import { useSortedRides } from "@/lib/useSortedRides";
import { FeedPageClientProps } from "@/app/interface/main";

export default function FeedPageClient({
  initialRides,
  bookmarkedRideIds,
}: FeedPageClientProps) {
  const [sortBy, setSortBy] = React.useState("recent");
  const [localRides, setRides] = React.useState(initialRides);
  const sortedRides = useSortedRides(localRides, sortBy);

  return (
    <div className="bg-white min-h-screen">
      <FeedHeader feedbackUrl="https://forms.gle/DjypxU7tayRGVVMu5" />
      <div className="px-8">
        <TopBar onResults={setRides} rides={localRides} />
      </div>
      <div className="relative flex flex-1 flex-col p-6 bg-white">
        <FeedSortBar sortBy={sortBy} setSortBy={setSortBy}/>
        <Separator className="mb-4" />
        <div className="pt-16 flex justify-center">
          <FeedList rides={sortedRides} bookmarkedRideIds={bookmarkedRideIds} />
        </div>
      </div>
    </div>
  );
}