import { EventInfoForm } from "@/components/event-creation-wizard/event-info-form"
import { $axios } from "@/lib/axios"

export const createEvent = async (eventData: EventInfoForm) => {
    const response = await $axios.post("/events/create", eventData)
    return response.data
}