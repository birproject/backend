import { Service } from 'typedi'
import { AdsRepository } from '../repositories/AdsRepository'
import DataLoader from 'dataloader'

@Service()
class DataloaderHandler {
  adsRepositoryLoader: any

  constructor(private adsRepository: AdsRepository) {
    this.adsRepositoryLoader = new DataLoader(this.adsRepository.getAdsById)
  }

}
