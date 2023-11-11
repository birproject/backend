import { FetchPartnerServicesService } from '../services/fetchPartnerServicesService'
import { ServiceModel } from '../db/models/serviceModel'
import { Service } from 'typedi'

// Gateway is the bridge to communicate different external services either Strapi, DataBase or Third party APIS
@Service()
export class ServiceGateway {

  // tslint:disable-next-line:no-empty
  constructor(private fetchPartnerServicesService: FetchPartnerServicesService) {
  }

  async getServices(): Promise<ServiceModel[]> {
    return await this.fetchPartnerServicesService.fetchServices()
  }


}
