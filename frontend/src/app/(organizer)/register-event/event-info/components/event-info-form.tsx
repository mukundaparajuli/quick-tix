import React from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Ensure consistent imports
import { EventCategory } from "../../../../../../enums/event-category.enum";

// Convert EventCategory enum to an array of its values
const eventCategories = Object.values(EventCategory);

interface EventInformationFormProps {
    form: any;
}

export default function EventInformationForm({ form }: EventInformationFormProps) {
    return (
        <div className="space-y-6"> {/* Adds consistent spacing between form fields */}
            {/* Title */}
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="title">Title</FormLabel>
                        <FormControl>
                            <Input id="title" placeholder="Enter event title" {...field} />
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
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <FormControl>
                            <Textarea
                                id="description"
                                placeholder="Enter event description"
                                {...field}
                            />
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
                        <FormLabel htmlFor="date">Date</FormLabel>
                        <FormControl>
                            <Input
                                id="date"
                                type="date"
                                placeholder="Select a date"
                                value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
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
                        <FormLabel htmlFor="totalTickets">Total Tickets</FormLabel>
                        <FormControl>
                            <Input
                                id="totalTickets"
                                type="number"
                                placeholder="Enter total tickets"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
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
                        <FormLabel htmlFor="organizerName">Organizer Name</FormLabel>
                        <FormControl>
                            <Input
                                id="organizerName"
                                placeholder="Enter organizer name"
                                {...field}
                            />
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
                        <FormLabel htmlFor="organizerEmail">Organizer Email</FormLabel>
                        <FormControl>
                            <Input
                                id="organizerEmail"
                                type="email"
                                placeholder="Enter organizer email"
                                {...field}
                            />
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
                        <FormLabel htmlFor="category">Category</FormLabel>
                        <FormControl>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger id="category" className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>

                                    {eventCategories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
