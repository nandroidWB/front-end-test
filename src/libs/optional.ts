import { Any, callCC, EmptyList, error, Head, List, none, None, Nothing, Tail } from "../libs/functional-core";

export type Optional<T> = T | None

export type OptionalType<T> = T extends None ? never : T

export type OptionalListType<L extends List<unknown>> = L extends EmptyList
  ? EmptyList
  : readonly [OptionalType<Head<L>>, ...OptionalListType<Tail<L>>]

type InputType<F> = F extends (input: infer I) => Any ? I : Nothing

type OptionalFunction<A,B> = (input: A) => Optional<B>
type OptionalFunctionOutputType<F> = F extends (input: Nothing) => Optional<infer O> ? O : Nothing

type OptionalComposition<Lhs, Rhs> =
  OptionalFunctionOutputType<Lhs> extends InputType<Rhs> 
    ? (input: InputType<Lhs>) => Optional<OptionalFunctionOutputType<Rhs>> 
    : Nothing

type OptionalComposeResult<FunctionList> = 
  FunctionList extends [infer Head, ...infer Tail] ?
  Tail extends [] 
    ? Head 
    : OptionalComposition<Head, OptionalComposeResult<Tail>> 
  : Nothing

const optionalPure = <T>(value: T): Optional<T> => value

export const OptionalFn = {
  
  match: <E>(
    value: E | None
  ) => <R>(
    options: {
      some: (value: E) => R,
      none: () => R
    }
  ): R =>
    value === none ? options.none() : options.some(value),
  
  return: optionalPure,

  pure: optionalPure,

  lift: <I, O>(
    f: (input: I) => O
  ) => (
    value: Optional<I> 
  ): Optional<O> => 
    value === none ? none : f(value),

  map: <I, O>(value: Optional<I>, f: (input: I) => O): Optional<O> => 
    value === none ? none : f(value),

  mapN: <I extends List<Optional<Any>>>(
    ...value: I
  ) => <O>(
    f: (...input: OptionalListType<I>) => O
  ): Optional<O> => 
    value.some(it => it === none) ? none : f(...value as never),
  
  bind: <I, O>(value: Optional<I>, f: (input: I) => Optional<O>): Optional<O> => 
    value === none ? none : f(value),
  
  compose: <T1, T2, T3>(
    f1: (input: T1) => Optional<T2>,
    f2: (input: T2) => Optional<T3>
  ) => (input: T1): Optional<T3> => OptionalFn.bind(f1(input), f2),

  join: <T>(value: Optional<Optional<T>>): Optional<T> => value,

  composeN: <FunctionList extends List<OptionalFunction<Nothing, Any>>>(
      ...functions: FunctionList
    ): OptionalComposeResult<FunctionList> => (
      functions.length === 0 ? error("cannot compose empty list") :
      functions.length === 1 ? functions[0]:
      OptionalFn.compose(functions[0], OptionalFn.composeN(...functions.slice(1)))
    ) as Nothing,
  
  do: <T>(
    body: (bind: <T>(value: T) => Exclude<T, None>) => T
  ): T | undefined => 
    callCC(exit => 
      body(value => value === none ? exit(none) : value as never)
    )
  
}

// Do notation
export const optional = <T>(
  body: (bind: <T>(value: T) => Exclude<T, None>) => T
): T | undefined => 
  callCC(exit => 
    body(value => value === none ? exit(none) : value as never)
  )
