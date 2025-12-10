"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, Form } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { cn } from "@/lib/utils"
import useCreateSection from "@/hooks/event-wizard/use-create-section"
import useEventStore from "@/stores/event-store"

const sectionSchema = z.object({
    name: z.string().min(5).max(100),
    capacity: z.number().min(1).optional(),
})
export type SectionForm = z.infer<typeof sectionSchema>;
export interface SectionFormProps extends React.ComponentProps<"div"> {
    onSuccess?: () => void
}

export function SectionForm({
    className,
    onSuccess,
    ...props
}: SectionFormProps) {
    const createSectionMutation = useCreateSection(onSuccess);
    const form = useForm<SectionForm>({
        resolver: zodResolver(sectionSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            capacity: 0,
        },
    })

    const venue = useEventStore((state) => state.venue);

    if (!venue) {
        return null;
    }

    function onSubmit(values: z.infer<typeof sectionSchema>) {
        createSectionMutation.mutate({ data: values, venueId: +venue?.id! });
        form.reset();
    }

    return (
        <div className={cn("", className)} {...props}>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Section Name"
                                        disabled={createSectionMutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capacity</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Section Capacity"
                                        disabled={createSectionMutation.isPending}
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        variant="secondary"
                        className="w-full"
                        disabled={createSectionMutation.isPending || !form.formState.isValid}
                    >
                        {createSectionMutation.isPending ? "Creating Section..." : "Create Section"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
