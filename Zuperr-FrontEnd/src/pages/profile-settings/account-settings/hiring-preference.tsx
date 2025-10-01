"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Label } from "@components/ui/label";
import { get, patch } from "@api/index";

const MAX_SELECTION = 3;

export default function HiringPreferences() {
  const employerId = localStorage.getItem("userId");

  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [stateInput, setStateInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!employerId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res: any = await get(`/employer/${employerId}`);
        if (res?.data[0].hiringPreferences) {
          setStates(res.data[0].hiringPreferences.states || []);
          setCities(res.data[0].hiringPreferences.cities || []);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: any) {
        setError("Failed to load hiring preferences.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [employerId]);

  const addItem = (
    input: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[]
  ) => {
    const trimmed = input.trim();
    if (trimmed && !list.includes(trimmed) && list.length < MAX_SELECTION) {
      setList([...list, trimmed]);
    }
  };

  const removeItem = (
    index: number,
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[]
  ) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await patch(`/employer/${employerId}`, {
        hiringPreferences: {
          states,
          cities,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      setError("Failed to save hiring preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="mx-auto p-6 border rounded-xl bg-white shadow-sm space-y-6">
      <h2 className="text-2xl font-semibold">Hiring Preferences</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* States */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">States (Up to 3)</Label>
        <div className="flex flex-wrap gap-2">
          {states.map((state, index) => (
            <Badge
              key={index}
              className="rounded-full px-3 py-1 text-sm flex items-center gap-1"
              variant="outline"
            >
              {state}
              <button
                onClick={() => removeItem(index, setStates, states)}
                className="ml-1 text-xs"
              >
                ✕
              </button>
            </Badge>
          ))}
        </div>
        <Input
          placeholder="States"
          value={stateInput}
          onChange={(e) => setStateInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem(stateInput, setStates, states);
              setStateInput("");
            }
          }}
          disabled={states.length >= MAX_SELECTION}
          className="mt-1"
        />
      </div>

      {/* Cities */}
      <div className="space-y-2 mt-6">
        <Label className="text-sm font-medium">Cities (Up to 3)</Label>
        <div className="flex flex-wrap gap-2">
          {cities.map((city, index) => (
            <Badge
              key={index}
              className="rounded-full px-3 py-1 text-sm flex items-center gap-1"
              variant="outline"
            >
              {city}
              <button
                onClick={() => removeItem(index, setCities, cities)}
                className="ml-1 text-xs"
              >
                ✕
              </button>
            </Badge>
          ))}
        </div>
        <Input
          placeholder="Cities"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem(cityInput, setCities, cities);
              setCityInput("");
            }
          }}
          disabled={cities.length >= MAX_SELECTION}
          className="mt-1"
        />
      </div>

      <div className="pt-4">
        <Button className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
