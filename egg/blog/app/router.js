'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/users/signup', controller.users.signup);
  router.post('/api/users/signin', controller.users.signin);
  router.get('/api/users/signout', controller.users.signout);

  router.resources('categories', '/api/categories', controller.categories);
  // router.get('/api/categories', controller.categories.index);
  // router.post('/api/categories', controller.categories.create);
  // router.put('/api/categories/:id', controller.categories.update);
  // router.delete('/api/categories/:id', controller.categories.delete);

  router.resources('articles', '/api/articles', controller.articles);
};
