import { NextResponse } from "next/server"
import { getVehicles } from "@/lib/webflow"

export async function GET() {
  try {
    const vehicles = await getVehicles()
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error("Error in vehicles API:", error)
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}
