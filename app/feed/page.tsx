// app/feed/page.tsx

import { prisma } from "@/lib/prisma"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { LogoutButton } from "@/components/logout-button"
import FeedClient from "@/app/feed/feed-client"

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function Home() {
  const fetchedRides = await prisma.ride.findMany({
    take: 6,
    where: {
      isClosed: false,
    }
  })

  console.log(fetchedRides)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="">
          <div className="flex h-16 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="font-bold text-xl">Yideshare</h1>
            <div className="ml-auto">
              <LogoutButton />
            </div>
          </div>
          {/* Render the TopBar (with search fields, date/time picker, and modal) */}
          <TopBar />
        </header>

        {/* The main feed area */}
        <FeedClient initialRides={fetchedRides} />
      </SidebarInset>
    </SidebarProvider>
  )
}
