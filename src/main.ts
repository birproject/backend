import 'reflect-metadata'
import express from 'express'
import * as http from 'http'
import { ApolloServer } from '@apollo/server'
import { typeDefs } from './gql/types'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import routeController from './controllers/routeController'
import cors from 'cors'
import { json } from 'body-parser'
import { expressMiddleware } from '@apollo/server/express4'
import mongoose, { ConnectOptions } from 'mongoose'
import * as dotenv from 'dotenv'
import { Container } from 'typedi'
import PartnerModel from './db/models/partner'
import { SendTokenOverHeaders } from './apolloPlugins'
import { MainContexter } from './apolloContexters'
import { resolvers } from './gql/resolvers'
import ServiceModel from './db/models/serviceData'

dotenv.config()


export function addDependencies() {
  // Adding mongo dependency to the IoC container
  console.log('📕📕📕📕📕📕📕📕📕📕📕📕📕📕📕📕📕📕📕📕📕📕📕📕Registering Models dependencies')
  Container.set('PartnerModel', PartnerModel)
  Container.set('ServicesModel', ServiceModel)
}


async function createServer() {
  const app = express()
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), SendTokenOverHeaders()],
    introspection: true
  })
  await server.start()

  app.use('/api', cors(), routeController)
  // @ts-ignore
  app.use('/graphql', cors<cors.CorsRequest>(), json(), expressMiddleware(
    server, {
      context: MainContexter
    }))
  const port = process.env.PORT || 4400

  await new Promise<void>(() =>
    httpServer.listen({ port }, () => {
      console.log(`🚀 Server ready at http://localhost:${port}/api`)
      console.log(`🚀 GraphQl Server ready at http://localhost:${port}/graphql`)
    })
  )
}

async function connectMongoDB(): Promise<void> {
  const username = process.env.DB_USERNAME
  const password = process.env.DB_PASSWORD
  const mongoHost = process.env.DB_HOST
  const connectionString = `mongodb+srv://${username}:${password}@${mongoHost}/SAGNIRIB`
  const configuration: ConnectOptions = {
    authMechanism: 'DEFAULT',
    authSource: 'admin'
  }
  await mongoose.connect(connectionString, configuration)
  console.log('💾 Connected to MongoDB 📚📚📚📚📚📚📚📚📚📚')
}


async function main() {
  try {
    addDependencies()
    await connectMongoDB()
    await createServer()
  } catch (err: any) {
    console.error(`Error: ${err.message}`)
  }
}

main()
