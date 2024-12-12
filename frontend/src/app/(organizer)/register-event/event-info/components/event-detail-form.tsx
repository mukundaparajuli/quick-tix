"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";
import { FaPlus } from "react-icons/fa";

export default function EventDetailForm({ form, finalData }: any) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "agendas",
    });

    return (
        <div className="w-full flex flex-col items-center space-y-4">
            {/* Image Upload */}
            <Input
                type="file"
                multiple
                onChange={(e) => {
                    const files = e.target.files;
                    console.log("Selected files:", files);
                    for (let i = 0; i < files.length; i++) {
                        console.log("Appending file:", files[i].name);
                        finalData.append("images", files[i]);
                    }
                }}
            />

            {/* Agendas submission */}
            {fields.map((field, index) => (
                <div key={field.id} className="flex w-full space-x-4">
                    <FormField
                        control={form.control}
                        name={`agendas.${index}.time`}
                        render={({ field }) => (
                            <FormItem className="w-1/4">
                                <FormLabel className="sr-only">Time</FormLabel>
                                <FormControl>
                                    <Input placeholder="Time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`agendas.${index}.activity`}
                        render={({ field }) => (
                            <FormItem className="w-3/4">
                                <FormLabel className="sr-only">Activity</FormLabel>
                                <FormControl>
                                    <Input placeholder="Activity" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="button" onClick={() => remove(index)} className="self-center">
                        -
                    </Button>
                </div>
            ))}

            {/* Add more agendas */}
            <div className="flex justify-center items-center mt-4">
                <Button
                    type="button"
                    onClick={() => append({ time: "", activity: "" })}
                    className="p-2"
                >
                    <FaPlus />
                </Button>
            </div>
        </div>
    );
}
