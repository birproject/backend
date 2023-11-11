import { Inject, Service } from 'typedi'
import AdsModel, { Ads } from '../db/models/ads'


@Service()
export class AdsRepository {

  constructor(@Inject('AdsModel') private adsModel: typeof AdsModel) {
  }

  async getAllAds(): Promise<Ads[]> {
    try {
      return this.adsModel.find({})
    } catch (error) {
      console.error('Error fetching ads:', error)
      throw error
    }
  }

  async save(advertising: Ads): Promise<Ads> {
    const newAdvertising = new this.adsModel(advertising)
    return newAdvertising.save()
  }
}
