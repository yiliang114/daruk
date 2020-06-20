import { injectable } from 'inversify';
import Daruk from '../core/daruk';
import { darukContainer } from '../core/inversify.config';
import { TYPES } from '../core/types';
import { plugin } from '../decorators';
import { MiddlewareClass, PluginClass } from '../typings/daruk';

@plugin()
@injectable()
class GlobalMiddleware implements PluginClass {
  public async initPlugin(daruk: Daruk) {
    // 进入每一个中间件之前的执行操作
    daruk.on('routerUseBefore', () => {
      if (darukContainer.isBound(TYPES.Middleware)) {
        let buildInMiddlewareOrder = ['daruk_request_id', 'daruk_logger', 'daruk_body'];
        let middlewareOrder = buildInMiddlewareOrder.concat(daruk.options.middlewareOrder);

        // TODO: 这里不会有异步的问题么？
        middlewareOrder.forEach((midname) => {
          let mid = darukContainer.getNamed<MiddlewareClass>(TYPES.Middleware, midname);
          let usehandle = mid.initMiddleware(daruk);
          // @ts-ignore
          if (usehandle) daruk.app.use(usehandle, midname);
        });
      }
    });
  }
}
