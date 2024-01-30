import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { inject } from '@adonisjs/core'
import ResponseHelper from '../helpers/response_helper.js'

@inject()
export default class HttpExceptionHandler extends ExceptionHandler {
  constructor(private responseHelper: ResponseHelper) {
    super()
  }
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      this.responseHelper.sendError(error.messages[0].message, error.messages)
      return
    }
    return this.responseHelper.sendError()
    // return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
