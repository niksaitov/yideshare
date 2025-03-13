import { NextResponse } from "next/server";

import { validateCASTicket } from "@/lib/utils/validate";
import { fetchYaliesData } from "@/lib/utils/yalies";
import { findOrCreateUser } from "@/lib/utils/user";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ticket = searchParams.get("ticket");

    // validate CAS ticket
    const netId = await validateCASTicket(ticket);
    if (!netId) return NextResponse.redirect(BASE_URL);

    // fetch Yalies data
    const yaliesData = await fetchYaliesData(netId);
    if (!yaliesData) {
      throw new Error(`Yalies returned no data for netId ${netId}`);
    }

    // extract Yalies data
    const { first_name: firstName, last_name: lastName, email } = yaliesData;

    // ensure user exists in the database
    await findOrCreateUser(netId, firstName, lastName);

    // set response cookies
    const successResponse = NextResponse.redirect(`${BASE_URL}/feed`);
    successResponse.cookies.set(
      "user",
      JSON.stringify({ firstName, lastName, email, netId }),
      { httpOnly: false, path: "/" }
    );

    return successResponse;
  } catch (error) {
    console.error("CAS Error:", error);
    return NextResponse.redirect(BASE_URL);
  }
}
