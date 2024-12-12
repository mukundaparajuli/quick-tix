import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";
import { FaPlus } from "react-icons/fa";

export default function EventDetailForm({ form }: any) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "agendas",
    });
    console.log(JSON.stringify(form.getValues('agendas')));
    return (
        <div className="w-full flex flex-col items-center space-y-4">
            {fields.map((field, index) => (
                <div key={field.id} className="flex w-full space-x-4">
                    <FormField
                        control={form.control}
                        name={`agendas.${index}.time`}
                        render={({ field }) => (
                            <FormItem className="w-1/4"> {/* Adjust width for Time */}
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
