import nano from 'nano'
import dns from 'dns'
import logger from 'winston'

const nanoInstance = nano(process.env.npm_package_config_couchdburl)
const lookupsDB = nanoInstance.db.use('lookups')
const designDoc = require('../../database/dns');

function createDB(connection, dbname) {
  return new Promise((resolve, reject) => {
    connection.db.create(dbname, (error) => {
      if (error) {
        if (error.statusCode === 412) {
          resolve();
        }
        reject(error);
      } else {
        resolve();
      }
    })
  })
}

function createDesignDoc(db, doc) {
  return new Promise((resolve, reject) => {
    db.insert(doc, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    })
  })
}

function insertDocument(db, doc, name) {
  return new Promise((resolve, reject) => {
    db.insert(doc, name, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

function lookup(host) {
  return new Promise((resolve, reject) => {
    dns.lookup(host, (err, address) => {
      if (err) {
        reject(err)
      } else {
        resolve(address);
      }
    });
  })
}

function getDocument(db, name, query) {
  return new Promise((resolve, reject) => {
    db.get(name, query, (error, data) => {
      if (error) {
        if (error.statusCode === 404) {
          resolve();
        } else {
          reject();
        }
      } else {
        resolve(data)
      }
    })
  })
}
export function check(hostname) {
  /**
  1.Check Method resolves hostname and matches it will `lb.sloppy.io` IP
  it uses lookup twice becoz it checks `lb.sloppy.io` as well 
  instead of constant(IP address) of `lb.sloppy.io`.IP address of `lb.sloppy.io` can changes at any point of time   
  2.Check can also do lookup in parrllel as well insted of "Promise.All"
  3.we can also check entry of domain locally first
  **/
  const doc = {
    domain: hostname,
    timestamp: new Date().getTime(),
  };
  return new Promise((resolve, reject) => {
    const rejx = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!rejx.test(hostname)) {
      reject();
    }
    Promise.all([lookup(hostname), lookup('lb.sloppy.io')])
      .then((result) => {
        if (result[0] === result[1]) {
          doc.match = true;
        } else {
          doc.match = false;
        }
        return getDocument(lookupsDB, hostname, {});
      })
      .then((result) => {
        const res = result;
        if (result) {
          res.match = doc.match;
          return insertDocument(lookupsDB, res, res.domain);
        }
        return insertDocument(lookupsDB, doc, doc.domain);
      })
      .then(() => {
        delete doc.timestamp;
        resolve(doc);
      })
      .catch(() => {
        reject()
      })
  })
}
export function list() {
  return new Promise((resolve, reject) => {
    lookupsDB.view('dns', 'hostname', {}, (error, result) => {
      if (error) {
        reject(error)
      }
      resolve(result.rows.map((row) => {
        const {
          domain,
          match,
        } = row.value
        return {
          domain,
          match,
        }
      }))
    })
  })
}
if (process.env.NODE_ENV !== 'test') {
  logger.info('creating dns db', {
    componentName: 'dns',
    functionName: 'init',
  })
  createDB(nanoInstance, 'lookups')
    .then(createDesignDoc(lookupsDB, designDoc))
    .then(() => {
      logger.info('Database Created', {
        componentName: 'dns',
        functionName: 'init',
      })
    })
    .catch((error) => {
      throw error;
    })
}
