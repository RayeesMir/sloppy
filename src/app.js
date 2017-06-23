import express from 'express'
import logger from 'winston'
import './lib/logging'
import routes from './routes'

const app = express()

// for testing
export default app

// init before any routes to be able to log all requests
app.use((req, res, next) => {
  const end = res.end
  res.end = (chunk, encoding) => {
    res.end = end
    res.end(chunk, encoding)
    const url = req.originalUrl || req.url
    logger.debug(`HTTP ${req.method} ${url}`, {
      componentName: 'express',
      functionName: 'serve',
      code: res.statusCode,
      user: req.user && req.user.id,
      useragent: req.headers['user-agent'],
    })
  }
  next()
})

app.use(routes)

// init error handler after other routes, to be able to log all errors
app.use((error, req, res) => {
  const status = error.status || 500

  const exceptionMeta = logger.exception.getAllInfo(error)
  const trace = exceptionMeta.trace.map(entry => `${entry.file}:${entry.line}`).join(',')

  // Don't log 401/404 errors, will still show up in debug level
  if (status !== 401 && status !== 404) {
    logger.error(`${error.message} ${error.reason} ${trace}`, {
      componentName: 'express',
      functionName: 'serve',
      error,
    })
  }

  res.status(status).json({
    status: 'error',
    message: error.message,
    reason: error.reason,
  })
})

const wwwPort = process.env.WWW_PORT || 5000
app.listen(wwwPort, () => {
  logger.info(`Express started, listening at http://localhost:${wwwPort}`, {
    componentName: 'express',
    functionName: 'start',
  })
})

