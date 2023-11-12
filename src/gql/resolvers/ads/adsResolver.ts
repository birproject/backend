import { Container } from 'typedi'
import { Resolvers } from '../../types/typedSchema'

import { AdsRepository } from '../../../repositories/AdsRepository'
import AdsModel, { Ads } from '../../../db/models/ads'

import { ValidationService } from '../../../services/ValidationService'

import { authenticated } from '../../../middleware/authenticated'

Container.set('AdsModel', AdsModel)

const validationService = Container.get<ValidationService>(ValidationService)
const adsRepository = Container.get(AdsRepository)


const advertisingResolvers: Resolvers = {
  Query: {
    async getAds(_parent, _args, _context) {
      return adsRepository.getAllAds()
    }
  },
  Mutation: {
    createAd: authenticated(async (_, { input }, context) => {
      if (!input) throw new Error('Invalid request')
      const isValidPhoneNumber = validationService.isValidPhoneNumber(input?.phoneNumber as string)
      if (!isValidPhoneNumber) {
        throw new Error('Phone number is invalid')
      }
      return adsRepository.save({ ...input } as Ads)
    })
  }
}

export default advertisingResolvers
