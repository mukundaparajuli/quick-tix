import { TicketTypeForm } from "@/components/event-creation-wizard/ticket-types/ticket-type-form";
import { $axios } from "@/lib/axios";

export const createTicketType = async ({ eventId, data }: { eventId: number, data: TicketTypeForm }) => {
    const response = await $axios.post(`/ticket-type/create`, { ...data, eventId })
    return response.data
}

export const createTicketTypesBulk = async (eventId: number, data: TicketTypeForm[]) => {
    const response = await $axios.post(`/ticket-type/create-many`, { ticketTypes: data })
    return response.data
}