/**
 * @fileOverview 通过装饰器注入挂载到 daruk 的模块
 */
import { darukContainer } from '../core/inversify.config';
import { TYPES } from '../core/types';
import { Constructor, PluginClass, TimerClass } from '../typings/daruk';

export function plugin() {
  return (target: Constructor) => {
    // 往构造函数注入一个依赖。 bind 的值是一个 Symbol.for 值
    darukContainer.bind<PluginClass>(TYPES.PLUGINCLASS).to(target);
  };
}

export function timer() {
  return (target: Constructor) => {
    darukContainer.bind<TimerClass>(TYPES.Timer).to(target);
  };
}
