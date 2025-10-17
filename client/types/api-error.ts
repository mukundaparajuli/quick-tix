export interface ApiErrorInterface {
    status: number;
    message: string;
    errors?: Record<string, string>[];
    stack?: string;
}
