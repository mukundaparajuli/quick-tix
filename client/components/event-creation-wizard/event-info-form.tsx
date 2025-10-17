"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, Form } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

const eventInfoSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(500).optional(),
    date: z.date(),
    location: z.string().min(2).max(100),
    capacity: z.number().min(1).optional(),
})
export type EventInfoForm = z.infer<typeof eventInfoSchema>;

export function EventInfoForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const form = useForm<EventInfoForm>({
        resolver: zodResolver(eventInfoSchema),
        defaultValues: {
            title: "",
            description: "",
            date: new Date(),
            location: "",
            capacity: 1,
        },
    })

    function onSubmit(values: z.infer<typeof eventInfoSchema>) {
    }

    return (
        <div className={cn("", className)} {...props}>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Event Title" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Event Description" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        value={field.value.toISOString().split("T")[0]} // YYYY-MM-DD
                                        onChange={(e) => field.onChange(new Date(e.target.value))}
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
                                    <Input placeholder="Event Location" {...field} />
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

                    <Button type="submit" variant="secondary" className="w-full">Create Event</Button>
                </form>
            </Form>
        </div>
    )
}
