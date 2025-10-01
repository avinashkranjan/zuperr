"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Checkbox } from "@components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { EditDialogProps } from "../edit-dialog";
import { cn } from "@lib/utils";
import { Country, State, City } from "country-state-city";

export default function PersonalDetailsDialog({
  open,
  onOpenChange,
  sectionConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  control,
  onSubmit,
  sectionData,
}: EditDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      email: "",
      mobilenumber: "",
      hasPermanentAddress: false,
      address: {
        country: "",
        state: "",
        district: "",
        line1: "",
        landmark: "",
        pincode: "",
      },
      permanentAddress: {
        country: "",
        state: "",
        district: "",
        line1: "",
        landmark: "",
        pincode: "",
      },
    },
  });

  const genders = ["Male", "Female", "Other"];
  const maritalStatuses = ["Single", "Married", "Unmarried", "Divorced"];

  const hasPermanentAddress = watch("hasPermanentAddress");
  const gender = watch("gender");

  const [countriesList, setCountriesList] = React.useState([]);
  const [statesList, setStatesList] = React.useState([]);
  const [citiesList, setCitiesList] = React.useState([]);

  const selectedCountry = watch("address.country");
  const selectedState = watch("address.state");

  const selectedPermanentCountry: any = watch("permanentAddress.country");
  const selectedPermanentState: any = watch("permanentAddress.state");

  React.useEffect(() => {
    const allCountries: any = Country.getAllCountries();
    setCountriesList(allCountries);
  }, []);

  React.useEffect(() => {
    if (selectedPermanentCountry) {
      const found: any = countriesList.find(
        (c: any) => c.name === selectedPermanentCountry
      );
      if (found) {
        const states: any = State.getStatesOfCountry(found.isoCode);
        setStatesList(states);
      }
    } else {
      setStatesList([]);
      setCitiesList([]);
    }
  }, [selectedPermanentCountry, countriesList]);

  React.useEffect(() => {
    if (selectedPermanentState) {
      const found: any = statesList.find(
        (s: any) => s.name === selectedPermanentState
      );
      if (found) {
        const cities: any = City.getCitiesOfState(
          selectedPermanentCountry.isoCode,
          found.isoCode
        );
        setCitiesList(cities);
      }
    } else {
      setCitiesList([]);
    }
  }, [selectedPermanentState, selectedPermanentCountry, statesList]);

  React.useEffect(() => {
    if (selectedCountry) {
      const found: any = countriesList.find(
        (c: any) => c.name === selectedCountry
      );
      if (found) {
        const states: any = State.getStatesOfCountry(found.isoCode);
        setStatesList(states);
      }
    } else {
      setStatesList([]);
      setCitiesList([]);
    }
  }, [selectedCountry, countriesList]);

  React.useEffect(() => {
    if (selectedCountry && selectedState) {
      const country: any = countriesList.find(
        (c: any) => c.name === selectedCountry
      );
      const state: any = statesList.find((s: any) => s.name === selectedState);
      if (country && state) {
        const cities: any = City.getCitiesOfState(
          country.isoCode,
          state.isoCode
        );
        setCitiesList(cities);
      }
    } else {
      setCitiesList([]);
    }
  }, [selectedState, selectedCountry, countriesList, statesList]);

  React.useEffect(() => {
    if (open && sectionData) {
      const formattedDOB = sectionData.dateOfBirth
        ? sectionData.dateOfBirth.split("T")[0]
        : "";
      reset({ ...sectionData, dateOfBirth: formattedDOB });
    } else if (!open) {
      reset();
    }
  }, [open, sectionData, reset]);

  const handleFormSubmit = (data: any) => {
    const payload = sectionConfig?.parentObject
      ? { [sectionConfig.parentObject]: data[sectionConfig.parentObject] }
      : data;
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-6 overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold">
            Personal Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Personal details help us create your professional profile.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 mt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>
                First Name<span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="First Name"
                {...register("firstname", {
                  required: "First name is required",
                })}
              />
            </div>
            <div>
              <Label>
                Last Name<span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Last Name"
                {...register("lastname", { required: "Last name is required" })}
              />
            </div>
          </div>

          <div>
            <Label>
              Date of Birth<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input type="date" {...register("dateOfBirth")} />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label>
              Gender<span className="text-red-500">*</span>
            </Label>
            <Select
              value={gender}
              onValueChange={(val) => setValue("gender", val)}
            >
              <SelectTrigger className={cn(errors.gender && "border-red-500")}>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-6 pt-2">
            {maritalStatuses.map((status) => (
              <div className="flex items-center space-x-2" key={status}>
                <input
                  type="radio"
                  value={status}
                  {...register("maritalStatus")}
                  className="accent-black"
                />
                <Label>{status}</Label>
              </div>
            ))}
          </div>

          <div>
            <Label>
              Email Address<span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="Email Address"
              {...register("email")}
            />
          </div>

          <div>
            <Label>
              Phone No.<span className="text-red-500">*</span>
            </Label>
            <Input
              type="tel"
              placeholder="Phone No."
              {...register("mobilenumber")}
            />
          </div>

          <div>
            <Label className="font-semibold">Current Address</Label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <Select
                value={selectedCountry}
                onValueChange={(val) => {
                  setValue("address.country", val);
                  setValue("address.state", "");
                  setValue("address.district", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {countriesList.map((c: any) => (
                    <SelectItem key={c.isoCode} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedState}
                onValueChange={(val) => {
                  setValue("address.state", val);
                  setValue("address.district", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {statesList.map((s: any) => (
                    <SelectItem key={s.isoCode} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={watch("address.district")}
                onValueChange={(val) => setValue("address.district", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="District / City" />
                </SelectTrigger>
                <SelectContent>
                  {citiesList.map((d: any) => (
                    <SelectItem key={d.name} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              placeholder="Address Line 1"
              {...register("address.line1")}
              className="mb-2"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Landmark" {...register("address.landmark")} />
              <Input placeholder="Pincode" {...register("address.pincode")} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={hasPermanentAddress}
              onCheckedChange={(checked) =>
                setValue("hasPermanentAddress", !!checked)
              }
            />
            <Label>Permanent Address (If different from current)</Label>
          </div>

          {hasPermanentAddress && (
            <div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <Select
                  value={selectedCountry}
                  onValueChange={(val) => {
                    setValue("permanentAddress.country", val);
                    setValue("permanentAddress.state", "");
                    setValue("permanentAddress.district", "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countriesList.map((c: any) => (
                      <SelectItem key={c.isoCode} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedState}
                  onValueChange={(val) => {
                    setValue("permanentAddress.state", val);
                    setValue("permanentAddress.district", "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {statesList.map((s: any) => (
                      <SelectItem key={s.isoCode} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={watch("permanentAddress.district")}
                  onValueChange={(val) =>
                    setValue("permanentAddress.district", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="District / City" />
                  </SelectTrigger>
                  <SelectContent>
                    {citiesList.map((d: any) => (
                      <SelectItem key={d.name} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                placeholder="Address Line 1"
                {...register("permanentAddress.line1")}
                className="mb-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Landmark"
                  {...register("permanentAddress.landmark")}
                />
                <Input
                  placeholder="Pincode"
                  {...register("permanentAddress.pincode")}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
