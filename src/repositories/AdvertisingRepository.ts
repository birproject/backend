import { Inject, Service } from 'typedi'
import AdvertisingModel, { Advertising } from '../db/models/advertising'


@Service()
export class AdvertisingRepository {

  constructor(@Inject('AdvertisingModel') private advertisingModel: typeof AdvertisingModel) {
  }

  async getAllAds(): Promise<Advertising[]> {
    try {
      return this.advertisingModel.find({})
    } catch (error) {
      console.error('Error fetching ads:', error)
      throw error
    }
  }

  async save(advertising: Advertising): Promise<Advertising> {
    const newAdvertising = new this.advertisingModel(advertising)
    return newAdvertising.save()
  }
}
