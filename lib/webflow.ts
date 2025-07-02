import type React from "react"
interface WebflowVehicle {
  id: string
  name: string
  slug: string
  "vehicle-type": string
  "vehicle-title": string
  "vehicle-description": string
  "max-passengers": number
  "max-baggage": number
  "max-car-seats": number
  "vehicle-image"?: {
    url: string
    alt: string
  }
}

interface VehicleData {
  type: string
  title: string
  description: string
  maxPassengers: number
  maxBaggage: number
  maxCarSeats: number
  icon: React.ReactNode
  image?: string
}

export async function getVehicles(): Promise<VehicleData[]> {
  try {
    const response = await fetch(
      `https://api.webflow.com/sites/${process.env.WEBFLOW_SITE_ID}/collections/vehicles/items`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
          "accept-version": "1.0.0",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Webflow API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform Webflow data to our format
    return data.items.map((item: WebflowVehicle) => ({
      type: item["vehicle-type"] || item.slug,
      title: item["vehicle-title"] || item.name,
      description: item["vehicle-description"] || "",
      maxPassengers: item["max-passengers"] || 4,
      maxBaggage: item["max-baggage"] || 3,
      maxCarSeats: item["max-car-seats"] || 2,
      icon: getVehicleIcon(item["vehicle-type"] || item.slug),
      image: item["vehicle-image"]?.url,
    }))
  } catch (error) {
    console.error("Error fetching vehicles from Webflow:", error)
    // Return fallback data if API fails
    return getFallbackVehicles()
  }
}

function getVehicleIcon(vehicleType: string): React.ReactNode {
  const type = vehicleType.toLowerCase()

  if (type.includes("sedan") || type.includes("berlina")) {
    return (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
        <path d="M3 7l2-4h14l2 4" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    )
  }

  if (type.includes("minivan")) {
    return (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
        <path d="M3 7l2-4h14l2 4" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
        <path d="M9 7v6" />
        <path d="M15 7v6" />
      </svg>
    )
  }

  if (type.includes("van")) {
    return (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6" />
        <path d="M3 6l3-3h12l3 3" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
        <rect x="7" y="6" width="10" height="8" />
      </svg>
    )
  }

  // Default car icon
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
      <path d="M3 7l2-4h14l2 4" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}

function getFallbackVehicles(): VehicleData[] {
  return [
    {
      type: "Sedan",
      title: "Berlina",
      description: "Mercedes Classe E",
      maxPassengers: 3,
      maxBaggage: 3,
      maxCarSeats: 1,
      icon: getVehicleIcon("sedan"),
    },
    {
      type: "Sedan VIP",
      title: "Berlina Executive",
      description: "Mercedes Classe S",
      maxPassengers: 3,
      maxBaggage: 3,
      maxCarSeats: 1,
      icon: getVehicleIcon("sedan"),
    },
    {
      type: "Minivan",
      title: "Minivan",
      description: "Mercedes Classe V",
      maxPassengers: 7,
      maxBaggage: 12,
      maxCarSeats: 3,
      icon: getVehicleIcon("minivan"),
    },
    {
      type: "Van",
      title: "Van",
      description: "Mercedes Vito/Sprinter",
      maxPassengers: 8,
      maxBaggage: 15,
      maxCarSeats: 3,
      icon: getVehicleIcon("van"),
    },
  ]
}
