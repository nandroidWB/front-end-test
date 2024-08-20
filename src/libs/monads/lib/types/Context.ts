import {List, Unit, id, none, unit} from "../../../functional-core"
import { Optional } from "../../../optional"


export type Context<C, T> = (ctx: C) => T

export const ContextFn = <C>() => ({

  pure: <T>(value: T): Context<C, T> =>
    () => value,
  
  map: <I, O>(value: Context<C, I>, transform: (input: I) => O): Context<C, O> =>
    (ctx) => transform(value(ctx)),

  lift: <I, O>(transform: (input: I) => O) => (value: Context<C, I>): Context<C, O> =>
  ContextFn<C>().map(value, transform),

  bind: <I, O>(value: Context<C, I>, transform: (input: I) => Context<C, O>): Context<C, O> =>
    (ctx) => transform(value(ctx))(ctx),

  flatten: <T>(value: Context<C, Context<C, T>>): Context<C, T> =>
    ContextFn<C>().bind(value, id),

  do: <T>(
    body: (__: <R>(value: Context<C, R>) => R) => T
  ): Context<C, T> =>
    (ctx) =>
      body(value => value(ctx)),

  compose: <T1, T2, T3>(
    lhs: (a: T1) => Context<C, T2>, 
    rhs: (b: T2) => Context<C, T3>
  ) =>
    (a: T1): Context<C, T3> => ContextFn<C>().bind(lhs(a), rhs),

  noOp: id<Context<C, Unit>>(() => unit),

  when: (condition: boolean) => <T>(value: Context<C, T>): Context<C, Optional<T>> =>
    (ctx) => condition ? value(ctx) : none,

  unless: (condition: boolean) => <T>(value: Context<C, T>): Context<C, Optional<T>> =>
    ContextFn<C>().when(!condition)(value),

  forEach: <I>(value: List<I>) => <O>(action: (value: I) => Context<C, O>): Context<C, List<O>> =>
    (ctx) => value.map(item => action(item)(ctx)),

  sequence: <T>(value: List<Context<C, T>>): Context<C, List<T>> =>
    ContextFn<C>().forEach(value)(id),

})



