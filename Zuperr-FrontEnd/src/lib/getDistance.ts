import { getCoordinatesFromLocation } from "./getLocation";

export function getDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const R = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((R * c).toFixed(2));
}

function sanitizeLocation(location: string): string {
  if (!location) return "";
  return location.replace(/^Unknown City,?\s*/i, "").trim();
}

export async function getDistanceBetweenLocations(
  locationA: string,
  locationB: string
): Promise<number> {
  try {
    const sanitizedLoc1 = sanitizeLocation(locationA);
    const sanitizedLoc2 = sanitizeLocation(locationB);
    console.log(
      `Calculating distance between "${sanitizedLoc1}" and "${sanitizedLoc2}"`
    );
    const coordsA = await getCoordinatesFromLocation(sanitizedLoc1);
    const coordsB = await getCoordinatesFromLocation(sanitizedLoc2);

    const distance = getDistanceInKm(
      coordsA.lat,
      coordsA.lon,
      coordsB.lat,
      coordsB.lon
    );

    return distance;
  } catch (error) {
    console.error("Error calculating distance:", error);
    return -1;
  }
}
