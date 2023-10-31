import { Resolvers } from '../types/typedSchema'
import authenticationResolvers from './auth/authenticationResolver'
import partnerResolvers from './partners/partnerResolver'
import advertisingResolvers from './ads/advertisingResolver'

export const resolvers: Resolvers = {
  Query: {
    ...authenticationResolvers.Query,
    ...advertisingResolvers.Query
  },
  Mutation: {
    ...partnerResolvers.Mutation,
    ...advertisingResolvers.Mutation
  }
}
