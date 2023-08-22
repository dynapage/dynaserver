const express = require('express');
const authRoute = require('./auth.route');
const docsRoute = require('./docs.route');
const dynaAppRoute = require('./dynapage1.route');
const config = require('../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
  {
    path: '/',
    route: dynaAppRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/',
    route: dynaAppRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.use('/boards', require('./board'));
router.use('/boards/sections', require('./section'));
router.use('/boards/:boardId/:dbName/tasks', require('./task'));

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
