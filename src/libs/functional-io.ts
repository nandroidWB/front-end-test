import { Any, EmptyList, error, Head, Int, List, Nothing, Tail, Unit } from "../libs/functional-core"
import {objectKeys} from "../libs/record-utils"


export type IO<T> = () => T
export type IOType<T> = T extends IO<infer R> ? R : never

type IORecord<R> = IO<{ [K in keyof R]: IOType<R[K]> }> 

type ListIOType<L extends List<unknown>> = L extends EmptyList
  ? EmptyList
  : readonly [IOType<Head<L>>, ...ListIOType<Tail<L>>]

type InputType<F> = F extends (input: infer I) => Any ? I : Nothing

type IOFunction<A,B> = (input: A) => IO<B>
type IOFunctionOutputType<F> = F extends (input: Nothing) => IO<infer O> ? O : Nothing

type IOComposition<Lhs, Rhs> =
  IOFunctionOutputType<Lhs> extends InputType<Rhs> 
    ? (input: InputType<Lhs>) => IO<IOFunctionOutputType<Rhs>> 
    : Nothing

type IOComposeResult<FunctionList> = 
  FunctionList extends [infer Head, ...infer Tail] ?
  Tail extends [] 
    ? Head 
    : IOComposition<Head, IOComposeResult<Tail>> 
  : Nothing

export const IOFn = {

  sideEffect: (value: IO<Any>): IO<Unit> => () => { value() },

  noOp: () => {},

  /* Same as haskell >>, returns last result */
  sequence: <T>(first: IO<T>, ...list: List<IO<T>>): IO<T> =>
    () => {
      let result = first()
      list.forEach((it) => {
        result = it()
      })
      return result
    },

  sequential: <T>(list: List<IO<T>>): IO<List<T>> =>
    () =>
      list.map((it) => it()),

  repeat: (n: Int) =>
    (io: IO<Any>): IO<Unit> =>
    () => {
      for (let i = 0; i < n; i++) {
        io()
      }
    },

  also: <T>(value: IO<T>, other: (value: T) => IO<Any>): IO<T> =>
    () => {
      const result = value()
      other(result)()
      return result
    },

  error: (message: string): IO<Nothing> =>
    () =>
      error(message),

  pure: <T>(value: T): IO<T> =>
    () =>
      value,

  lift: <I, O>(f: (input: I) => O) =>
    (value: IO<I>): IO<O> =>
    () =>
      f(value()),

  map: <I, O>(value: IO<I>, f: (input: I) => O): IO<O> => IOFn.lift(f)(value),

  zipN: <P extends List<IO<Any>>>(...params: P): IO<ListIOType<P>> =>
    params.reduce<IO<List<Any>>>(
      (acc, next) => IOFn.bind(acc, (_acc) => IOFn.map(next, (_next) => [..._acc, _next])),
      IOFn.pure<List<unknown>>([])
    ) as never,

  mapN: <P extends List<IO<Any>>>(...params: P) =>
    <O>(f: (...values: ListIOType<P>) => O): IO<O> =>
      IOFn.map(
        IOFn.zipN(...params),
        (it) => f(...it)
      ),

  bind: <I, O>(value: IO<I>, f: (input: I) => IO<O>): IO<O> =>
    () =>
      f(value())(),

  sequenceRecord: <R extends Record<string, IO<Any>>>(
    record: R
  ): IORecord<R> =>
    objectKeys(record).reduce<IORecord<R>>(
      (acc, key) =>
        IOFn.bind(acc, (accPrime) =>
          IOFn.map(record[key], (value) => ({
            ...accPrime,
            [key]: value,
          }))
        ),
      IOFn.pure({} as never)
    ),

  compose: <T1, T2, T3>(f1: (input: T1) => IO<T2>, f2: (input: T2) => IO<T3>) =>
    (input: T1): IO<T3> =>
      IOFn.bind(f1(input), f2),

  flatten: <T>(value: IO<IO<T>>): IO<T> =>
    () =>
  value()(),

  composeN: <FunctionList extends List<IOFunction<Nothing, Any>>>(
      ...functions: FunctionList
    ): IOComposeResult<FunctionList> => (
      functions.length === 0 ? error("cannot compose empty list") :
      functions.length === 1 ? functions[0]:
      IOFn.compose(functions[0], IOFn.composeN(...functions.slice(1)))
    ) as Nothing,

  do: <T>(
    body: (bind: <T>(value: IO<T>) => T) => T
  ): IO<T> =>
    () => body(value => value())

}

export const println = (value: Any): IO<Unit> => () => console.log(value)

export const runCatching = <T>(io: IO<T>, errorValue: T): IO<T> =>
  () => {
    try {
      return io()
    } catch(e) {
      console.log(e)
      return errorValue
    }
  }

