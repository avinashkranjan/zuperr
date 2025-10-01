/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { useState, useEffect, useRef } from "react";

const LocationSearch = ({
  onSearch,
}: {
  onSearch?: (location: string) => void;
}) => {
  const [locationTerm, setLocationTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cities = [
    "Delhi",
    "Mumbai",
    "Kolkāta",
    "Bangalore",
    "Chennai",
    "Hyderābād",
    "Pune",
    "Ahmedabad",
    "Sūrat",
    "Lucknow",
    "Jaipur",
    "Kanpur",
    "Mirzāpur",
    "Nāgpur",
    "Ghāziābād",
    "Supaul",
    "Vadodara",
    "Rājkot",
    "Vishākhapatnam",
    "Indore",
    "Thāne",
    "Bhopāl",
    "Pimpri-Chinchwad",
    "Patna",
    "Bilāspur",
    "Ludhiāna",
    "Āgra",
    "Madurai",
    "Jamshedpur",
    "Prayagraj",
    "Nāsik",
    "Farīdābād",
    "Meerut",
    "Jabalpur",
    "Kalyān",
    "Vasai-Virar",
    "Najafgarh",
    "Vārānasi",
    "Srīnagar",
    "Aurangābād",
    "Dhanbād",
    "Amritsar",
    "Alīgarh",
    "Guwāhāti",
    "Hāora",
    "Rānchi",
    "Gwalior",
    "Chandīgarh",
    "Haldwāni",
    "Vijayavāda",
    "Jodhpur",
    "Raipur",
    "Kota",
    "Bhayandar",
    "Loni",
    "Ambattūr",
    "Salt Lake City",
    "Bhātpāra",
    "Kūkatpalli",
    "Dāsarhalli",
    "Muzaffarpur",
    "Oulgaret",
    "New Delhi",
    "Tiruvottiyūr",
    "Puducherry",
    "Byatarayanpur",
    "Pallāvaram",
    "Secunderābād",
    "Shimla",
    "Puri",
    "Murtazābād",
    "Shrīrāmpur",
    "Chandannagar",
    "Sultānpur Mazra",
    "Krishnanagar",
    "Bārākpur",
    "Bhālswa Jahangirpur",
    "Nāngloi Jāt",
    "Balasore",
    "Dalūpura",
    "Yelahanka",
    "Titāgarh",
    "Dam Dam",
    "Bānsbāria",
    "Madhavaram",
    "Abbigeri",
    "Baj Baj",
    "Garhi",
    "Mīrpeta",
    "Nerkunram",
    "Kendrāparha",
    "Sijua",
    "Manali",
    "Kānkuria",
    "Chakapara",
    "Pāppākurichchi",
    "Herohalli",
    "Madipakkam",
    "Sabalpur",
    "Bāuria",
    "Salua",
    "Chik Bānavar",
    "Jālhalli",
    "Chinnasekkadu",
    "Jethuli",
    "Nagtala",
    "Pakri",
    "Hunasamaranhalli",
    "Hesarghatta",
    "Bommayapālaiyam",
    "Gundūr",
    "Punādih",
    "Harilādih",
    "Alāwalpur",
    "Mādnāikanhalli",
    "Bāgalūr",
    "Kādiganahalli",
    "Khānpur Zabti",
    "Mahuli",
    "Zeyādah Kot",
    "Arshakunti",
    "Mirchi",
    "Sonudih",
    "Bayandhalli",
    "Sondekoppa",
    "Babura",
    "Mādavar",
    "Kadabgeri",
    "Nanmangalam",
    "Taliganja",
    "Tarchha",
    "Belgharia",
    "Kammanhalli",
    "Ambāpuram",
    "Sonnappanhalli",
    "Kedihāti",
    "Doddajīvanhalli",
    "Simli Murārpur",
    "Sonāwān",
    "Devanandapur",
    "Tribeni",
    "Huttanhalli",
    "Nathupur",
    "Bāli",
    "Vājarhalli",
    "Alija Kotla",
    "Saino",
    "Shekhpura",
    "Cāchohalli",
    "Andheri",
    "Nārāyanpur Kola",
    "Gyan Chak",
    "Kasgatpur",
    "Kitanelli",
    "Harchandi",
    "Santoshpur",
    "Bendravādi",
    "Kodagihalli",
    "Harna Buzurg",
    "Mailanhalli",
    "Sultānpur",
    "Adakimāranhalli",
  ];

  useEffect(() => {
    if (locationTerm.length > 0) {
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(locationTerm.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCities([]);
      setShowDropdown(false);
    }
  }, [locationTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCitySelect = (city: string) => {
    setLocationTerm(city);
    setShowDropdown(false);
    if (onSearch) {
      onSearch(city);
    }
  };

  return (
    <div className="w-1/4 flex-col relative" ref={dropdownRef}>
      <div className="flex relative items-center gap-2 mt-4 text-white text-sm">
        <input
          type="text"
          placeholder="Enter Location"
          className="bg-transparent border-b border-white outline-none placeholder-white text-white text-sm w-full"
          value={locationTerm}
          onChange={(e) => setLocationTerm(e.target.value)}
          onFocus={() => locationTerm.length > 0 && setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setShowDropdown(false);
              // Handle search logic here
            }
          }}
        />
      </div>

      {/* Dropdown for city suggestions */}
      {showDropdown && filteredCities.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCities.map((city) => (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              key={city}
              className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCitySelect(city)}
            >
              {city}
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showDropdown &&
        locationTerm.length > 0 &&
        filteredCities.length === 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg px-4 py-2 text-sm text-gray-500">
            No cities found
          </div>
        )}
    </div>
  );
};

export default LocationSearch;
