import { match } from "../libs/pattern-matching/src/index"
import { id, callCC } from "../libs/functional-core"


export type Result<T> = Success<T> | Failure

export type Failure = {
  type: "Failure",
  error: unknown
}

export const failure = (error: unknown): Failure => ({
  type: "Failure",
  error: error
})

export type Success<T> = {
  type: "Success",
  value: T
}

export const success = <T>(value: T): Success<T> => ({
  type: "Success",
  value: value
})

export const recover = <T>(
  result: Result<T>, 
  onError: (e: unknown) => T
): T => match(result)({
  Success: ({ value }) => value,
  Failure: onError
})

const successLift = <I, O>(
  f: (_: I) => O
) => (
  value: Success<I>
) => success(f(value.value))


export const SuccessFn = {

  pure: success,
  
  map: <I, O>(value: Success<I>, f: (_: I) => O): Success<O> => successLift(f)(value),

  lift: successLift,

  bind: <I, O>(value: Success<I>, f: (_: I) => Success<O>): Success<O> => f(value.value)

}

export const ResultFn = {
  
  pure: success,

  lift: <I, O>(
    f: (_: I) => O
  ) => (
    value: Result<I>
  ): Result<O> => 
    match(value)<Result<O>>({
      Success: SuccessFn.lift(f),
      Failure: id
    }),

  map: <I, O>(value: Result<I>, f: (_: I) => O): Result<O> => ResultFn.lift(f)(value),

  bind: <I, O>(value: Result<I>, f: (_: I) => Result<O>): Result<O> =>
    match(value)({
      Success: s => f(s.value),
      Failure: id
    }),

  compose: <T1, T2, T3>(
    f1: (input: T1) => Result<T2>,
    f2: (input: T2) => Result<T3>
  ) => (input: T1): Result<T3> => ResultFn.bind(f1(input), f2),

  flatten: <T>(value: Result<Result<T>>): Result<T> => ResultFn.bind(value, id),

  do: <R>(
    body: (bind: <T>(value: Result<T>) => T) => R
  ): Result<R> => 
    callCC(exit => 
      success(
        body(value => value.type === "Success" ? value.value : exit(value))
      )  
    )

}
