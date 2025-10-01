import React, { useEffect, useState } from "react";

function CurrentLocation() {
  const [location, setLocation] = useState("Fetching location...");

  useEffect(() => {
    const savedLocation = localStorage.getItem("user_location");
    if (savedLocation) {
      setLocation(savedLocation);
      return;
    }

    if (!navigator.geolocation) {
      setLocation("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Unknown City";
          const state = data.address.state || "";
          const fullLocation = `${city}, ${state}`;

          setLocation(fullLocation);
          localStorage.setItem("user_location", fullLocation);
        } catch (error: any) {
          console.error("Error fetching location:", error);
          setLocation("Location unavailable");
        }
      },
      (error) => {
        console.error(error);
        setLocation("Permission denied");
      }
    );
  }, []);

  return (
    <div className="w-full md:w-auto md:min-w-48 flex items-center gap-2 relative mr-16">
      <div className="hidden md:flex items-center gap-2 text-sm">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>{location}</span>
      </div>
    </div>
  );
}

export default CurrentLocation;
