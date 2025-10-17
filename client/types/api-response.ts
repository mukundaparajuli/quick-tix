export interface ApiResponseInterface<T = any> {
    status: number;
    message: string;
    errors?: Record<string, string>[];
    data?: T;
}

export interface PaginatedApiResponse<T = any> {
    status: number;
    message: string;
    errors?: Record<string, string>[];
    data: {
        data: T;
        count: number;
    };
}