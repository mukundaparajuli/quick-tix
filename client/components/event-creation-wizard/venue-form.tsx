"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, Form } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

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
    const form = useForm<VenueForm>({
        resolver: zodResolver(venueSchema),
        defaultValues: {
            name: "",
            location: "",
            capacity: 0,
        },
    })

    function onSubmit(values: z.infer<typeof venueSchema>) {
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
                                    <Input placeholder="Venue Name" {...field} />
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
                                    <Input placeholder="Venue Location" {...field} />
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
                                    <Input type="number" placeholder="Event Capacity" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant="secondary" className="w-full">Create Venue</Button>
                </form>
            </Form>
        </div>
    )
}
