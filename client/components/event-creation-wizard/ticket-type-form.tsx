"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, Form } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import useEventStore from "@/stores/event-store"
import useCreateTicketType from "@/hooks/event-wizard/use-create-ticket-type"
import { useEffect } from "react"

const ticketTypeSchema = z.object({
    name: z.string().min(5).max(100),
    description: z.string().min(10).max(500).optional(),
    price: z.number().min(0),
    capacity: z.number().min(1).optional(),
    sold: z.number().min(0),
})
export type TicketTypeForm = z.infer<typeof ticketTypeSchema>;

interface TicketTypeFormProps extends React.ComponentProps<"div"> {
    onSuccess?: () => void
}

export function TicketTypeForm({
    className,
    onSuccess,
    ...props
}: TicketTypeFormProps) {
    const createTicketTypeMutation = useCreateTicketType(onSuccess);
    const form = useForm<TicketTypeForm>({
        resolver: zodResolver(ticketTypeSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            capacity: 0,
            sold: 0,
        },
    })
    const currentEvent = useEventStore().event;
    useEffect(() => {
        console.log(currentEvent)
    }, [currentEvent]);

    if (!currentEvent) {
        return (
            <p className="text-sm text-muted-foreground">
                Please create an event first to add ticket types.
            </p>
        )
    }

    function onSubmit(values: TicketTypeForm) {
        if (!currentEvent) return;
        createTicketTypeMutation.mutate({
            eventId: +currentEvent.id,
            data: values,
        })
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

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Ticket Type Price"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                                    <Input type="number" placeholder="Event Capacity" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sold"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sold</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Tickets Sold" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" variant="secondary" className="w-full">Create Ticket Type</Button>
                </form>
            </Form>
        </div>
    )
}
