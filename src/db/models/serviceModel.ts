import mongoose, { Schema } from 'mongoose'

export type ServiceModel = {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface IService extends Document, ServiceModel {
}

const serviceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    publishedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // Mongoose uses this to automatically manage createdAt and updatedAt properties
  }
)

const ServiceModel = mongoose.model<IService>('Service', serviceSchema)

export default ServiceModel
