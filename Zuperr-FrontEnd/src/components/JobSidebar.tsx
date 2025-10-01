/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useMemo } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@components/ui/accordion";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";

interface IFilter {
  title: string;
  options: string[];
  isMultiSelect?: boolean;
}

interface JobSidebarProps {
  selectedFilters: { [key: string]: string[] };
  onFilterChange: (filterName: string, options: string[]) => void;
  onResetFilters: () => void;
  filterCounts?: { [key: string]: { [option: string]: number } };
}

const filters: IFilter[] = [
  {
    title: "Working Schedule",
    options: [
      "Full-Time",
      "Part-Time",
      "Internship/Apprenticeship",
      "Contract",
    ],
    isMultiSelect: true,
  },
  {
    title: "Experience Level",
    options: ["Fresher", "0-2 Years", "2-5 Years", "5-10 Years", "10+ Years"],
    isMultiSelect: false,
  },
  {
    title: "Industry",
    options: [
      "Software Development",
      "Web Development",
      "Mobile App Development",
      "DevOps & Cloud",
      "UI/UX Design",
      "Game Development",
      "Data Science",
      "AI / ML",
      "Cybersecurity",
      "IT Support",
      "Accounting",
      "Finance",
      "Banking & Insurance",
      "Auditing & Compliance",
      "HR & Recruitment",
      "Legal",
      "Project Management",
      "Business Consulting",
      "Sales & BD",
      "Marketing",
      "Digital Marketing",
      "SEO/SEM",
      "Public Relations",
      "Market Research",
      "Content Writing",
      "Copywriting",
      "Technical Writing",
      "Journalism",
      "Translation",
      "Graphic Design",
      "Video Editing",
      "Animation",
      "Photography",
      "Product Design",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Civil Engineering",
      "Chemical Engineering",
      "Electronics Engineering",
      "Industrial Engineering",
      "Manufacturing",
      "Medical & Healthcare",
      "Pharmacy",
      "Nursing",
      "Clinical Research",
      "Psychology & Counseling",
      "Teaching & Education",
      "Training & Development",
      "Instructional Design",
      "Operations & Admin",
      "Customer Support",
      "BPO / KPO",
      "Retail",
      "E-commerce",
      "Hospitality",
      "Tourism",
      "Event Management",
      "Logistics",
      "Procurement",
      "Supply Chain",
      "Transportation",
      "Construction & Skilled Trades",
      "Architecture",
      "Environmental & Sustainability",
      "Government & Public Sector",
      "Defense & Law Enforcement",
      "Freelance & Remote",
      "Virtual Assistance",
      "Online Tutoring",
      "Others / Miscellaneous",
    ],
    isMultiSelect: true,
  },
  {
    title: "Work Mode",
    options: ["Remote", "Hybrid", "On-Site"],
    isMultiSelect: true,
  },
  {
    title: "Distance",
    options: [],
  },
  {
    title: "Cities",
    options: [
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
    ],
    isMultiSelect: true,
  },
];

const FilterOptionItem = ({
  filter,
  option,
  isSelected,
  count,
  onToggle,
}: {
  filter: IFilter;
  option: string;
  isSelected: boolean;
  count?: number;
  onToggle: () => void;
}) => (
  <li className="flex items-center space-x-2 py-1">
    <Checkbox
      id={`${filter.title}-${option}`}
      checked={isSelected || false}
      onCheckedChange={onToggle}
    />
    <label
      htmlFor={`${filter.title}-${option}`}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 flex justify-between"
    >
      <span>{option}</span>
      {count !== undefined && (
        <span className="text-muted-foreground">{count}</span>
      )}
    </label>
  </li>
);

