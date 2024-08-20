import { match } from "../libs/pattern-matching/src/index"
import { Any, error, Int, List, Nothing, unit, Unit, id, EmptyList, Head, Tail } from "../libs/functional-core"
import { Result, failure, success } from "../libs/result"
import {objectKeys} from "../libs/record-utils"
import {IO} from "./functional-io"


export type Async<T> = () => Promise<T>
export type AsyncType<T> = T extends Async<infer R> ? R : never

type ListAsyncType<L extends List<unknown>> = L extends EmptyList
  ? EmptyList
  : readonly [AsyncType<Head<L>>, ...ListAsyncType<Tail<L>>]

type AsyncRecord<R> = Async<{[K in keyof R]: AsyncType<R[K]>}>

type InputType<F> = F extends (input: infer I) => Any ? I : Nothing

type AsyncFunction<A,B> = (input: A) => Async<B>
type AsyncFunctionOutputType<F> = F extends (input: Nothing) => Async<infer O> ? O : Nothing

type AsyncComposition<Lhs, Rhs> =
  AsyncFunctionOutputType<Lhs> extends InputType<Rhs> 
    ? (input: InputType<Lhs>) => Async<AsyncFunctionOutputType<Rhs>> 
    : Nothing

type AsyncComposeResult<FunctionList> = 
  FunctionList extends [infer Head, ...infer Tail] ?
  Tail extends [] 
    ? Head 
    : AsyncComposition<Head, AsyncComposeResult<Tail>> 
  : Nothing

export const AsyncFn = {

  noOp: async () => {},

  sideEffect: (value: Async<unknown>): Async<Unit> =>
    async () => {
      await value()
    },

  repeat: (n: Int) => (io: Async<Any>): Async<Unit> =>
    async () => {
      for (let i=0; i<n; i++) {
        io()
      }
    },

  /* Same as haskell >>, returns last result */
  sequence: <T>(first: Async<T>, ...list: List<Async<T>>): Async<T> =>
    async () => {
      let result = await first()
      for (let i = 0; i < list.length; i++) {
        result = await list[i]()
      }
      return result
    },

  zipN: <P extends List<Async<Any>>>(...params: P): Async<ListAsyncType<P>> =>
    params.reduce<Async<List<Any>>>(
      (acc, next) => AsyncFn.bind(acc, (_acc) => AsyncFn.map(next, (_next) => [..._acc, _next])),
      AsyncFn.pure<List<unknown>>([])
    ) as never,

  mapN: <P extends List<Async<Any>>>(...params: P) =>
    <O>(f: (...values: ListAsyncType<P>) => O): Async<O> =>
      AsyncFn.map(
        AsyncFn.zipN(...params),
        (it) => f(...it)
      ),

  sequenceRecord: <R extends Record<string, Async<unknown>>>(
    record: R
  ): AsyncRecord<R> =>
    objectKeys(record).reduce<AsyncRecord<R>>(
      (acc, key) =>
        AsyncFn.bind(acc, (accPrime) =>
          AsyncFn.map(record[key], (value) => ({
            ...accPrime,
            [key]: value,
          }))
        ),
      AsyncFn.pure({} as never)
    ),

  sequential: <T>(list: List<Async<T>>): Async<List<T>> =>
    async () => [],

  fromIO: <T>(io: IO<T>): Async<T> => async () => io(),

  also: <T>(value: Async<T>, other: (value: T) => Async<unknown>): Async<T> =>
    async () => {
      const result = await value()
      await other(result)()
      return result
    },

  error: (message: string): Async<Nothing> => async () => error(message),

  pure: <T>(value: T): Async<T> => async () => value,

  lift: <I, O>(
    f: (input: I) => O
  ) => (
    value: Async<I> 
  ): Async<O> => 
    async () => f(await value()),

  map: <I, O>(value: Async<I>, f: (input: I) => O): Async<O> => AsyncFn.lift(f)(value),

  bind: <I, O>(value: Async<I>, f: (input: I) => Async<O>) =>
    async () => await f(await value())(),

  compose: <T1, T2, T3>(
    f1: (input: T1) => Async<T2>,
    f2: (input: T2) => Async<T3>
  ) => (input: T1): Async<T3> => AsyncFn.bind(f1(input), f2),

  flatten: <T>(value: Async<Async<T>>): Async<T> => AsyncFn.bind(value, id),

  composeN: <FunctionList extends List<AsyncFunction<Nothing, Any>>>(
      ...functions: FunctionList
    ): AsyncComposeResult<FunctionList> => (
      functions.length === 0 ? error("cannot compose empty list") :
      functions.length === 1 ? functions[0]:
      AsyncFn.compose(functions[0], AsyncFn.composeN(...functions.slice(1)))
    ) as Nothing,


  do: <T>(
    body: (bind: <T>(value: Async<T>) => Promise<T>) => T
  ): Async<T> =>
    async () => await body(value => value())

}

export const parallelList = <T>(list: List<Async<T>>): Async<List<T>> =>
  () => Promise.all(list.map(it => it()))

export const parallel = <P extends List<Async<Any>>>(
  ...params: P
): Async<{ [K in keyof P]: P[K] extends Async<infer T> ? T : never }> =>
  () => Promise.all(params.map(it => it())) as Nothing

export type Continuation<T> = (value: Result<T>) => IO<Unit>

export const buildAsync = <T>(
  body: (continuation: Continuation<T>) => IO<Unit>
): Async<T> =>
  () => 
    new Promise(
      (resolve, reject) => 
        body(result => 
          match(result)({
            Success: ({ value }) => () => resolve(value),
            Failure: ({ error }) => () => reject(error)
          })
        )()
    )

export const delayCall = (io: IO<unknown>, millis: Int): IO<Unit> =>
      () => {
        setTimeout(io, millis)
      }

export const delay = (millis: Int): Async<Unit> => 
  buildAsync(
    continuation =>
      delayCall(continuation(success(unit)), millis)
  )

export const asyncCatch = <T>(
  value: Async<T>
): Async<Result<T>> => 
  async () => {
    try {
      return success(await value())
    } catch(e) {
      return failure(e)
    }
  }
