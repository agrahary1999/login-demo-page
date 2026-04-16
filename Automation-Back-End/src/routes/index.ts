import { Router } from 'express';
import { authRouter } from '../auth/auth.router';
import { featureRouter } from '../feature/feature.router';
import { dashboardRouter } from '../dashboard/dashboard.router';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

const routes = [
  { path: '/auth', router: authRouter, isPublic: true },
  { path: '/features', router: featureRouter, isPublic: false },
  { path: '/dashboard', router: dashboardRouter, isPublic: false }
];

routes.forEach(({ path, router: routeRouter, isPublic }) => {
  if (isPublic) {
    router.use(path, routeRouter);
  } else {
    router.use(path, authMiddleware, routeRouter);
  }
});

export default router;