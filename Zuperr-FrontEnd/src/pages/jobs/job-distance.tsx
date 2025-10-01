import { Badge } from "@components/ui/badge";
import { useDistance } from "@src/hooks/useDistance";
import React from "react";

function JobDistance({ jobLocation }: { jobLocation: string }) {
  const userLocation = localStorage.getItem("user_location") || "";
  const distance = useDistance(userLocation, jobLocation);

  if (distance === null) {
    return (
      <Badge className="text-xs text-black bg-gray-100 px-2 py-1 rounded-full">
        Calculating...
      </Badge>
    );
  }

  if (distance < 0) {
    return null;
  }

  return (
    <Badge className="text-xs text-black bg-gray-100 px-2 py-1 rounded-full">
      {distance.toFixed(1)} KM
    </Badge>
  );
}

export default JobDistance;