export default function JobSidebar({
  selectedFilters,
  onFilterChange,
  onResetFilters,
  filterCounts,
}: JobSidebarProps) {
  const [industrySearch, setIndustrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [distance, setDistance] = useState(10);

  const handleFilterToggle = (
    filterName: string,
    option: string,
    isMultiSelect: boolean
  ) => {
    const currentSelection = selectedFilters[filterName] || [];

    if (isMultiSelect) {
      const newSelection = currentSelection.includes(option)
        ? currentSelection.filter((item) => item !== option)
        : [...currentSelection, option];
      onFilterChange(filterName, newSelection);
    } else {
      onFilterChange(
        filterName,
        currentSelection.includes(option) ? [] : [option]
      );
    }
  };

  const totalActiveFilters = useMemo(
    () =>
      Object.values(selectedFilters).reduce(
        (sum, options) => sum + options.length,
        0
      ),
    [selectedFilters]
  );

  return (
    <div className="w-full">
      <div className="bg-blue-600 text-white rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Build Your Dream Career with the Right Job
        </h2>
        <Link to="/blogs">
          <button className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium mt-2 hover:bg-blue-50 transition-colors">
            Learn more
          </button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <p className="mt-2">All Filters</p>
                {totalActiveFilters > 0 && (
                  <Badge variant="secondary">{totalActiveFilters}</Badge>
                )}
              </div>
              <Button
                onClick={onResetFilters}
                variant="outline"
                disabled={totalActiveFilters === 0}
              >
                Reset Filters
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Accordion type="single" defaultValue={"filter-0"}>
            {filters.map((filter, index) => {
              const isIndustry = filter.title === "Industry";
              const isCity = filter.title === "Cities";
              const isDistance = filter.title === "Distance";
              const isMultiSelect = filter.isMultiSelect ?? true;

              const filteredOptions = filter.options.filter((option) => {
                if (isIndustry && industrySearch) {
                  return option
                    .toLowerCase()
                    .includes(industrySearch.toLowerCase());
                }
                if (isCity && citySearch) {
                  return option
                    .toLowerCase()
                    .includes(citySearch.toLowerCase());
                }
                return true;
              });

              return (
                <AccordionItem key={index} value={`filter-${index}`}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      {filter.title}
                      {selectedFilters[filter.title]?.length > 0 && (
                        <Badge variant="outline" className="h-5 px-1.5">
                          {selectedFilters[filter.title].length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {isIndustry && (
                      <Input
                        type="text"
                        placeholder="Search Industry..."
                        value={industrySearch}
                        onChange={(e) => setIndustrySearch(e.target.value)}
                        className="mb-2"
                      />
                    )}

                    {isCity && (
                      <Input
                        type="text"
                        placeholder="Search City..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="mb-2"
                      />
                    )}

                    {isDistance ? (
                      <div className="px-2 py-3">
                        <Slider
                          min={1}
                          max={200}
                          step={1}
                          value={[distance]}
                          onValueChange={([val]) => {
                            setDistance(val);
                            onFilterChange("Distance", [`< ${val}km`]);
                          }}
                        />
                        <div className="flex justify-between text-sm mt-2 text-muted-foreground">
                          <span>Distance</span>
                          <span>Within {distance} km</span>
                        </div>
                      </div>
                    ) : (
                      <ScrollArea className="h-auto max-h-64 pr-4">
                        <ul className="space-y-2">
                          {isIndustry || isCity
                            ? // For searchable filters (Industry/Cities), only show when searching
                              ((isIndustry && industrySearch) ||
                                (isCity && citySearch)) &&
                              (filteredOptions.length > 0 ? (
                                filteredOptions.map((option, idx) => (
                                  <FilterOptionItem
                                    key={idx}
                                    filter={filter}
                                    option={option}
                                    isSelected={selectedFilters?.[
                                      filter.title
                                    ]?.includes(option)}
                                    count={
                                      filterCounts?.[filter.title]?.[option]
                                    }
                                    onToggle={() =>
                                      handleFilterToggle(
                                        filter.title,
                                        option,
                                        isMultiSelect
                                      )
                                    }
                                  />
                                ))
                              ) : (
                                <div className="text-sm text-muted-foreground py-2">
                                  No results found
                                </div>
                              ))
                            : // For non-searchable filters, show all options
                              filter.options.map((option, idx) => (
                                <FilterOptionItem
                                  key={idx}
                                  filter={filter}
                                  option={option}
                                  isSelected={selectedFilters?.[
                                    filter.title
                                  ]?.includes(option)}
                                  count={filterCounts?.[filter.title]?.[option]}
                                  onToggle={() =>
                                    handleFilterToggle(
                                      filter.title,
                                      option,
                                      isMultiSelect
                                    )
                                  }
                                />
                              ))}
                        </ul>
                      </ScrollArea>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
