/**
 * @fileOverview 优雅关机插件
 */

import ExitHook = require('daruk-exit-hook');
import ShutDown = require('http-server-shutdown');
import { injectable } from 'inversify';
import Daruk from '../core/daruk';
import { darukContainer } from '../core/inversify.config';
import { TYPES } from '../core/types';
import { plugin } from '../decorators';
import { PluginClass } from '../typings/daruk';

@plugin()
@injectable()
class DarukHttpShutdown implements PluginClass {
  public async initPlugin(daruk: Daruk) {
    // 监听 server 服务
    daruk.on('serverReady', () => {
      // TODO: 开启了某个开关。 平滑关闭
      if (daruk.options.gracefulShutdown.enable) {
        // TODO: 不被监控 ？
        const serverShutDown = new ShutDown(daruk.httpServer, { monitor: false });
        // 平滑关闭的时间延迟
        const timeout = daruk.options.gracefulShutdown.timeout;
        // TODO: 从容器中获取一个插件实例 ？？？
        const DarukExitHook = darukContainer.getNamed<ExitHook>(
          TYPES.PluginInstance,
          'DarukExitHook'
        );
        // 添加一个平滑关闭关闭的钩子，不至于一下子就直接退出
        DarukExitHook.addHook(function handleHttpGracefulShutdown(err: Error, cb: Function) {
          daruk.logger.info(`handle unfinished connections, waiting up to ${timeout}ms`);
          const startTime = Date.now();
          serverShutDown
            .serverClose()
            .then(() => {
              daruk.logger.info(`closed all connections and took ${Date.now() - startTime}ms`);
              cb();
            })
            .catch((err: Error) => {
              daruk.logger.error('server shutdown: ' + err.message);
              cb();
            });
          // 避免连接关闭超时
          setTimeout(cb, timeout);
        });
      }
    });
  }
}
