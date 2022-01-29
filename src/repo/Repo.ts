import mongoose, { Schema } from 'mongoose';
import { IModel } from '../models/Model';

export type DocumentType<T> = mongoose.Document<any, any, T>;
export type ObjectId = mongoose.Types.ObjectId;
export const SchemaObjectId = mongoose.SchemaTypes.ObjectId;

export class Repo<T extends IModel> {

  private _instance: mongoose.Model<T>;

  constructor(modelName: string, schema?: Schema<T>){
    this._instance = mongoose.model<T>(modelName, schema);
  }

  protected _documentToType = (document: DocumentType<T>) => document.toObject() as T
  protected _documentsToType = (documents: DocumentType<T>[]) => documents.map(
    document => document.toObject() as T
  );

  protected handleException(exception: unknown, doThrow= false){
    console.error(`${this._instance.modelName.toUpperCase()} REPO EXCEPTION: ${exception}`);
    if(doThrow){
      throw exception;
    }
  }

  public async createRecord(newData: Partial<T>): Promise<T | null>{
    const newInstance = new this._instance(newData);
    try{
      return this._documentToType(await newInstance.save());
    }catch(e){
      this.handleException(e);
      return null;
    }
  };

  public async getRecord(_id: string, populate?: string[]): Promise<T | null>{
    try{
      const result = await this._instance.findById(_id, undefined, {
        populate,
      });
      if(result === null){
        return null;
      }
      return this._documentToType(result);
    }catch(e){
      this.handleException(e);
      return null;
    }
  };

  public async getAllRecords(populate?: string[], ...args: unknown[]): Promise<T[] | null>{
    try{
      const results = await this._instance.find({ ...args }, undefined, {
        populate,
      });
      if(results === null){
        return null;
      }

      return this._documentsToType(results)
    }catch(e){
      this.handleException(e);
      return null;
    }
  };

  public async find(populate: string[], filter: mongoose.FilterQuery<T>): Promise<T[] | null>{
    try{
      const results = await (this._instance.find(filter, undefined, {
        populate,
      }));
      if(results === null){
        return null;
      }

      return this._documentsToType(results)
    }catch(e){
      this.handleException(e);
      return null;
    }
  }

  public async updateRecord(_id: string, newData: Partial<T>): Promise<T | null>{
    try{
      const result = await this._instance.updateOne({_id}, newData);
      if(result === null){
        return null;
      }

      return await this.getRecord(_id);
    }catch(e){
      this.handleException(e);
      return null;
    }
  };

  public async deleteRecord(_id: string): Promise<boolean>{
    try{
      const deleteResult = await this._instance.deleteOne({ _id });
      return deleteResult.deletedCount > 0;
    }catch(e){
      this.handleException(e);
      return false;
    }
  };

}