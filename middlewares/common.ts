import {NextFunction, Request, Response} from 'express'
import {ISchema, ValidationError} from "yup";

export function validate<T>(schema: ISchema<T>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate(req.body)
        } catch (e:any) {
            return res.status(400).json(e.message)
        }

        return next()
    }
}