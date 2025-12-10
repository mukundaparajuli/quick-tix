"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, Form } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { cn } from "@/lib/utils"
import useCreateVenue from "@/hooks/event-wizard/use-create-venue"
import useEventStore from "@/stores/event-store"

const venueSchema = z.object({
    name: z.string().min(5).max(100),
    location: z.string().min(10).max(500),
    capacity: z.number().min(1).optional(),
})
export type VenueForm = z.infer<typeof venueSchema>;

export function VenueForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const createVenueMutation = useCreateVenue();
    const event = useEventStore((state) => state.event);

    const form = useForm<VenueForm>({
        resolver: zodResolver(venueSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            location: "",
            capacity: 0,
        },
    })

    function onSubmit(values: z.infer<typeof venueSchema>) {
        createVenueMutation.mutate({ data: values, eventId: +event?.id! });
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
                                        placeholder="Venue Name"
                                        disabled={createVenueMutation.isPending}
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Venue Location"
                                        disabled={createVenueMutation.isPending}
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
                                        placeholder="Venue Capacity"
                                        disabled={createVenueMutation.isPending}
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
                        disabled={createVenueMutation.isPending || !form.formState.isValid}
                    >
                        {createVenueMutation.isPending ? "Creating Venue..." : "Create Venue"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
