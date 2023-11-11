import { Request, Response } from 'express'
import { Service } from 'typedi'
import { ServicesAction } from '../actions/serviceAction'

@Service()
export class ServiceController {
  constructor(private servicesAction: ServicesAction) {
  }

  public async getServices(req: Request, res: Response): Promise<Response> {
    try {
      console.log('attempting to fetch strapi services')
      const services = await this.servicesAction.fetchServices()
      console.log('services fetched successfully', { services })
      return res.json(services)
    } catch (error: any) {
      console.error('failed fetching services', { error })
      return res.status(500).json({ error: error.message })
    }
  }

  async addServiceRecord(req: Request, res: Response) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
    const secret = req.headers['x-webhook-secret']
    if (secret !== WEBHOOK_SECRET) {
      return res.status(401).send('Unauthorized')
    }
    console.log('🔥🔥🔥🔥🔥🔥received an event trying to see whats going on', {
      body: JSON.stringify(req.body)
    })

  }
}
