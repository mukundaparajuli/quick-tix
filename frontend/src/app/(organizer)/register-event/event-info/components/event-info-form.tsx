import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EventCategory } from "../../../../../../enums/event-category.enum";


export default function EventInformationForm({ form }) {
    return (
        <div>

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
                                value={field.value ? field.value.toISOString().split("T")[0] : ""}
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
                            <Input type="number" placeholder="Total Tickets" {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))} />
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
        </div>
    )
}