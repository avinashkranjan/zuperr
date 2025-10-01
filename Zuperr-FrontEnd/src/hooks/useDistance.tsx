import { getDistanceBetweenLocations } from "@src/lib/getDistance";
import { useEffect, useState } from "react";

export function useDistance(from: string, to: string) {
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (!from || !to) return;

    getDistanceBetweenLocations(from, to)
      .then(setDistance)
      .catch((err) => {
        console.error("Failed to get distance:", err);
        setDistance(null);
      });
  }, [from, to]);

  return distance;
}
