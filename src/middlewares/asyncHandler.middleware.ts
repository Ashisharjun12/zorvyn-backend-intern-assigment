import { Request, Response, NextFunction, RequestHandler } from "express"



// async handler middleware
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next)
    }
}