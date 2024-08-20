import { Any, callCC, EmptyList, Head, List, Tail } from "../libs/functional-core"


export type Right<R> = {
  type: "Right",
  data: R
}

export type Left<L> = {
  type: "Left",
  data: L
}

export type Either<L, R> = Left<L> | Right<R>

export const RightFn = <R>(value: R) => ({
  type: "Right",
  data: value
}) as Either<never, R>

export const LeftFn = <L>(value: L) => ({
  type: "Left",
  data: value
}) as Either<L, never>


export type EitherType<T> = T extends Either<any, infer R> ? R : never

export type EitherListType<L extends List<unknown>> = L extends EmptyList
  ? EmptyList
  : readonly [EitherType<Head<L>>, ...EitherListType<Tail<L>>]

export const EitherFn = {

  pure: RightFn,

  return: RightFn,

  match: <L, R>(value: Either<L, R>) => 
    <O>(cases: {
      left: (value: L) => O,
      right: (value: R) => O
    }): O =>
      value.type === "Left" ? cases.left(value.data) : cases.right(value.data),

  map: <C, A, B>(
    value : Either<C, A>, 
    f: (input: A) => B
  ): Either<C, B> => 
    value.type === "Right" ? RightFn(f(value.data)) : value,

  mapN: <L, I extends List<Either<L, Any>>>(
    ...value: I
  ) => <O>(
    f: (...input: EitherListType<I>) => O
  ): Either<L, O> => 
    either<L>()(bind => f(...value.map(bind) as never)),

  lift: <A, B>(
    f: (input: A) => B
  ) => <C>(
    value : Either<C, A> 
  ): Either<C, B> => EitherFn.map(value, f),

  bind: <C, A, B>(
    value : Either<C, A>, 
    f: (input: A) => Either<C, B>
  ): Either<C, B> => value.type === "Right" ? f(value.data) : value,

  compose: <T, A, B, C>( 
    f: (input: A) => Either<T, B>,
    g: (input: B) => Either<T, C>
  ) => (input: A): Either<T, C> => 
    EitherFn.bind(f(input), g),

  join: <C, T>(value: Either<C, Either<C, T>>): Either<C, T> => 
    value.type === "Right" ? value.data : value,

  do: <L>() => <R>(
    body: (bind: <T>(value: Either<L, T>) => T) => R
  ): Either<L, R> => 
    callCC(exit => 
      RightFn(
        body(value => value.type === "Right" ? value.data : exit(value))
      )  
    )

}

export const either = EitherFn.do
