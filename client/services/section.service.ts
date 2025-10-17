import { SectionForm } from "@/components/event-creation-wizard/sections/section-form"
import { $axios } from "@/lib/axios"

export const createSection = async ({ venueId, data }: { venueId: number, data: SectionForm }) => {
    const response = await $axios.post(`/section/create`, { ...data, venueId })
    return response.data
}