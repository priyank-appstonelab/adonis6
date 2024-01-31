/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/auth/login', [AuthController, 'login'])
router.post('/auth/register', [AuthController, 'register'])
router.get('/auth/email/verify/:email/:id', [AuthController, 'verifyEmail']).as('verifyEmail')

router.post('/auth/password/forgot', [AuthController, 'forgotPassword'])
router
  .post('/auth/password/reset/:id/:token', [AuthController, 'resetPassword'])
  .as('resetPassword')

router
  .group(() => {
    // routes which require authentication
    router.get('/auth/user', [AuthController, 'user'])
    router.post('/auth/logout', [AuthController, 'logout'])
    router.post('/auth/email/verify/resend', [AuthController, 'resendVerificationEmail'])

    router
      .group(() => {
        // routes which require verified email
        router.resource('users', UsersController)
      })
      .use(middleware.verifiedEmail())
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

router.any('*', ({ response }) => {
  response.notFound({ is_success: false, message: 'Page not found', status: 404 })
})
