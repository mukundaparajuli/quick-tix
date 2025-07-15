import api from "../axios";

export const getPopularEvents = async () => {
    const response = await api.get(`/event/popular`);
    return response.data;
}

export const getEventsNearMe = async () => {
    const response = await api.get(`/event/popular`);
    return response.data;
}

export const getAllEvents = async () => {
    const response = await api.get('/event/all-events');
    return response.data;
}

export const getEventById = async (id: string) => {
    const response = await api.get('/event/' + id);
    return response.data;
}