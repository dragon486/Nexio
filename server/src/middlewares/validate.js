/**
 * Zod Validation Middleware
 * Executes the provided Zod schema against the request body.
 * If validation fails, it passes the error to the global handler.
 */
export const validate = (schema) => (req, res, next) => {
    try {
        // Use parse() as it throws a ZodError for the global handler to catch
        // We assign validated data back to req.body or a specific property
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        // err will be a ZodError, which our globalErrorHandler now handles
        next(err);
    }
};
