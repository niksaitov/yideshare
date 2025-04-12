"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import FeedClient from "@/app/feed/feed-client";
import { TopBar } from "@/components/top-bar";
import { TopNavButtons } from "@/components/top-nav-buttons";
import { Ride } from "@prisma/client";

interface FeedPageClientProps {
  initialRides: Ride[];
  bookmarkedRideIds: string[];
}

export default function FeedPageClient({
  initialRides,
  bookmarkedRideIds,
}: FeedPageClientProps) {
  const [rides, setRides] = React.useState<Ride[]>(initialRides);

  return (
    <div className="bg-white min-h-screen">
      {/* header strip */}
      <header className="bg-background py-8">
        <div className="flex h-16 items-center justify-between px-8 mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-righteous text-[#397060] tracking-wide">
              Yideshare
            </h1>
          </div>
          <TopNavButtons />
        </div>

        {/* live‑filtering search bar */}
        <div className="px-8">
          <TopBar onResults={setRides} />
        </div>
      </header>

      {/* feed list */}
      <FeedClient rides={rides} bookmarkedRideIds={bookmarkedRideIds} />
    </div>
  );
}
