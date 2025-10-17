import { FacilityFormType } from "@/components/event-creation-wizard/facilities/facility-form"
import { $axios } from "@/lib/axios"

export const createFacility = async ({ ticketTypeId, data }: { ticketTypeId: number, data: FacilityFormType }) => {
    const response = await $axios.post(`/facility/create`, { ...data, ticketTypeId })
    return response.data
}