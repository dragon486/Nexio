/**
 * Global Error Handler Middleware
 * Standardizes error responses across the entire application.
 */
export const globalErrorHandler = (err, req, res, next) => {
    // 1. Specific Handle: Zod Validation Errors
    if (err.name === "ZodError") {
        const issues = err.issues || err.errors || [];

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: issues.map((e) => ({
                path: e.path,
                message: e.message
            }))
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Structured logging for production observability
    console.error(`[Global Error Handler] [${new Date().toISOString()}] ${req.method} ${req.url}:`, {
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
        statusCode
    });

    res.status(statusCode).json({
        success: false,
        status: "error",
        statusCode,
        message,
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    });
};

/**
 * Async Error Wrapper (optional helper to avoid try-catch blocks in controllers)
 */
export const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
