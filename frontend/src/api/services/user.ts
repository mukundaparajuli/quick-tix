import api from '../axios';

export const getUser = async (id: string): Promise<any> => {
    const response = await api.get(`/user/${id}`);
    return response.data;
};