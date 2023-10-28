import { Container } from 'typedi'
import { Resolvers } from '../types/typedSchema'

import { PartnerRepository } from '../../repositories/PartnerRepository'
import PartnerModel, { Partner } from '../../db/models/partner'


import { HashService } from '../../services/HashService'
import { ValidationService } from '../../services/ValidationService'

import { EmailGateway } from '../../gateways/SendEmailGateway'

const validationService = Container.get<ValidationService>(ValidationService)
const sendEmailGateway = Container.get<EmailGateway>(EmailGateway)

Container.set('PartnerModel', PartnerModel)

const partnerRepository = Container.get(PartnerRepository)
const hashService = Container.get<HashService>(HashService)


const partnerResolvers: Resolvers = {
  Query: {
    // Add queries for partners
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
  },
};

export default partnerResolvers;