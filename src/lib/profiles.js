import nano from 'nano'
import logger from 'winston'

const nanoInstance = nano(process.env.npm_package_config_couchdburl)
const profilesDB = nanoInstance.db.use('profiles')
// console.log("This might be address",process.env.npm_package_config_couchdburl)
export function list() {
  return new Promise((resolve, reject) => {
    profilesDB.view('profiles', 'by-email', {}, (error, response) => {
      if (error) {
        reject(error)
        return
      }
      resolve(response.rows.map((row) => {
        const { user, email } = row.value
        return { user, email }
      }))
    })
  })
}

// initialise the DB with some demo data
if (process.env.NODE_ENV !== 'test') {
  const designDocument = require('../../database/profiles') // eslint-disable-line global-require
  logger.info('creating profiles db', {
    componentName: 'profiles',
    functionName: 'init',
    designDocument,
  })
  nanoInstance.db.create('profiles', (createError) => {
    if (createError) {
      // nothing to do if it already exists
      if (createError.statusCode === 412) {
        return
      }
      throw createError
    }
    profilesDB.insert(designDocument, (insertDesignError) => {
      if (insertDesignError) {
        throw insertDesignError
      }
      profilesDB.bulk({
        docs: [
          {
            email: 'peter@pan.com',
            user: 'Peter',
          },
          {
            email: 'info@sloppy.io',
            user: 'Sloth',
          },
        ],
      })
    })
  })
}
