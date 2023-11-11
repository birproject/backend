import { Service } from 'typedi'
import { ServiceModel } from '../db/models/serviceModel'
import { ServiceGateway } from '../gateways/serviceGateway'

// Action will have the own business model logic, like actions inherent to the business
@Service()
export class ServicesAction {
  constructor(private strapiServiceGateway: ServiceGateway) {
  }

  public async fetchServices(): Promise<ServiceModel[]> {
    return await this.strapiServiceGateway.getServices()
  }
}
