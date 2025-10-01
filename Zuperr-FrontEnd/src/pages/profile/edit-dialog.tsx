/* eslint-disable no-nested-ternary */
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionConfig: any;
  control: any;
  onSubmit: (data: any) => void;
  sectionData: any;
}

export default function EditDialog({
  open,
  onOpenChange,
  sectionConfig,
  control,
  onSubmit,
  sectionData,
}: EditDialogProps) {
  const { register, handleSubmit, reset, setValue } = useForm();

  const { fields, append, remove } = sectionConfig.isList
    ? useFieldArray({
        control,
        name: sectionConfig.arrayName,
      })
    : { fields: [], append: () => {}, remove: () => {} };

  useEffect(() => {
    if (open && sectionConfig && sectionData) {
      if (sectionConfig.isList) {
        reset({ [sectionConfig.arrayName]: sectionData });
      } else if (sectionConfig.parentObject) {
        sectionConfig.fields.forEach((field: any) => {
          setValue(
            `${sectionConfig.parentObject}.${field.name}`,
            sectionData[field.name]
          );
        });
      } else {
        sectionConfig.fields.forEach((field: any) => {
          setValue(field.name, sectionData[field.name]);
        });
      }
    } else if (!open) {
      reset();
    }
  }, [open, sectionConfig, sectionData, reset, setValue]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{sectionConfig?.title}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-4"
        >
          {sectionConfig?.isList ? (
            <>
              {fields.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="border p-4 rounded-md mb-4 relative"
                >
                  {sectionConfig.fields.map((field: any) => (
                    <div key={field.name} className="mb-2">
                      <label
                        htmlFor={`${sectionConfig.arrayName}.${index}.${field.name}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {field.label}
                      </label>
                      {field.type === "text" ||
                      field.type === "email" ||
                      field.type === "tel" ||
                      field.type === "number" ||
                      field.type === "url" ? (
                        <input
                          type={field.type}
                          id={`${sectionConfig.arrayName}.${index}.${field.name}`}
                          {...register(
                            `${sectionConfig.arrayName}.${index}.${field.name}`
                          )}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      ) : field.type === "textarea" ? (
                        <textarea
                          id={`${sectionConfig.arrayName}.${index}.${field.name}`}
                          {...register(
                            `${sectionConfig.arrayName}.${index}.${field.name}`
                          )}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      ) : field.type === "select" ? (
                        <select
                          id={`${sectionConfig.arrayName}.${index}.${field.name}`}
                          {...register(
                            `${sectionConfig.arrayName}.${index}.${field.name}`
                          )}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                          {field.options.map((option: string) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "date" ? (
                        <input
                          type="date"
                          id={`${sectionConfig.arrayName}.${index}.${field.name}`}
                          {...register(
                            `${sectionConfig.arrayName}.${index}.${field.name}`,
                            { valueAsDate: true }
                          )}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      ) : field.type === "checkbox" ? (
                        <input
                          type="checkbox"
                          id={`${sectionConfig.arrayName}.${index}.${field.name}`}
                          {...register(
                            `${sectionConfig.arrayName}.${index}.${field.name}`
                          )}
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      ) : null}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                    className="absolute top-1 right-2 text-xs"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                className="text-white"
                onClick={() => append({})}
              >
                <Plus className="mr-2 h-4 w-4" /> Add New{" "}
                {sectionConfig.title.slice(0, -1)}
              </Button>
            </>
          ) : (
            sectionConfig?.fields.map((field: any) => (
              <div key={field.name} className="mb-2">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
                {field.type === "text" ||
                field.type === "email" ||
                field.type === "tel" ||
                field.type === "number" ||
                field.type === "url" ? (
                  <input
                    type={field.type}
                    id={field.name}
                    {...register(
                      sectionConfig.parentObject
                        ? `${sectionConfig.parentObject}.${field.name}`
                        : field.name
                    )}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    {...register(
                      sectionConfig.parentObject
                        ? `${sectionConfig.parentObject}.${field.name}`
                        : field.name
                    )}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                ) : field.type === "select" ? (
                  <select
                    id={field.name}
                    {...register(
                      sectionConfig.parentObject
                        ? `${sectionConfig.parentObject}.${field.name}`
                        : field.name
                    )}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    {field.options.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "date" ? (
                  <input
                    type="date"
                    id={field.name}
                    {...register(
                      sectionConfig.parentObject
                        ? `${sectionConfig.parentObject}.${field.name}`
                        : field.name,
                      { valueAsDate: true }
                    )}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                ) : field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    id={field.name}
                    {...register(
                      sectionConfig.parentObject
                        ? `${sectionConfig.parentObject}.${field.name}`
                        : field.name
                    )}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                ) : null}
              </div>
            ))
          )}

          <DialogFooter>
            <Button type="submit" className="text-white">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
