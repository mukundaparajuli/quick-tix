import { Response } from "express";

class ApiResponse {
    status: number;
    message: string;
    data: any | null;
    error: any | null;

    constructor(
        res: Response,
        status: number = 200,
        message: string | null = null,
        data: any = null,
        error: any = null,
    ) {
        this.status = status;
        this.message = message || this.getDefaultMessage(status);
        this.data = data;
        this.error = error;

        this.send(res);  
    }

    
    private getDefaultMessage(status: number): string {
        const statusMessages: { [key: number]: string } = {
            200: "OK",
            201: "Created",
            400: "Bad Request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not Found",
            422: "Unprocessable Entity",
            500: "Internal Server Error"
        };
        return statusMessages[status] || "Error";
    }

    send(res: Response) {
        return res.status(this.status).json({
            status: this.status,
            message: this.message,
            data: this.data,
            error: this.error,
        });
    }
}

export default ApiResponse;
