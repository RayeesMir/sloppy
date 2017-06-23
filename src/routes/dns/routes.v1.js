import express from 'express'
import * as DNS from '../../lib/dns'

const router = express.Router()
export default router

router.route('/check/:hostname')
  .get((req, res, next) => {
    const hostname = req.params.hostname;
    DNS.check(hostname)
      .then((result) => {
        console.log(result)
        res.json({
          status: 'success',
          data: result,
        })
      })
      .catch(next)
  })

router.route('/monitor')
  .get((req, res, next) => {
    DNS.list()
      .then((result) => {
        res.json({
          status: 'success',
          data: result,
        })
      })
      .catch(next)
  })

