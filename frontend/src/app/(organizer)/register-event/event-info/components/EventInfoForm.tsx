"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegisterEventSchema } from "../../../../../../schemas";
import { Textarea } from "@/components/ui/textarea";
import { EventCategory } from "../../../../../../enums/event-category.enum";

interface RegisterEventFormProps extends React.HTMLAttributes<HTMLFormElement> { }

export default function EventInfoForm({ className, ...props }: RegisterEventFormProps) {
    const form = useForm<z.infer<typeof RegisterEventSchema>>({
        resolver: zodResolver(RegisterEventSchema),
        defaultValues: {
            title: "",
            description: "",
            date: new Date(),
            totalTickets: 0,
            organizerName: "",
            organizerEmail: "",
            category: "",
            location: {
                address: "",
                city: "",
                country: "",
                state: ""
            },
            venue: {
                name: "",
                description: "",
                capacity: 0,
                amenities: []
            },
            sections: ""
        }
    });

    const onSubmit = async (formData: any) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to register event');
            }

            const result = await response.json();
            console.log('Event registered successfully:', result);
        } catch (error) {
            console.error('Error registering event:', error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-6", className)} {...props}>

                {/* Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Event Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Event Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Date */}
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    placeholder="Pick a date"
                                    {...field}
                                    value={
                                        field.value
                                            ? field.value.toISOString().split("T")[0]
                                            : ""
                                    }
                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Total Tickets */}
                <FormField
                    control={form.control}
                    name="totalTickets"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Total Tickets</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Total Tickets" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Organizer Name */}
                <FormField
                    control={form.control}
                    name="organizerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Organizer Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Organizer Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Organizer Email */}
                <FormField
                    control={form.control}
                    name="organizerEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Organizer Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Organizer Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Category */}
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <select {...field} className="border rounded p-2">
                                    {Object.values(EventCategory).map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Location Fields */}
                <FormField
                    control={form.control}
                    name="location.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="Location Address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location.city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location.state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location.country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input placeholder="Country" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Venue Fields */}
                <FormField
                    control={form.control}
                    name="venue.name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Venue Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Venue Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="venue.description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Venue Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Venue Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="venue.capacity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Venue Capacity" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="venue.amenities"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amenities</FormLabel>
                            <FormControl>
                                <Input placeholder="Comma-separated amenities" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Sections */}
                <FormField
                    control={form.control}
                    name="sections"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sections</FormLabel>
                            <FormControl>
                                <Input placeholder="Event Sections" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <Button type="submit">Register Event</Button>
            </form>
        </Form>
    );
}
