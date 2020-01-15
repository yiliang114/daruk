/**
 * @fileOverview 覆写 koa.use 方法
 * 从而计算每个中间件的执行耗时
 */

import convertHrtime = require('convert-hrtime');
import { Daruk } from '../typings/daruk';
import Events from './daruk_event';

const midNames: string[] = [];
const WRAP_MIDDLEWARE_USE = Symbol('WRAP_MIDDLEWARE_USE');

function wrapUse(fn: Function, name: string) {
  let f = async (ctx: any, next: Function) => {
    enterMid(ctx);
    await fn(ctx, next);
    outMid(ctx);
  };
  Object.defineProperty(f, 'name', { value: name, writable: false });
  return f;
}

function enterMid(ctx: any) {
  // 获取保存在 ctx 中的时间
  let time = getTimeInfo(ctx);
  // TODO: 推入当前时间
  time.list.push(getHrTime());
}

function outMid(ctx: any) {
  let ns2ms = 1000000;
  let time = getTimeInfo(ctx);
  // 最后进入的中间件，最先出来
  let start = time.list.pop();
  // 当前中间件内部时间减去上一个中间件的时间
  let diff = getHrTime() - start - time.prev;
  time.prev += diff;
  // 更新上个中间件的时间
  time.diff.unshift(diff);
  if (time.list.length === 0) {
    // 所有中间件都被 pop 掉之后，结束所有mid
    let data: any = {};
    let sum = 0;
    time.diff.forEach(function summeryTimeConsumption(diff: number, index: number) {
      sum += diff;
      let name = midNames[index];
      if (name === 'router') {
        name = `router:${ctx.request.url}`;
      }
      data[name] = diff / ns2ms;
    });
    data.sum = sum / ns2ms;
    ctx.middleware_perf = data;
    Events.emit('access', ctx);
  }
}

function getTimeInfo(ctx: any) {
  // 将时间信息保存到 ctx
  let timeInfo = ctx[WRAP_MIDDLEWARE_USE];
  if (!timeInfo) {
    timeInfo = {
      prev: 0,
      list: [],
      diff: []
    };
    ctx[WRAP_MIDDLEWARE_USE] = timeInfo;
  }
  return timeInfo;
}

function getHrTime() {
  return convertHrtime(process.hrtime()).nanoseconds;
}

export default function wrapMiddleware(app: Daruk.DarukCore) {
  const use = app.use;
  app.use = function wrappedKoaUse(fn: Function, name: string) {
    midNames.push(name || 'index_' + midNames.length);
    return use.call(app, wrapUse(fn, name));
  };
}
