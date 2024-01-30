import { HttpContext } from '@adonisjs/core/http'

export default class ResponseHelper {
  ctx: any

  sendSuccess(message: string, data: any = null, status = 200) {
    this.ctx = HttpContext.getOrFail()
    return this.ctx.response.status(status).send({
      is_success: true,
      status,
      message,
      data,
      errors: null,
    })
  }
  sendError(message: string = 'Something went wrong!', data: any = null, status = 422) {
    this.ctx = HttpContext.getOrFail()
    return this.ctx.response.status(status).send({
      is_success: false,
      status,
      message,
      data,
      errors: null,
    })
  }
}
