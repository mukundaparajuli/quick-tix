import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EventCategory } from "../../../../../../enums/event-category.enum";

export default function EventInformationForm({ form }: any) {
    return (
        <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-xl ">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Event Information</h2>

            {/* Title */}
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem className="mb-4">
                        <FormLabel className="text-gray-700">Title</FormLabel>
                        <FormControl>
                            <Input placeholder="Event Title" className="border rounded p-2 w-full" {...field} />
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
                    <FormItem className="mb-4">
                        <FormLabel className="text-gray-700">Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Event Description" className="border rounded p-2 w-full" {...field} />
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
                    <FormItem className="mb-4">
                        <FormLabel className="text-gray-700">Date</FormLabel>
                        <FormControl>
                            <Input
                                type="date"
                                className="border rounded p-2 w-full"
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
                    <FormItem className="mb-4">
                        <FormLabel className="text-gray-700">Total Tickets</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                className="border rounded p-2 w-full"
                                placeholder="Total Tickets"
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
                    <FormItem className="mb-4">
                        <FormLabel className="text-gray-700">Organizer Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Organizer Name" className="border rounded p-2 w-full" {...field} />
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
                    <FormItem className="mb-4">
                        <FormLabel className="text-gray-700">Organizer Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="Organizer Email" className="border rounded p-2 w-full" {...field} />
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
                    <FormItem className="mb-4">
                        <FormLabel className="text-gray-700">Category</FormLabel>
                        <FormControl>
                            <select {...field} className="border rounded p-2 w-full">
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
    );
}
