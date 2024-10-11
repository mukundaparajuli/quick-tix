class ApiError extends Error {
    statusCode: number;               // HTTP status code (e.g., 404, 500)
    message: string;                  // Error message for the API
    data: any;                        // Additional data related to the error
    errors: { [key: string]: any }[] | null; // Array of error objects or null
    stack?: string | undefined;       // Optional stack trace for debugging

    constructor(
        statusCode: number = 500,       // Default to 500 (Internal Server Error)
        message: string = "Internal server error",  // Default error message
        data: any = null,               // Optional additional data
        errors: { [key: string]: any }[] | null = null, // Optional validation errors
        stack: string | undefined = undefined  // Optional stack trace
    ) {
        super(message);                 // Call the base Error constructor with the message
        this.statusCode = statusCode;   // Set the status code
        this.message = message;         // Set the error message
        if (data) this.data = data;     // If additional data is passed, set it
        this.errors = errors ?? null;   // Use nullish coalescing to set errors or null

        // Stack trace handling
        if (stack) {
            this.stack = stack;           // If stack is provided, use it
        } else {
            Error.captureStackTrace(this, this.constructor); // Otherwise, capture the current stack trace
        }
    }
}

export default ApiError;
