// create base repository

import {IBaseRepository} from "../types";
import {CreateOptions, Model, UpdateWriteOpResult} from "mongoose";
import {DeleteResult} from "mongodb";


export default class BaseRepository<T> implements IBaseRepository<T> {
    public _model: Model<T>;

    constructor(schemaModel: Model<T>) {
        this._model = schemaModel;
    }

    async create(data:any): Promise<T> {
        return await this._model.create(data);
    }

    async find(condition: any): Promise<T[]> {
        return await this._model.find(condition);
    }

    async findAll(): Promise<T[]> {
        return await this._model.find({});
    }

    async findById(id: string): Promise<T | null> {
        return await this._model.findById(id);
    }

    async findOne(condition: any): Promise<T | null> {
        return await this._model.findOne(condition);
    }

    async updateById(id: string, data: any):Promise<UpdateWriteOpResult | null> {
        return await this._model.findByIdAndUpdate(id, data, {new: true});
    }

    async updateOne(condition: any, data: any, isNew?: boolean): Promise<UpdateWriteOpResult | null> {
        return await this._model.updateOne(condition, data, {new: isNew || false})
    }

    async updateMany(condition: any, data: any, isNew?: boolean): Promise<UpdateWriteOpResult | null> {
        return await this._model.updateMany(condition, data, {new: isNew || false})
    }

    async deleteById(id: string): Promise<any> {
        return await this._model.findByIdAndDelete(id);
    }

    async deleteOne(condition: any): Promise<any> {
        return await this._model.findOneAndDelete(condition);
    }

    async deleteMany(condition: any): Promise<any> {
        return await this.deleteMany(condition)
    }
}