import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import ResponseHelper from '../helpers/response_helper.js'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class UsersController {
  constructor(private responseHelper: ResponseHelper) {}

  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return this.responseHelper.sendSuccess('Users retrieved successfully.', await User.all())
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const schema = vine.object({
      email: vine
        .string()
        .email()
        .unique((query, value) =>
          query
            .modelQuery(User)
            .where('email', value)
            .first()
            .then((x) => !x)
        ),
      password: vine.string().minLength(8).maxLength(32).confirmed(),
    })
    const input = await vine.validate({ schema, data: request.body() })

    const user = await User.create(input)
    return this.responseHelper.sendSuccess('User created successfully.', user)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return this.responseHelper.sendError('User not found.')
    }
    return this.responseHelper.sendSuccess('User retrieved successfully.', user)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const passwordGroup = vine.group([
      vine.group.if((data) => data.email, {
        password: vine.string(),
      }),
      vine.group.else({}),
    ])
    const schema = vine.object({
      full_name: vine.string().trim().toLowerCase().nullable(),
      email: vine
        .string()
        .email()
        .unique((query, value) =>
          query
            .modelQuery(User)
            .where('email', value)
            .whereNot('id', params.id)
            .first()
            .then((x) => !x)
        )
        .optional(),
    })
    schema.merge(passwordGroup)

    const input: any = await vine.validate({ schema, data: request.body() })

    const user = await User.find(params.id)
    if (!user) {
      return this.responseHelper.sendError('User not found.')
    }
    if (input.email && !(await hash.verify(user.password, input.password))) {
      return this.responseHelper.sendError('invalid password.')
    }
    user.merge(input)
    await user.save()
    return this.responseHelper.sendSuccess('User updated successfully.')
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return this.responseHelper.sendError('User not found.')
    }
    await user.delete()
    return this.responseHelper.sendSuccess('User deleted successfully.')
  }
}
