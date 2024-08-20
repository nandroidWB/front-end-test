import { Any, EmptyList, error, Head, Int, None, none, Nothing, Tail } from "../libs/functional-core"

export type List<T> = ReadonlyArray<T>

export const isEmpty = (list: List<unknown>): boolean => list.length === 0

type ListListType<L extends List<unknown>> = L extends EmptyList
  ? EmptyList
  : readonly [ListType<Head<L>>, ...ListListType<Tail<L>>]

export const listOf = <T>(size: Int, init: (i: Int) => T) => {
  let result = new Array<T>(size)
  for (let i=0; i<size; i++) {
    result[i] = init(i)
  }
  return result
}

export const chuncked = <T>(
  list: List<T>,
  chunckSize: number
): List<List<T>> => listOf(
    Math.floor(list.length / chunckSize), 
    i =>
      list.slice(
        i * chunckSize, 
        Math.min(
          (i + 1) * chunckSize, 
          list.length
        )
      )
  )

export const all = <T>(
  list: List<T>,
  predicate: (value: T) => boolean
): boolean => !list.some(value => !predicate(value))

export const flatten = <T>(list: List<List<T>>): List<T> => list.reduce((acc, next) => [...acc, ...next], [])

export const batched = <T>(batchSize: Int, list: List<T>): List<List<T>> =>
  list.length === 0 ? 
    [] :
    [list.slice(0, batchSize), ...batched(batchSize, list.slice(batchSize))]

export const splitRange = (size: Int, [start, end]: [Int, Int]): List<[Int, Int]> => 
  end < start ? 
    [] :
    [[start, Math.min(start + size - 1, end)], ...splitRange(size, [start + size, end])]


export const zip = <I, O>(
  lhs: List<I>, 
  rhs: List<O>
): List<[I, O]> => {
  const resultSize = Math.min(lhs.length, rhs.length)
  const result = new Array(resultSize) as [I, O][]
  for (let i=0; i<resultSize; i++) {
    result[i] = [lhs[i], rhs[i]]
  }
  return result
}

export const filterNotNone = <T>(list: List<T | None>): List<T> =>
  list.filter((it): it is T => it !== none)

export const addAt = <T>(
  list: List<T>,
  element: T,
  index: number
): List<T> => [
    ...list.slice(0, index),
    element,
    ...list.slice(index + 1, list.length),
  ]


export const removeAt = <T>(list: List<T>, index: number): List<T> => 
  [...list.slice(0, index), ...list.slice(index + 1, list.length)]

export type ListType<T> = T extends List<infer R> ? R : never

type InputType<F> = F extends (input: infer I) => Any ? I : Nothing

type ListFunction<A,B> = (input: A) => List<B>
type ListFunctionOutputType<F> = F extends (input: Nothing) => List<infer O> ? O : Nothing

type ListComposition<Lhs, Rhs> =
  ListFunctionOutputType<Lhs> extends InputType<Rhs> 
    ? (input: InputType<Lhs>) => List<ListFunctionOutputType<Rhs>> 
    : Nothing

type ListComposeResult<FunctionList> = 
  FunctionList extends [infer Head, ...infer Tail] ?
  Tail extends [] 
    ? Head 
    : ListComposition<Head, ListComposeResult<Tail>> 
  : Nothing

export const ListFn = {
  noOp: () => {},

  pure: <T>(value: T): List<T> => [value],

  lift:
    <I, O>(f: (input: I) => O) =>
    (value: List<I>): List<O> =>
      value.map(f),

  map: <I, O>(value: List<I>, f: (input: I) => O): List<O> =>
    ListFn.lift(f)(value),

  bind: <I, O>(value: List<I>, f: (input: I) => List<O>): List<O> =>
    flatten(value.map(f)),

  flatten: flatten,

  zipN: <P extends List<List<Any>>>(...params: P): List<ListListType<P>> =>
    params.reduce<List<List<Any>>>(
      (acc, next) =>
        ListFn.bind(acc, (_acc) => ListFn.map(next, (_next) => [..._acc, _next])),
      ListFn.pure<List<unknown>>([])
    ) as never,

  mapN: <P extends List<List<Any>>>(...params: P) =>
    <O>(f: (...values: ListListType<P>) => O): List<O> =>
      ListFn.zipN(...params).map(
        (it) => f(...it)
      ),

  compose: <T1, T2, T3> (
    f1: (input: T1) => List<T2>,
    f2: (input: T2) => List<T3>
  )=> (input: T1): List<T3> => ListFn.bind(f1(input), f2),

  composeN: <FunctionList extends List<ListFunction<Nothing, Any>>>(
      ...functions: FunctionList
    ): ListComposeResult<FunctionList> => (
      functions.length === 0 ? error("cannot compose empty list") :
      functions.length === 1 ? functions[0]:
      ListFn.compose(functions[0], ListFn.composeN(...functions.slice(1)))
    ) as Nothing

}
