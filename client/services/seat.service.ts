import { $axios } from "@/lib/axios";
import { CreateSeat } from "@/types/seat";

export const createSeats = async (seats: CreateSeat[]) => {
    const response = await $axios.post("/seats", seats);
    return response.data;
}