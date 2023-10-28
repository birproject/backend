import { Container } from 'typedi'
import { Resolvers } from '../types/typedSchema'
import PartnerModel from '../../db/models/partner'
import AdvertisingModel, { Advertising } from '../../db/models/advertising'
import { authenticated } from '../../middleware/authenticated'
import { ValidationService } from '../../services/ValidationService'
import { AdvertisingRepository } from '../../repositories/AdvertisingRepository'
import { AuthAction } from '../../actions/authAction'

Container.set('PartnerModel', PartnerModel)
Container.set('AdvertisingModel', AdvertisingModel)
const advertisingRepository = Container.get(AdvertisingRepository)
const validationService = Container.get<ValidationService>(ValidationService)
const authAction = Container.get<AuthAction>(AuthAction)

export const resolvers: Resolvers = {
  Query: {
    login: async (_: any, { input }, context) => {
      try {
        const { email, password } = input
        const { partner, token } = await authAction.login(email, password)
        // return token into headers through the plugin
        context.token = token
        return partner
      } catch (e) {
        console.error('Login error:', e)
        throw e
      }
    }
  },
  Mutation: {
    registerPartner: async (_: any, { input }) => {
      try {
        return await authAction.registerPartner(input)
      } catch (e) {
        console.error('Registration error:', e)
        throw e
      }
    },
    createAd: authenticated(async (_, { input }, _context) => {
      if (!input) throw new Error('Invalid request')
      const isValidPhoneNumber = validationService.isValidPhoneNumber(input?.phoneNumber as string)
      if (!isValidPhoneNumber) {
        throw new Error('Phone number is invalid')
      }
      return advertisingRepository.save({ ...input } as Advertising)
    })
  }
}
