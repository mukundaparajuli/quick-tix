import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function VenueInfoForm({ form }: any) {
    return (
        <div><FormField
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
                            <Input type="number" placeholder="Venue Capacity" {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))} />
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
            /></div>
    )
}