import { Any, List, Unit, id, none } from "../../../functional-core"
import { IO, IOFn } from "../../../functional-io"
import { Optional } from "../../../optional"


export type ContextIO<C, T> = (ctx: C) => IO<T> 


export const ContextIOFn = <C>() => ({

  run: (context: C) => <T>(value: ContextIO<C, T>): IO<T> =>
    value(context),

  pure: <T>(value: T): ContextIO<C, T> =>
    () => IOFn.pure(value),
  
  map: <I, O>(value: ContextIO<C, I>, transform: (input: I) => O): ContextIO<C, O> =>
    (ctx) => IOFn.map(value(ctx), transform),

  lift: <I, O>(transform: (input: I) => O) => (value: ContextIO<C, I>): ContextIO<C, O> =>
  ContextIOFn<C>().map(value, transform),

  bind: <I, O>(value: ContextIO<C, I>, transform: (input: I) => ContextIO<C, O>): ContextIO<C, O> =>
    (ctx) => IOFn.bind(value(ctx), (input) => transform(input)(ctx)),

  flatten: <T>(value: ContextIO<C, ContextIO<C, T>>): ContextIO<C, T> =>
    ContextIOFn<C>().bind(value, id),

  do: <T>(
    body: (__: <R>(value: ContextIO<C, R>) => R) => T
  ): ContextIO<C, T> =>
    (ctx) =>
      () => body(value => value(ctx)()),

  compose: <T1, T2, T3>(
    lhs: (a: T1) => ContextIO<C, T2>, 
    rhs: (b: T2) => ContextIO<C, T3>
  ) =>
    (a: T1): ContextIO<C, T3> => ContextIOFn<C>().bind(lhs(a), rhs), 

  noOp: id<ContextIO<C, Unit>>(() => IOFn.noOp),

  when: (condition: boolean) => <T>(value: ContextIO<C, T>): ContextIO<C, Optional<T>> =>
    (ctx) => condition ? value(ctx) : IOFn.pure(none),

  unless: (condition: boolean) => <T>(value: ContextIO<C, T>): ContextIO<C, Optional<T>> =>
    ContextIOFn<C>().when(!condition)(value),

  forEach: <I>(value: List<I>) => <O>(action: (value: I) => ContextIO<C, O>): ContextIO<C, List<O>> =>
    (ctx) => IOFn.sequential(value.map(it => action(it)(ctx))),

  sequence: <T>(value: List<ContextIO<C, T>>): ContextIO<C, List<T>> =>
    ContextIOFn<C>().forEach(value)(id),

  fromIO: <T>(value: IO<T>): ContextIO<C, T> =>
    (ctx) => value,

  catching:
    <T>(value: ContextIO<C, T>) =>
    (handler: (error: Any) => ContextIO<C, T>, final?: ContextIO<C, Unit>): ContextIO<C, T> =>
      ctx =>
        () => {
          try {
            return value(ctx)()
          } catch (error) {
            return handler(error)(ctx)()
          } finally {
            if (final !== none) {
              final(ctx)()
            }
          }
        }
})


