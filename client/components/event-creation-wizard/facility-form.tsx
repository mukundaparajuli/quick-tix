"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, Form } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

const facilitySchema = z.object({
    name: z.string().min(5).max(100),
    description: z.string().min(10).max(500).optional(),
})
export type FacilityForm = z.infer<typeof facilitySchema>;

export function FacilityForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const form = useForm<FacilityForm>({
        resolver: zodResolver(facilitySchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    function onSubmit(values: z.infer<typeof facilitySchema>) {
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

                    <Button type="submit" variant="secondary" className="w-full">Create Facility</Button>
                </form>
            </Form>
        </div>
    )
}
