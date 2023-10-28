// actions/authAction.ts
import { PartnerRepository } from '../repositories/PartnerRepository'
import { HashService } from '../services/HashService'
import { TokenService } from '../services/TokenService'
import { Service } from 'typedi'
import { EmailGateway } from '../gateways/SendEmailGateway'
import { ValidationService } from '../services/ValidationService'
import { Partner } from '../db/models/partner'
import { InputMaybe, PartnerInput } from '../gql/types/typedSchema'

@Service()
export class AuthAction {

  constructor(
    private partnerRepository: PartnerRepository,
    private hashService: HashService,
    private tokenService: TokenService,
    private emailGateway: EmailGateway,
    private validationService: ValidationService
  ) {
  }

  async login(email: string, password: string) {
    const partner = await this.partnerRepository.findByEmail(email)
    if (!partner) {
      throw new Error('Email not found')
    }

    const isCorrectCredentials = this.hashService.comparePasswords(password, partner.password)
    if (!isCorrectCredentials) {
      throw new Error('Password incorrect')
    }

    const payload = {
      iss: process.env.ISSUER || 'default-issuer',
      sub: partner.username,
      aud: process.env.AUDIENCE || 'default-audience',
      scopes: ['read:data', 'write:data'] // Consider moving to configuration
    }

    const token = this.tokenService.generateToken(payload)
    return { partner, token }
  }

  async registerPartner(input: InputMaybe<PartnerInput> | undefined): Promise<Partner> {
    if (input?.email || input?.password) throw new Error('Bad Request')
    const { email, password } = input as PartnerInput

    if (!this.validationService.isValidEmail(email)) {
      throw new Error('Email is invalid')
    }
    const hashedPassword = await this.hashService.hashPassword(password)
    // Send email after registration
    await this.emailGateway.sendEmail({
      from: process.env.EMAIL_USER || 'corp@mail.com',
      to: email,
      subject: 'REGISTRATION COMPLETE',
      text: process.env.EMAIL_REGISTRATION_MSG || 'Registration Complete'
    })
    return this.partnerRepository.save({ ...input, password: hashedPassword } as Partner)
  }
}
