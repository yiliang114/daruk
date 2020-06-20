// 装饰器 polyfill. InversifyJS 用到了反射来获取装饰器的相关元数据，所以需要额外安装库 reflect-metadata
// tslint:disable-next-line
import 'reflect-metadata';
export { injectable, interfaces } from 'inversify';
export { provide, fluentProvide } from 'inversify-binding-decorators';
export { TYPES } from './core/types';
// TODO: 懒加载 ？
export { darukContainer, lazyInject as inject, DarukServer } from './core/inversify.config';
export * from './decorators';
export * from './typings/daruk';
// TODO: 定时程序
export { CronJob } from 'cron';
// core
import Daruk from './core/daruk';
// TODO: 可以优化成 export { default as Daruk } from './core/daruk'
export { Daruk };
