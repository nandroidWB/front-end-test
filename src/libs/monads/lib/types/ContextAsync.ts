import { Async, AsyncFn } from "../../../functional-async"
import { Any, List, Unit, id, none } from "../../../functional-core"
import {IO} from "../../../functional-io"
import { Optional } from "../../../optional"


export type ContextAsync<C, T> = (ctx: C) => Async<T> 

export const ContextAsyncFn = <C>() => ({

  run: (context: C) => <T>(value: ContextAsync<C, T>): Async<T> =>
    value(context),

  pure: <T>(value: T): ContextAsync<C, T> =>
    () => AsyncFn.pure(value),
  
  map: <I, O>(value: ContextAsync<C, I>, transform: (input: I) => O): ContextAsync<C, O> =>
    (ctx) => AsyncFn.map(value(ctx), transform),

  lift: <I, O>(transform: (input: I) => O) => (value: ContextAsync<C, I>): ContextAsync<C, O> =>
  ContextAsyncFn<C>().map(value, transform),

  bind: <I, O>(value: ContextAsync<C, I>, transform: (input: I) => ContextAsync<C, O>): ContextAsync<C, O> =>
    (ctx) => AsyncFn.bind(value(ctx), (input) => transform(input)(ctx)),

  flatten: <T>(value: ContextAsync<C, ContextAsync<C, T>>): ContextAsync<C, T> =>
    ContextAsyncFn<C>().bind(value, id),

  do: <T>(
    body: (__: <R>(value: ContextAsync<C, R>) => Promise<R>) => Promise<T>
  ): ContextAsync<C, T> =>
    (ctx) =>
      () => body(value => value(ctx)()),

  compose: <T1, T2, T3>(
    lhs: (a: T1) => ContextAsync<C, T2>, 
    rhs: (b: T2) => ContextAsync<C, T3>
  ) =>
    (a: T1): ContextAsync<C, T3> => ContextAsyncFn<C>().bind(lhs(a), rhs), 

  noOp: id<ContextAsync<C, Unit>>(() => AsyncFn.noOp),

  when: (condition: boolean) => <T>(value: ContextAsync<C, T>): ContextAsync<C, Optional<T>> =>
    (ctx) => condition ? value(ctx) : AsyncFn.pure(none),

  unless: (condition: boolean) => <T>(value: ContextAsync<C, T>): ContextAsync<C, Optional<T>> =>
    ContextAsyncFn<C>().when(!condition)(value),

  forEach: <I>(value: List<I>) => <O>(action: (value: I) => ContextAsync<C, O>): ContextAsync<C, List<O>> =>
    (ctx) => AsyncFn.sequential(value.map(it => action(it)(ctx))),

  sequence: <T>(value: List<ContextAsync<C, T>>): ContextAsync<C, List<T>> =>
    ContextAsyncFn<C>().forEach(value)(id),

  fromAsync: <T>(value: Async<T>): ContextAsync<C, T> =>
    (ctx) => value,

  fromIO: <T>(value: IO<T>): ContextAsync<C, T> =>
    (ctx) => AsyncFn.fromIO(value),

  catching:
    <T>(value: ContextAsync<C, T>) =>
    (handler: (error: Any) => ContextAsync<C, T>, final?: ContextAsync<C, Unit>): ContextAsync<C, T> =>
      ctx =>
        async () => {
          try {
            return await value(ctx)()
          } catch (error) {
            return await handler(error)(ctx)()
          } finally {
            if (final !== none) {
              await final(ctx)()
            }
          }
        }
})


