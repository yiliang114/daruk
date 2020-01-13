import { CronJob } from 'cron';
import KoaLogger = require('daruk-logger');
import EventEmitter = require('events');
import Http = require('http');
import Https = require('https');
import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Options, PartialOptions } from './daruk_options';

interface RegisterDes {
  name: string;
  export: any;
}

type method = 'body' | 'query' | 'params';
type validateFunc = (value: string) => string | undefined;

declare module 'daruk' {
  interface Config {
    [key: string]: any;
  }
  interface GlobalModule {
    [key: string]: any;
  }
  interface Util {
    [key: string]: any;
  }
  interface Glue {
    [key: string]: any;
  }
  interface Timer {
    [key: string]: CronJob;
  }
  interface Service {
    [key: string]: any;
  }
  interface Controller {
    [key: string]: any;
  }
  interface Request extends Koa.Request {
    [key: string]: any;
  }
  interface Response extends Koa.Response {
    [key: string]: any;
  }

  type ExtractInterface<T> = { [P in keyof T]: new (ctx: Context) => T[P] };

  type AllDarukEventName =
    | 'configLoaded'
    | 'darukConfigLoaded'
    | 'utilLoaded'
    | 'glueLoaded'
    | 'serviceLoaded'
    | 'middlewareLoaded'
    | 'controllerLoaded'
    | 'timerLoaded'
    | 'access'
    | 'exit';

  export class Daruk extends Koa {
    public name: string;
    public readonly config: Config;
    public readonly globalModule: GlobalModule;
    public readonly util: Util;
    public readonly glue: Glue;
    public readonly timer: Timer;
    public readonly httpServer: Http.Server;
    public logger: KoaLogger.logger;
    public options: Options;
    public readonly service: Service;
    public router: Router;
    public readonly module: {
      readonly service: ExtractInterface<Service>;
      readonly controller: ExtractInterface<Controller>;
      readonly globalModule: GlobalModule;
      readonly util: Util;
      readonly glue: Glue;
    };
    public prettyLog: (
      msg: string,
      ext?: { type?: string; level?: string; init?: boolean }
    ) => void;
    public exitHook: {
      addHook: (cb: Function) => void;
    };
    public constructor(name: string, options: PartialOptions);
    public run(port: number | string, host?: string | Function, cb?: Function): Http.Server;
    /**
     * Shorthand for:
     *
     *    http.createServer(app.callback()).listen(...)
     *    copy from Koa
     */
    public listen(
      port?: number,
      hostname?: string,
      backlog?: number,
      listeningListener?: () => void
    ): Http.Server;
    public listen(port: number, hostname?: string, listeningListener?: () => void): Http.Server;
    public listen(port: number, backlog?: number, listeningListener?: () => void): Http.Server;
    public listen(port: number, listeningListener?: () => void): Http.Server;
    public listen(path: string, backlog?: number, listeningListener?: () => void): Http.Server;
    public listen(path: string, listeningListener?: () => void): Http.Server;
    public listen(options: ListenOptions, listeningListener?: () => void): Http.Server;
    public listen(handle: any, backlog?: number, listeningListener?: () => void): Http.Server;
    public listen(handle: any, listeningListener?: () => void): Http.Server;

    public serverReady(server: Http.Server | Https.Server): void;
    public registerTimer(describe: RegisterDes | Array<RegisterDes>): void;
    public registerService(describe: RegisterDes | Array<RegisterDes>): void;
    public registerMiddleware(describe: RegisterDes | Array<RegisterDes>): void;
    public registerController(describe: RegisterDes | Array<RegisterDes>): void;
    public registerUtil(describe: RegisterDes | Array<RegisterDes>): void;
    public mockContext(req?: {}): Context;
  }

  /**
   * Copy from Koa
   */
  interface ListenOptions {
    port?: number;
    host?: string;
    backlog?: number;
    path?: string;
    exclusive?: boolean;
    readableAll?: boolean;
    writableAll?: boolean;
  }
  export interface Context extends Koa.Context {
    readonly config: Config;
    readonly globalModule: GlobalModule;
    readonly util: Util;
    readonly glue: Glue;
    readonly timer: Timer;
    readonly service: Service;
    readonly controller: Controller;
  }

  class BaseContext {
    public readonly ctx: Context;
    public readonly app: Daruk;
    public readonly service: Service;
    public constructor(ctx: Context);
  }
  export class BaseController extends BaseContext {}
  export class BaseService extends BaseContext {}

  class DarukEventsClass extends EventEmitter {
    public on(event: AllDarukEventName | string | symbol, listener: (...args: any[]) => void): this;
    public addListener(
      event: AllDarukEventName | string | symbol,
      listener: (...args: any[]) => void
    ): this;
  }
  // @ts-ignore
  export const DarukEvents = new DarukEventsClass();

  export function post(path: string): MethodDecorator;
  export function get(path: string): MethodDecorator;
  export function del(path: string): MethodDecorator;
  export function put(path: string): MethodDecorator;
  export function patch(path: string): MethodDecorator;
  export function options(path: string): MethodDecorator;
  export function head(path: string): MethodDecorator;
  export function all(path: string): MethodDecorator;

  export function json(): MethodDecorator;
  export function JSON(): MethodDecorator;
  export function prefix(path: string): MethodDecorator;
  export function disabled(): MethodDecorator | ClassDecorator;
  export function redirect(path: string): MethodDecorator;
  export function type(type: string): MethodDecorator;
  export function header(key: string, value: string): MethodDecorator;
  export function header(key: { [key: string]: string }): MethodDecorator;
  export function cache(
    callback: (cacheKey: string, shouldCacheData?: string) => Promise<string>
  ): MethodDecorator;

  export function middleware(middlewareName: string, options?: any): MethodDecorator;
  export function required(config: {
    body?: string[];
    query?: string[];
    params?: string[];
  }): MethodDecorator;

  interface ParseType {
    [key: string]:
      | ArrayConstructor
      | BooleanConstructor
      | StringConstructor
      | NumberConstructor
      | ObjectConstructor;
  }

  export function typeParse(config: {
    body?: ParseType;
    query?: ParseType;
    params?: ParseType;
  }): MethodDecorator;

  export function validate(
    method: method,
    key: string,
    validateFunc: validateFunc
  ): MethodDecorator;

  type PropDecoratorFunc = (field?: string) => PropertyDecorator;

  export const config: PropDecoratorFunc;
  export const util: PropDecoratorFunc;
  export const glue: PropDecoratorFunc;
  export const logger: (fileInfo?: string) => PropertyDecorator;
}
