import 'reflect-metadata'
import { resolvers } from './index'
import { AuthAction } from '../../actions/authAction'
import { Container } from 'typedi'

describe('login resolver', () => {
  let authActionInstance: AuthAction
  let loginSpy: jest.SpyInstance
  let registerPartnerSpy: jest.SpyInstance

  beforeEach(() => {
    // Get the real instance of AuthAction
    authActionInstance = Container.get(AuthAction)
    loginSpy = jest.spyOn(authActionInstance, 'login')
    registerPartnerSpy = jest.spyOn(authActionInstance, 'registerPartner')
    loginSpy.mockResolvedValue({
      partner: { username: 'testuser', email: 'test@email.com' }, // Add other necessary fields
      token: 'test-token'
    })
    registerPartnerSpy.mockResolvedValue({
      username: 'newuser',
      email: 'newuser@email.com'  // Add other necessary fields
    })
  })

  afterEach(() => {
    // Clean up after each test
    loginSpy.mockRestore()
    registerPartnerSpy.mockRestore()
  })

  it('should call login with correct arguments and set context token', async () => {
    const input = {
      email: 'test@email.com',
      password: 'testpass'
    }
    const context: { token?: string } = {}

    // Call the resolver
    const result = await (resolvers as any).Query.login(null, { input }, context)

    // Expect the authAction login method to have been called with correct arguments
    expect(loginSpy).toHaveBeenCalledWith(input.email, input.password)
    // Expect the context to have received the token
    expect(context.token).toBe('test-token')
    // Expect the resolver to return the correct partner data
    expect(result).toEqual({ username: 'testuser', email: 'test@email.com' }) // Add other necessary fields
  })

  it('should call registerPartner with correct arguments', async () => {
    const input = {
      username: 'newuser',
      email: 'newuser@email.com'  // Add other necessary fields
    }
    // Call the resolver
    const result = await (resolvers as any).Mutation.registerPartner(null, { input })
    // Expect the authAction registerPartner method to have been called with correct arguments
    expect(registerPartnerSpy).toHaveBeenCalledWith(input)
    // Expect the resolver to return the correct partner data
    expect(result).toEqual(input)
  })
})
