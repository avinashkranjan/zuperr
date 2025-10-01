/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { get, post } from "@api/index";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { ScrollArea } from "@components/ui/scroll-area";
import { Check, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Input } from "@components/ui/input";

function Categories({
  categories,
}: {
  categories: { name: string; jobs: number; bgColor: string }[];
}) {
  const allJobCategories: { name: string; jobs: number; bgColor: string }[] = [
    { name: "Software Development", jobs: 0, bgColor: "bg-blue-100" },
    { name: "Web Development", jobs: 0, bgColor: "bg-cyan-100" },
    { name: "Mobile App Development", jobs: 0, bgColor: "bg-teal-100" },
    { name: "DevOps & Cloud", jobs: 0, bgColor: "bg-indigo-100" },
    { name: "UI/UX Design", jobs: 0, bgColor: "bg-pink-100" },
    { name: "Game Development", jobs: 0, bgColor: "bg-purple-100" },
    { name: "Data Science", jobs: 0, bgColor: "bg-green-100" },
    { name: "AI / ML", jobs: 0, bgColor: "bg-emerald-100" },
    { name: "Cybersecurity", jobs: 0, bgColor: "bg-red-100" },
    { name: "IT Support", jobs: 0, bgColor: "bg-gray-100" },

    { name: "Accounting", jobs: 0, bgColor: "bg-yellow-100" },
    { name: "Finance", jobs: 0, bgColor: "bg-orange-100" },
    { name: "Banking & Insurance", jobs: 0, bgColor: "bg-indigo-200" },
    { name: "Auditing & Compliance", jobs: 0, bgColor: "bg-fuchsia-100" },

    { name: "HR & Recruitment", jobs: 0, bgColor: "bg-lime-100" },
    { name: "Legal", jobs: 0, bgColor: "bg-rose-100" },
    { name: "Project Management", jobs: 0, bgColor: "bg-amber-100" },
    { name: "Business Consulting", jobs: 0, bgColor: "bg-violet-100" },

    { name: "Sales & BD", jobs: 0, bgColor: "bg-sky-100" },
    { name: "Marketing", jobs: 0, bgColor: "bg-orange-200" },
    { name: "Digital Marketing", jobs: 0, bgColor: "bg-violet-200" },
    { name: "SEO/SEM", jobs: 0, bgColor: "bg-cyan-200" },
    { name: "Public Relations", jobs: 0, bgColor: "bg-teal-200" },
    { name: "Market Research", jobs: 0, bgColor: "bg-blue-200" },

    { name: "Content Writing", jobs: 0, bgColor: "bg-fuchsia-200" },
    { name: "Copywriting", jobs: 0, bgColor: "bg-pink-200" },
    { name: "Technical Writing", jobs: 0, bgColor: "bg-red-200" },
    { name: "Journalism", jobs: 0, bgColor: "bg-yellow-200" },
    { name: "Translation", jobs: 0, bgColor: "bg-emerald-200" },

    { name: "Graphic Design", jobs: 0, bgColor: "bg-orange-300" },
    { name: "Video Editing", jobs: 0, bgColor: "bg-teal-300" },
    { name: "Animation", jobs: 0, bgColor: "bg-purple-200" },
    { name: "Photography", jobs: 0, bgColor: "bg-gray-300" },
    { name: "Product Design", jobs: 0, bgColor: "bg-rose-200" },

    { name: "Mechanical Engineering", jobs: 0, bgColor: "bg-green-200" },
    { name: "Electrical Engineering", jobs: 0, bgColor: "bg-red-300" },
    { name: "Civil Engineering", jobs: 0, bgColor: "bg-indigo-300" },
    { name: "Chemical Engineering", jobs: 0, bgColor: "bg-yellow-300" },
    { name: "Electronics Engineering", jobs: 0, bgColor: "bg-blue-300" },
    { name: "Industrial Engineering", jobs: 0, bgColor: "bg-lime-200" },
    { name: "Manufacturing", jobs: 0, bgColor: "bg-lime-300" },

    { name: "Medical & Healthcare", jobs: 0, bgColor: "bg-rose-300" },
    { name: "Pharmacy", jobs: 0, bgColor: "bg-yellow-400" },
    { name: "Nursing", jobs: 0, bgColor: "bg-blue-400" },
    { name: "Clinical Research", jobs: 0, bgColor: "bg-green-400" },
    { name: "Psychology & Counseling", jobs: 0, bgColor: "bg-purple-300" },

    { name: "Teaching & Education", jobs: 0, bgColor: "bg-orange-400" },
    { name: "Training & Development", jobs: 0, bgColor: "bg-pink-300" },
    { name: "Instructional Design", jobs: 0, bgColor: "bg-sky-300" },

    { name: "Operations & Admin", jobs: 0, bgColor: "bg-cyan-300" },
    { name: "Customer Support", jobs: 0, bgColor: "bg-fuchsia-300" },
    { name: "BPO / KPO", jobs: 0, bgColor: "bg-amber-200" },

    { name: "Retail", jobs: 0, bgColor: "bg-yellow-500" },
    { name: "E-commerce", jobs: 0, bgColor: "bg-pink-400" },

    { name: "Hospitality", jobs: 0, bgColor: "bg-blue-500" },
    { name: "Tourism", jobs: 0, bgColor: "bg-green-500" },
    { name: "Event Management", jobs: 0, bgColor: "bg-rose-400" },

    { name: "Logistics", jobs: 0, bgColor: "bg-red-400" },
    { name: "Procurement", jobs: 0, bgColor: "bg-yellow-600" },
    { name: "Supply Chain", jobs: 0, bgColor: "bg-emerald-400" },
    { name: "Transportation", jobs: 0, bgColor: "bg-indigo-400" },

    { name: "Construction & Skilled Trades", jobs: 0, bgColor: "bg-gray-400" },
    { name: "Architecture", jobs: 0, bgColor: "bg-teal-400" },
    {
      name: "Environmental & Sustainability",
      jobs: 0,
      bgColor: "bg-green-600",
    },

    { name: "Government & Public Sector", jobs: 0, bgColor: "bg-blue-600" },
    { name: "Defense & Law Enforcement", jobs: 0, bgColor: "bg-red-600" },

    { name: "Freelance & Remote", jobs: 0, bgColor: "bg-violet-400" },
    { name: "Virtual Assistance", jobs: 0, bgColor: "bg-yellow-700" },
    { name: "Online Tutoring", jobs: 0, bgColor: "bg-amber-400" },
    { name: "Others / Miscellaneous", jobs: 0, bgColor: "bg-zinc-300" },
  ];

  const [candidateData, setCandidateData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [availableCategories, setAvailableCategories] =
    useState<{ name: string; jobs: number; bgColor: string }[]>(
      allJobCategories
    );

  useEffect(() => {
    async function fetchCandidateData() {
      try {
        setLoading(true);
        const data = await get<any>("/employee/getcandidatedata");

        if (data) {
          setCandidateData(data);
          const selected = data.selectedJobCategories || [];
          setSelectedCategories(selected);

          const fetchedCategories = data.allCategories || [];

          const merged: { name: string; jobs: number; bgColor: string }[] = [
            ...fetchedCategories,
          ];

          allJobCategories.forEach((defaultCat) => {
            if (!merged.find((c) => c.name === defaultCat.name)) {
              merged.push(defaultCat);
            }
          });

          selected.forEach((selectedCat: string) => {
            if (!merged.find((c) => c.name === selectedCat)) {
              merged.push({
                name: selectedCat,
                jobs: 0,
                bgColor: "bg-zinc-200",
              });
            }
          });

          merged.sort((a, b) => a.name.localeCompare(b.name));

          setAvailableCategories(merged);
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCandidateData();
  }, []);

  function toggleCategory(name: string) {
    setSelectedCategories((prev) => {
      if (prev.includes(name)) {
        return prev.filter((c) => c !== name);
      } else if (prev.length < 3) {
        return [...prev, name];
      } else {
        alert("You can select up to 3 categories.");
        return prev;
      }
    });
  }

  async function handleCategoryUpdate() {
    try {
      await post("/employee/updatecandidatedata", {
        updatedFields: { selectedJobCategories: selectedCategories },
      });
      alert("Categories updated successfully.");
      setCandidateData({
        ...candidateData,
        selectedJobCategories: selectedCategories,
      });
      setOpenDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update:", error);
      alert("Update failed.");
    }
  }

  const filteredCategories = availableCategories.filter((category) =>
    candidateData?.selectedJobCategories?.includes(category.name)
  );

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <section className="relative">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Categories</CardTitle>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setOpenDialog(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <Card
                key={index}
                className={`text-center py-4 ${category.bgColor}`}
                onClick={() => {
                  setOpenDialog(true);
                  toggleCategory(category.name);
                }}
              >
                <CardTitle className="text-sm cursor-pointer">
                  {category.name}
                </CardTitle>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              {candidateData?.selectedJobCategories?.length === 0
                ? "No categories selected. Click the + button to select your preferred categories."
                : "No matching categories found."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl min-h-[500px]">
          <DialogHeader>
            <DialogTitle>Select up to 3 Categories</DialogTitle>
          </DialogHeader>

          <div className="mb-1">
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="h-64 pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 m-2">
              {/* Selected Categories (always visible) */}
              {selectedCategories.length > 0 && (
                <>
                  <div className="col-span-full text-xs text-muted-foreground -mt-2 mb-1">
                    Selected
                  </div>
                  {availableCategories
                    .filter((cat) => selectedCategories.includes(cat.name))
                    .map((category, index) => (
                      <div
                        key={`selected-${index}`}
                        onClick={() => toggleCategory(category.name)}
                        className={clsx(
                          "border rounded-md p-3 cursor-pointer transition-all",
                          category.bgColor,
                          "ring-2 ring-blue-500"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{category.name}</p>
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                    ))}
                </>
              )}

              {/* Search Results (excluding selected ones) */}
              {searchQuery.trim() !== "" && (
                <>
                  <div className="col-span-full text-xs text-muted-foreground mt-3 mb-1">
                    Search Results -{" "}
                    {
                      availableCategories.filter(
                        (cat) =>
                          !selectedCategories.includes(cat.name) &&
                          cat.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                      ).length
                    }
                  </div>
                  {availableCategories
                    .filter(
                      (cat) =>
                        !selectedCategories.includes(cat.name) &&
                        cat.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )

                    .map((category, index) => (
                      <div
                        key={`search-${index}`}
                        onClick={() => toggleCategory(category.name)}
                        className={clsx(
                          "border rounded-md p-3 cursor-pointer transition-all",
                          category.bgColor
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{category.name}</p>
                        </div>
                      </div>
                    ))}

                  {availableCategories.filter(
                    (cat) =>
                      !selectedCategories.includes(cat.name) &&
                      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="col-span-full text-center text-sm text-muted-foreground">
                      No categories found.
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              onClick={handleCategoryUpdate}
              disabled={selectedCategories.length === 0}
              className="text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default Categories;
