import { Service } from 'typedi'
import axios, { AxiosInstance } from 'axios'
import { ServiceModel } from '../db/models/Service'
import * as dotenv from 'dotenv'

@Service()
export class FetchPartnerServicesService {

  private axiosInstance: AxiosInstance

  constructor() {
    dotenv.config()
    this.axiosInstance = axios.create({
      baseURL: process.env.STRAPI_PROD_URL,
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_AUTH_TOKEN}` // Include the Bearer token in the header
      }
    })
  }

  public async fetchServices(): Promise<ServiceModel[]> {
    try {
      const response = await this.axiosInstance.get('/services')
      return response.data.data.map((item: any) => this.transformToServiceModel(item))
    } catch (error) {
      throw new Error(`Failed to fetch services: ${error}`)
    }
  }

  private transformToServiceModel(item: any): ServiceModel {
    const { name, description, createdAt, updatedAt, publishedAt } = item.attributes
    return { name, description, createdAt, updatedAt, publishedAt }
  }

}
