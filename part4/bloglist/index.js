const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
app.databaseReady.then(() => {
  app.listen(config.PORT, () => logger.info(`Server running on port ${config.PORT}`))
}).catch(() => { process.exitCode = 1 })
