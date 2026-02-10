import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { listWebhooks } from '@/routes/list-webhooks'
import { env } from '@/env'
import { getWebhook } from '@/routes/get-webhook'
import { deleteWebhook } from '@/routes/delete-webhook'
import { captureWebhook } from '@/routes/capture-webhook'
import { generateHandler } from '@/routes/generate-handler'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // credentials: true
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Webhook Inspector API',
      description: 'API for capturing and inpecting webhook requests',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(ScalarApiReference, {
  routePrefix: '/docs',
})

app.register(getWebhook)
app.register(deleteWebhook)
app.register(listWebhooks)
app.register(captureWebhook)
app.register(generateHandler)

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`🚀 HTTP server running on http://localhost:${env.PORT} ...`)
    console.log(`📖 Docs available on http://localhost:${env.PORT}/docs ...`)
  })
