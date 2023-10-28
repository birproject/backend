import { Resolvers } from '../types/typedSchema'
import authenticationResolvers from './authenticationResolver';
import partnerResolvers from './partnerResolver';
import advertisingResolvers from './advertisingResolver';

export const resolvers: Resolvers = {
  Query: {
    ...authenticationResolvers.Query
  },
  Mutation: {
    ...partnerResolvers.Mutation,
    ...advertisingResolvers.Mutation
  }
}
