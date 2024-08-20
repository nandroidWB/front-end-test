export type Int = number
export type Float = number
export type Bool = boolean

export type Nothing = never
export type Unit = void
export type None = undefined
export type Null = null


export type Any = unknown

export type List<T> = ReadonlyArray<T>

export type EmptyList = readonly []
export type Head<L> = L extends readonly [infer H, ...infer _T] ? H : never
export type Tail<L> = L extends readonly [infer _H, ...infer T] ? T : never

export type FunctionInputType<F> = F extends (input: infer I) => Any ? I : Nothing
export type FunctionOutputType<F> = F extends (input: Nothing) => infer O ? O : Nothing

export const unit: Unit = undefined
export const none: None = undefined

export const TODO = (message: string): Nothing => { throw `TODO: ${message}` }

export const id = <T>(x: T): T => x

export const constant = <T>(x: T) => (_: Any) => x

export const error = (message: string): Nothing => { throw new Error(message) }

export const letIn = <I, O>(value: I, body: (value: I) => O): O => body(value)

export const curry = <A, B, C>(
  f: (i0: A, i1: B) => C
) => 
  (i0: A) => (i1: B): C => f(i0, i1)

export const uncurry = <A, B, C>(
  f: (i0: A) => (i1: B) => C
) => 
  (i0: A, i1: B): C => f(i0)(i1)

export const flip = <A, B, C>(f: (a: A) => (b: B) => C) =>
  (b: B) => (a: A) => f(a)(b)

type Function<A,B> = (input: A) => B

type FunctionComposition<Lhs, Rhs> =
  FunctionOutputType<Lhs> extends FunctionInputType<Rhs> 
    ? (input: FunctionInputType<Lhs>) => FunctionOutputType<Rhs>
    : Nothing

type FunctionComposeResult<FunctionList> = 
  FunctionList extends [infer Head, ...infer Tail] ?
  Tail extends [] 
    ? Head 
    : FunctionComposition<Head, FunctionComposeResult<Tail>> 
  : Nothing

export const composeN = <FunctionList extends List<Function<Nothing, Any>>>(
      ...functions: FunctionList
    ): FunctionComposeResult<FunctionList> => (
      functions.length === 0 ? error("cannot compose empty list") :
      functions.length === 1 ? functions[0]:
      compose(functions[0], composeN(...functions.slice(1)))
    ) as Nothing

export const compose = <T1, T2, T3>(
  lhs: (input: T1) => T2,
  rhs: (input: T2) => T3
) =>
  (input: T1): T3 => rhs(lhs(input))

export type On<T> = {
  done: T,
  then: <O>(_: (it: T) => O) => On<O>
}

export const on =  <T>(value: T): On<T> => ({
  done: value,
  then: <O>(body: (it: T) => O): On<O> => on(body(value))
})

export type Pipe<I, O> = {
  done: (input: I) => O,
  then: <T>(_: (it: O) => T) => Pipe<I, T>
}

export const pipe =  <I, O>(value: (input: I) => O): Pipe<I, O> => ({
  done: value,
  then: <T>(body: (it: O) => T): Pipe<I, T> => pipe(compose(value, body))
})

export const callCC = <R>(
  body: (exit: (value: R) => never) => R
): R => {
  const exitSymbol = Symbol("exit")
  try {
    return body(
      value => {
        throw {
          symbol: exitSymbol,
          value: value
        }
      }
    )
  } catch(e: any) {
    if (e.symbol === exitSymbol) {
      return e.value
    } else {
      throw e
    }
  }
}


