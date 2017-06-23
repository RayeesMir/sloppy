import express from 'express';
import dns from './dns/routes.v1'
import profile from './profiles/routes.v1';


const router = express.Router()
export default router

router.use('/v1/profiles', profile)
router.use('/v1/dns', dns)

// CatchAll (handle invalid paths)
router.use('/', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `There is no ${req.method} ${req.path} endpoint`,
  })
})
