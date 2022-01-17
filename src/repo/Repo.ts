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

  protected handleException(exception: unknown, doThrow= false){
    console.error(`${this._instance.modelName.toUpperCase()} REPO EXCEPTION: ${exception}`);
    if(doThrow){
      throw exception;
    }
  }

  public async createRecord(newData: Partial<T>): Promise<DocumentType<T> | null>{
    const newInstance = new this._instance(newData);
    try{
      return await newInstance.save();
    }catch(e){
      this.handleException(e);
      return null;
    }
  };

  public async getRecord(_id: string, populate?: string[]): Promise<DocumentType<T> | null>{
    try{
      return await this._instance.findById(_id, undefined, {
        populate,
      });
    }catch(e){
      this.handleException(e);
      return null;
    }
  };

  public async getAllRecords(populate?: string[], ...args: unknown[]): Promise<DocumentType<T>[] | null>{
    try{
      return await this._instance.find({ ...args }, undefined, {
        populate,
      });
    }catch(e){
      this.handleException(e);
      return null;
    }
  };

  public async find(populate: string[], filter: mongoose.FilterQuery<T>): Promise<T[] | null>{
    try{
      return (await this._instance.find(filter, undefined, {
        populate,
      })).map(document => document.toObject() as unknown as T);
    }catch(e){
      this.handleException(e);
      return null;
    }
  }

  public async updateRecord(_id: string, newData: Partial<T>): Promise<DocumentType<T> | null>{
    try{
      return await this._instance.findByIdAndUpdate(_id, newData);
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