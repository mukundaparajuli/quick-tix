import { FacilityForm } from "@/components/event-creation-wizard/facility-form"
import { $axios } from "@/lib/axios"

export const createFacility = async ({ ticketTypeId, data }: { ticketTypeId: number, data: FacilityForm }) => {
    const response = await $axios.post(`/facility/create`, { ...data, ticketTypeId })
    return response.data
}