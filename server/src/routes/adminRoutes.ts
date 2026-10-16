import { Router } from 'express'
import * as adminController from '../controllers/adminController.js'

const router = Router()

router.get('/overview', adminController.getOverview)
router.get('/live-ops', adminController.getLiveOps)
router.get('/commissions', adminController.getCommissions)
router.get('/reports', adminController.getReports)
router.get('/helpers', adminController.getHelpers)
router.get('/audit-logs', adminController.getAuditLogs)

export default router
