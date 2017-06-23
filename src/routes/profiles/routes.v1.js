import express from 'express'
import * as profiles from '../../lib/profiles'

const router = express.Router()
export default router

router.route('/')
  .get((req, res, next) => {
    profiles.list()
      .then((profile) => {
        res.json({
          status: 'success',
          data: profile,
        })
      })
      .catch(next)
  })

