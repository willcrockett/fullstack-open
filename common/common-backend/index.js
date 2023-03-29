
const app = require('./app') // the actual Express application
const config = require('./utils/config') // environment variables
const logger = require('./utils/logger') // console logs

app.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`)
})
