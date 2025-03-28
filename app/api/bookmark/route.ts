import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { bookmarkRide } from "@/lib/utils/ride";
import { getUserNetIdFromCookies } from "@/lib/utils/user";
import { extractRideIdFromPayload } from "@/lib/utils/validate";

export async function POST(req: Request) {
  try {
    // get netId and rideId
    const cookieStore = await cookies();
    const netId = getUserNetIdFromCookies(cookieStore);
    const rideId = await extractRideIdFromPayload(req);

    // validate netId
    if (netId === null) {
      throw new Error("Cannot get user netId from cookies");
    }

    // validate request payload (rideId)
    if (rideId === null) {
      throw new Error("Request payload does not contain user netId");
    }

    // toggle the bookmark
    const result = await bookmarkRide(netId, rideId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Bookmark Error:", error);
    return NextResponse.json(
      { error: `Failed to bookmark ride: ${error}` },
      { status: 500 }
    );
  }
}
