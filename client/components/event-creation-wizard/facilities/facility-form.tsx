"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { cn } from "@/lib/utils"
import useEventStore from "@/stores/event-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import useCreateFacility from "@/hooks/event-wizard/use-create-facility"
import { useState } from "react"

const facilitySchema = z.object({
    name: z.string().min(5).max(100),
    description: z.string().min(10).max(500).optional(),
})

export type FacilityFormType = z.infer<typeof facilitySchema>

interface FacilityFormProps extends React.ComponentProps<"div"> {
    onSuccess?: () => void
}

export function FacilityForm({ className, onSuccess, ...props }: FacilityFormProps) {
    const ticketTypes = useEventStore((state) => state.ticketTypes)
    const createFacilityMutation = useCreateFacility(onSuccess)

    const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string | null>(null)

    const form = useForm<FacilityFormType>({
        resolver: zodResolver(facilitySchema),
        mode: "onChange",
        defaultValues: { name: "", description: "" },
    })

    function onSubmit(values: FacilityFormType) {
        if (!selectedTicketTypeId) {
            alert("Please select a ticket type")
            return
        }

        createFacilityMutation.mutate({
            ticketTypeId: +selectedTicketTypeId,
            data: values,
        })

        form.reset()
    }

    return (
        <div className={cn("space-y-3", className)} {...props}>
            {/* Select ticket type */}
            <Select
                value={selectedTicketTypeId ?? undefined}
                onValueChange={(value) => setSelectedTicketTypeId(value)}
                disabled={createFacilityMutation.isPending}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Ticket Type" />
                </SelectTrigger>
                <SelectContent>
                    {ticketTypes?.map((tt) => (
                        <SelectItem key={tt.id} value={tt.id}>
                            {tt.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Facility form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Facility Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Facility Name" 
                                        disabled={createFacilityMutation.isPending}
                                        {...field} 
                                    />
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
                                    <Input 
                                        placeholder="Description" 
                                        disabled={createFacilityMutation.isPending}
                                        {...field} 
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button 
                        type="submit" 
                        variant="secondary" 
                        className="w-full"
                        disabled={createFacilityMutation.isPending || !form.formState.isValid}
                    >
                        {createFacilityMutation.isPending ? "Creating Facility..." : "Create Facility"}
                    </Button>
                    <Button 
                        type="button" 
                        variant="secondaryOutline" 
                        className="w-full" 
                        onClick={onSuccess}
                        disabled={createFacilityMutation.isPending}
                    >
                        Skip
                    </Button>
                </form>
            </Form>
        </div>
    )
}
