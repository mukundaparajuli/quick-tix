import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useCreateSeats from "@/hooks/event-wizard/use-create-seats";
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
export type SeatsConfig = {
    row: number,
    column: number,
}
export type SeatInfo = {
    sectionId: number,
    row: number,
    column: number
}

export default function SeatsForm() {
    const sections = useEventStore().sections;
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [seatInfos, setSeatInfos] = useState<SeatInfo[]>([]);
    const createSeatsMutation = useCreateSeats();

    const form = useForm<SeatsFormType>({
        mode: "onChange",
        resolver: zodResolver(seatsSchema),
        defaultValues: { row: 1, column: 1 },
    });

    const onSubmit = (values: SeatsFormType) => {
        if (!selectedSectionId) return;
        const { row, column } = values;
        createSeatsMutation.mutate([
            { sectionId: Number(selectedSectionId), row, column }
        ]);
        form.reset();
    }

    return (
        <div className="flex flex-col space-y-3">
            <Select
                value={selectedSectionId ?? undefined}
                onValueChange={(value) => setSelectedSectionId(value)}
                disabled={createSeatsMutation.isPending}
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" flex justify-between">
                        <FormField
                            control={form.control}
                            name="row"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">Row</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Row"
                                            disabled={createSeatsMutation.isPending}
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="column"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">Column</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Column"
                                            disabled={createSeatsMutation.isPending}
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={createSeatsMutation.isPending || !form.formState.isValid || !selectedSectionId}
                        >
                            {createSeatsMutation.isPending ? "Adding Seats..." : "Add Seats"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}