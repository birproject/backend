import { Container } from 'typedi'
import { Resolvers } from '../../types/typedSchema'

import { AdvertisingRepository } from '../../../repositories/AdvertisingRepository'
import AdvertisingModel, { Advertising } from '../../../db/models/advertising'

import { ValidationService } from '../../../services/ValidationService'

import { authenticated } from '../../../middleware/authenticated'

Container.set('AdvertisingModel', AdvertisingModel)

const validationService = Container.get<ValidationService>(ValidationService)
const advertisingRepository = Container.get(AdvertisingRepository)


const advertisingResolvers: Resolvers = {
  Query: {
    // Add queries for partners
  },
  Mutation: {
    createAd: authenticated(async (_, { input }, context) => {
      if (!input) throw new Error('Invalid request')
      const isValidPhoneNumber = validationService.isValidPhoneNumber(input?.phoneNumber as string)
      if (!isValidPhoneNumber) {
        throw new Error('Phone number is invalid')
      }
      return advertisingRepository.save({ ...input } as Advertising)
    })
  }
}

export default advertisingResolvers
