/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-escape */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Resume from "./resume";
import { Button } from "@components/ui/button";

export default function ViewAndEditSections({
  candidateData,
  profileSectionsConfig,
  fetchCandidateData,
  handleOpenDialog,
}: {
  candidateData: any;
  profileSectionsConfig: any[];
  fetchCandidateData: () => void;
  handleOpenDialog: (section: any) => void;
}) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  console.log("Profile Sections Config:", profileSectionsConfig);
  console.log("Candidate Data:", candidateData);

  const flattenFields = (fields: any[]): any[] =>
    fields.reduce((acc: any[], field) => {
      if (Array.isArray(field)) {
        return acc.concat(flattenFields(field));
      }
      return acc.concat(field);
    }, []);

  // Expand only the first section on mount
  useEffect(() => {
    if (profileSectionsConfig.length > 0) {
      const initialState: Record<string, boolean> = {};
      profileSectionsConfig.forEach((section, idx) => {
        initialState[section.id] = idx === 0;
      });
      setExpandedSections(initialState);
    }
  }, [profileSectionsConfig]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getNestedValue = (obj: any, path: any) => {
    if (!obj || !path) return undefined;
    const keys = path.split(/[.\[\]]/).filter((key: any) => key !== "");

    return keys.reduce((acc: any, key: string) => {
      if (acc && typeof acc === "object") {
        const lowerKey = Object.keys(acc).find(
          (k) => k.toLowerCase() === key.toLowerCase()
        );
        return lowerKey ? acc[lowerKey] : undefined;
      }
      return undefined;
    }, obj);
  };

  const isFieldFilled = (value: any) =>
    value !== null &&
    value !== undefined &&
    value !== "" &&
    !(Array.isArray(value) && value.length === 0);

  return (
    <div className="flex-1 mt-4 w-3/4">
      <Resume onUpdateProfile={fetchCandidateData} />
      <div className="grid grid-cols-1 gap-4">
        {profileSectionsConfig.map((section, index) => {
          const colors = [
            "#DED3FD",
            "#DFF3FE",
            "#FBE2F4",
            "#F9E1C5",
            "#FFFCE4",
            "#CCFFED",
          ];
          const bgColor = colors[index % colors.length];
          const isExpanded = expandedSections[section.id] ?? false;

          let sectionDataToDisplay: any = null;
          if (section.isList) {
            sectionDataToDisplay = getNestedValue(
              candidateData,
              section.arrayName
            );
          } else if (section.parentObject) {
            sectionDataToDisplay = getNestedValue(
              candidateData,
              section.parentObject
            );
          } else {
            sectionDataToDisplay = candidateData;
          }

          return (
            <div
              key={section.id}
              id="profile-data"
              className="border rounded-lg p-4 flex flex-col shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
              style={{ backgroundColor: bgColor }}
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-col items-start gap-3">
                  {section.logo && (
                    <img
                      className="h-10 w-auto mb-2"
                      src={section.logo}
                      alt={`${section.title} logo`}
                    />
                  )}
                  <span className="font-semibold text-gray-800">
                    {section.title}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  className="text-blue-700 bg-blue-700/10 rounded-full h-10 w-10 hover:bg-white/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDialog(section);
                  }}
                >
                  <Plus className="text-2xl font-bold" />
                </Button>
              </div>

              {isExpanded && (
                <>
                  {section.isList ? (
                    sectionDataToDisplay &&
                    Array.isArray(sectionDataToDisplay) &&
                    sectionDataToDisplay.length > 0 ? (
                      sectionDataToDisplay.map(
                        (item: any, itemIndex: number) => (
                          <div
                            key={itemIndex}
                            className="mb-4 p-4 border-l-4 border-blue-600 bg-white bg-opacity-70 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                          >
                            {section.id === "keySkills" ? (
                              <p className="text-gray-800 text-base leading-relaxed mb-1">
                                <span className="font-semibold text-blue-700">
                                  Skill:
                                </span>{" "}
                                <span className="italic text-gray-600">
                                  {item?.Name || item?.name || "-"}
                                </span>
                              </p>
                            ) : (
                              flattenFields(section.fields).map(
                                (field: any) => {
                                  const value = getNestedValue(
                                    item,
                                    field.name
                                  );
                                  if (isFieldFilled(value)) {
                                    return (
                                      <p
                                        key={field.name}
                                        className="text-gray-800 text-base leading-relaxed mb-1"
                                      >
                                        <span className="font-semibold text-blue-700">
                                          {field.label}:
                                        </span>{" "}
                                        <span className="italic text-gray-600">
                                          {field.type === "date" &&
                                          value instanceof Date
                                            ? value.toLocaleDateString()
                                            : Array.isArray(value)
                                            ? value
                                                .map((v) =>
                                                  typeof v === "object" &&
                                                  v !== null
                                                    ? v.Name || v.name || "-"
                                                    : String(v)
                                                )
                                                .join(", ")
                                            : String(value)}
                                        </span>
                                      </p>
                                    );
                                  }
                                  return null;
                                }
                              )
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-center text-gray-400 italic text-sm mt-2">
                        No data entered for this section yet.
                      </p>
                    )
                  ) : sectionDataToDisplay ? (
                    <div className="mb-4 p-4 border-l-4 border-blue-600 bg-white bg-opacity-70 rounded-lg shadow-md">
                      {section.fields.map((field: any) => {
                        const value = getNestedValue(
                          sectionDataToDisplay,
                          field.name
                        );

                        if (isFieldFilled(value)) {
                          return (
                            <p
                              key={field.name}
                              className="text-gray-800 text-base leading-relaxed mb-1"
                            >
                              <span className="font-semibold text-blue-700">
                                {field.label}:
                              </span>{" "}
                              <span className="italic text-gray-600">
                                {field.type === "date" && value instanceof Date
                                  ? value.toLocaleDateString()
                                  : field.type === "checkbox"
                                  ? value
                                    ? "Yes"
                                    : "No"
                                  : Array.isArray(value)
                                  ? value
                                      .map((v) =>
                                        typeof v === "object" && v !== null
                                          ? v.Name || v.name || "-"
                                          : String(v)
                                      )
                                      .join(", ")
                                  : String(value)}
                              </span>
                            </p>
                          );
                        }
                        return null;
                      })}

                      {/* Check if any field has data to show empty message */}
                      {!section.fields.some((field: any) =>
                        isFieldFilled(
                          getNestedValue(sectionDataToDisplay, field.name)
                        )
                      ) && (
                        <p className="text-center text-gray-400 italic text-sm mt-2">
                          No data entered for this section yet.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 italic text-sm mt-2">
                      No data entered for this section yet.
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
