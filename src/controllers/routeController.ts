import express from 'express'
import { Container } from 'typedi'
import { ServiceController } from './serviceController'

const router = express.Router()
const serviceController = Container.get<ServiceController>(ServiceController)

router.get('/test', (req, res) => {
  res.send('Hello World')
})

router.get('/services', async (req, res) => serviceController.getServices(req, res))


export default router
