import { VenueForm } from "@/components/event-creation-wizard/venue/venue-form"
import { $axios } from "@/lib/axios"

export const createVenue = async ({ eventId, data }: { eventId: number, data: VenueForm }) => {
    const response = await $axios.post(`/venue/create`, { ...data, eventId })
    return response.data
}