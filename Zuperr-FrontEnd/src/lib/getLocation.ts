import axios from "axios";

export async function getCoordinatesFromLocation(locationName: string) {
  console.log(`Fetching coordinates for location: ${locationName}`);
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        format: "json",
        q: locationName,
      },
    }
  );

  const data = response.data;

  if (data && data.length > 0) {
    const { lat, lon } = data[0];
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
  }

  throw new Error(`Could not find coordinates for location: ${locationName}`);
}
