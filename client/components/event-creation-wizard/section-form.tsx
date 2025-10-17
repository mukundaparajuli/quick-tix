"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, Form } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

const sectionSchema = z.object({
    name: z.string().min(5).max(100),
    capacity: z.number().min(1).optional(),
})
export type SectionForm = z.infer<typeof sectionSchema>;

export function SectionForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const form = useForm<SectionForm>({
        resolver: zodResolver(sectionSchema),
        defaultValues: {
            name: "",
            capacity: 0,
        },
    })

    function onSubmit(values: z.infer<typeof sectionSchema>) {
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
                                    <Input placeholder="Ticket Type Name" {...field} />
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

                    <Button type="submit" variant="secondary" className="w-full">Create Section</Button>
                </form>
            </Form>
        </div>
    )
}
