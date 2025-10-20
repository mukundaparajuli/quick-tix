import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useEventStore from "@/stores/event-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const seatsSchema = z.object({
    row: z.number().min(1),
    column: z.number().min(1),
});
export type SeatsFormType = z.infer<typeof seatsSchema>;

export default function SeatsForm() {
    const sections = useEventStore().sections;
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

    const form = useForm<SeatsFormType>({
        resolver: zodResolver(seatsSchema),
        defaultValues: { row: 1, column: 1 },
    });

    const onSubmit = (values: SeatsFormType) => {
        console.log("Submitted values:", { ...values, sectionId: selectedSectionId });
        form.reset();
    };

    return (
        <div className="flex flex-col space-y-3">
            <Select
                value={selectedSectionId ?? undefined}
                onValueChange={(value) => setSelectedSectionId(value)}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                    {sections?.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                            {section.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="row"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Row</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Row" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </div>
    )
}