import { Container } from 'typedi'
import { PartnerRepository } from '../../repositories/PartnerRepository'
import { Resolvers } from '../types/typedSchema'
import { HashService } from '../../services/HashService'
import { TokenService } from '../../services/TokenService'
import PartnerModel, { Partner } from '../../db/models/partner'
import { authenticated } from '../../middleware/authenticated'
import { EmailGateway } from '../../gateways/SendEmailGateway'
import { ValidationService } from '../../services/ValidationService'

Container.set('PartnerModel', PartnerModel)
const partnerRepository = Container.get(PartnerRepository)
const hashService = Container.get<HashService>(HashService)
const tokenService = Container.get<TokenService>(TokenService)
const sendEmailGateway = Container.get<EmailGateway>(EmailGateway)
const validationService = Container.get<ValidationService>(ValidationService)

export const resolvers: Resolvers = {
  Query: {
    login: async (_: any, { input }, context) => {
      try {
        const { email, password } = input
        const partner = await partnerRepository.findByEmail(email)
        if (!partner) {
          throw new Error('Email not found')
        }
        const isCorrectCredentials = hashService.comparePasswords(password, partner.password)
        if (!isCorrectCredentials) {
          throw new Error('Password incorrect')
        }
        const payload = {
          iss: process.env.ISSUER || 'default-issuer',
          sub: partner.username,
          aud: process.env.AUDIENCE || 'default-audience',
          scopes: ['read:data', 'write:data'] // Consider moving to configuration
        }
        const token = tokenService.generateToken(payload)
        // send token via response header for security
        context.token = token
        return partner
      } catch (e) {
        console.error('Login error:', e) // Log error for diagnostics
        throw e // Re-throw error so client is informed
      }
    }
  },
  Mutation: {
    registerPartner: async (_: any, { input }) => {
      const isValidEmail = validationService.isValidEmail(input?.email as string)
      if (!isValidEmail) {
        throw new Error('Email is invalid')
      }
      if (!input) throw new Error('Invalid request')
      const hashedPassword = await hashService.hashPassword(input.password)
      // send email after registration
      const emailStatus = await sendEmailGateway.sendEmail({
        from: process.env.EMAIL_USER || 'corp@mail.com',
        to: input.email,
        subject: 'REGISTRATION COMPLETE',
        text: process.env.EMAIL_REGISTRATION_MSG || 'Registration Complete'
      })
      console.log('Email status >>', emailStatus)
      return partnerRepository.save({ ...input, password: hashedPassword } as Partner)
    },
    createAd: authenticated(async (_, { input }, context) => {
      // Assuming you will save the Ad to a database and have a service or model for it
      // const ad = await AdService.create(input) // Replace with actual logic
      // return ad
      return { name: 'protected resource granted: Anuncio creado' }
    })
  }
}
