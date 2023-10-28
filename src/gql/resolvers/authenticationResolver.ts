import { Container } from 'typedi'
import { Resolvers } from '../types/typedSchema'

import { PartnerRepository } from '../../repositories/PartnerRepository'

import { HashService } from '../../services/HashService'
import { TokenService } from '../../services/TokenService'

import PartnerModel from '../../db/models/partner'

Container.set('PartnerModel', PartnerModel)

const partnerRepository = Container.get(PartnerRepository)
const hashService = Container.get<HashService>(HashService)
const tokenService = Container.get<TokenService>(TokenService)


const authenticationResolvers: Resolvers = {
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
    // Add mutations related to authentication.
  },
};

export default authenticationResolvers;