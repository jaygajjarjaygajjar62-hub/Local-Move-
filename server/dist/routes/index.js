import { Router } from 'express';
import authRoutes from './authRoutes.js';
import orderRoutes from './orderRoutes.js';
import pricingRoutes from './pricingRoutes.js';
import driverRoutes from './driverRoutes.js';
import addressRoutes from './addressRoutes.js';
import walletRoutes from './walletRoutes.js';
import claimRoutes from './claimRoutes.js';
import supportRoutes from './supportRoutes.js';
import adminRoutes from './adminRoutes.js';
import contentRoutes from './contentRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import mapsRoutes from './mapsRoutes.js';
const apiRouter = Router();
// Health check
apiRouter.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Local Move API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
// Sub-routers
apiRouter.use('/auth', authRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/pricing', pricingRoutes);
apiRouter.use('/drivers', driverRoutes);
apiRouter.use('/addresses', addressRoutes);
apiRouter.use('/wallet', walletRoutes);
apiRouter.use('/claims', claimRoutes);
apiRouter.use('/support', supportRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/content', contentRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/uploads', uploadRoutes);
apiRouter.use('/maps', mapsRoutes);
export default apiRouter;
//# sourceMappingURL=index.js.map