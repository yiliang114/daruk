/**
 * @fileOverview 根据运行时环境获取默认的 daruk options
 */

import { join } from 'path';
import { Options } from '../../types/daruk_options';

export default function getDefaultOptions(rootPath: string, name: string, debug: boolean): Options {
  return {
    rootPath,
    servicePath: join(rootPath, 'services'),
    gluePath: join(rootPath, 'glues'),
    timerPath: join(rootPath, 'timers'),
    // 默认的中间件路径
    middlewarePath: join(rootPath, 'middlewares'),
    // 默认的控制层的路径
    controllerPath: join(rootPath, 'controllers'),
    utilPath: join(rootPath, 'utils'),
    // 默认的 daruk 配置文件是根目录下面的 daruk.config.js or daruk.config.ts 文件
    darukConfigPath: join(rootPath, 'daruk.config'),
    // 默认的 config 配置文件路径
    configPath: join(rootPath, 'config'),
    bodyOptions: {},
    debug,
    // monitor: {
    //   enable: false,
    //   v8AnalyticsPath: 'v8-analytics',
    //   v8ProfilerPath: 'v8-profiler-node8',
    //   auth: {
    //     name: '',
    //     password: ''
    //   }
    // },
    gracefulShutdown: {
      enable: false,
      timeout: 10 * 1000
    },
    loggerOptions: {
      level: debug ? 'info' : 'silly', // log等级，超过该级别的日志不会输出
      customLevels: {
        // 自定义log等级
        access: 2
      },
      transports: {
        file: false, // 输出日志文件的路径
        console: true // 是否在终端输出日志
      },
      overwriteConsole: !debug, // 非debug模式下，覆写 console
      logExt: {
        // 加到日志对象中的额外信息
        logType: name
      },
      fileInfo: debug,
      prettyLog: debug,
      disable: false, // 禁止输出日志
      notStringifyLevles: [
        // 不对日志的message字段进行JSON.stringify的日志等级
        'access'
      ]
    },
    customLogger: null,
    // koa logger middleware 的配置
    loggerMiddleware: {},
    requestId: {
      inject: true
    }
  };
}
