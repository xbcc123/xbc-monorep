import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  // 收集错误上报
  router.post('/api/error', controller.error.create);

  // 获取错误上报信息
  router.get('/api/getError', controller.error.list);

};
