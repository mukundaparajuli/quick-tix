import { EventInfoForm } from "@/components/event-creation-wizard/eventinfo/event-info-form"
import { $axios } from "@/lib/axios"

export const createEvent = async (eventData: EventInfoForm) => {
    const response = await $axios.post("/events/create", eventData)
    return response.data
}

export const markAsPublished = async (eventId: number) => {
    const response = await $axios.post(`/events/${eventId}/publish`)
    return response.data
}

export const getAllEvents = async () => {
    const response = await $axios.get("/events")
    return response.data
}