import {UpdateWriteOpResult} from "mongoose";

export interface IBaseRepository<T> {
    create(data: T): Promise<T>

    find(condition: any): Promise<T[]>

    findAll(): Promise<T[]>

    findById(id: string): Promise<T | null>

    findOne(condition: any): Promise<T | null>

    updateById(id: string, data: any): Promise<UpdateWriteOpResult | null>

    updateOne(condition: any, data: any, isNew?: boolean): Promise<UpdateWriteOpResult | null>

    updateMany(condition: any, data: any, isNew?: boolean): Promise<UpdateWriteOpResult | null>

    deleteById(id: string): Promise<any>

    deleteOne(condition: any): Promise<any>

    deleteMany(condition: any): Promise<any>
}