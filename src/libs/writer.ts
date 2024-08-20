import { Any, EmptyList, Head, letIn, Tail, unit, Unit } from "../libs/functional-core"
import { List } from "../libs/list-utils"

export type Writer<O, A> = [List<O>, A]

export type WriterType<T> = T extends Writer<any, infer R> ? R : never

export type WriterListType<L extends List<unknown>> = L extends EmptyList
  ? EmptyList
  : readonly [WriterType<Head<L>>, ...WriterListType<Tail<L>>]

const writerPure = <T>(value: T): Writer<never, T> => [[], value]

export const WriterFn = {

  sideEffect: <O>(value: Writer<O, Any>): Writer<O, Unit> => WriterFn.map(value, () => unit),

  output: <O>(...values: List<O>): Writer<O, Unit> => [values, unit],

  pure: writerPure,

  return: writerPure,

  map: <O, A, B>(
    [output, value] : Writer<O, A>, 
    f: (input: A) => B
  ): Writer<O, B> => [output, f(value)],

  mapN: <O, I extends List<Writer<O, Any>>>(
    ...value: I
  ) => <T>(
    f: (...input: WriterListType<I>) => T
  ): Writer<O, T> =>
    writer<O>()(bind => {
      const binded = value.map(it => bind(it))
      return f(...binded as never)
    }),

  lift: <A, B>(
    f: (input: A) => B
  ) => <O>(
    value : Writer<O, A> 
  ): Writer<O, B> => WriterFn.map(value, f),

  bind: <C, A, B>(
    [output1, input] : Writer<C, A>, 
    f: (input: A) => Writer<C, B>
  ): Writer<C, B> => 
    letIn(f(input), ([output2, value]) => [[...output1, ...output2], value]),

  compose: <O, A, B, C>( 
    f: (input: A) => Writer<O, B>,
    g: (input: B) => Writer<O, C>
  ) => (input: A): Writer<O, C> => 
    WriterFn.bind(f(input), g),

  join: <O, T>([output1, [output2, value]]: Writer<O, Writer<O, T>>): Writer<O, T> => 
    [[...output1, ...output2], value],

  do: <O>() => 
    <A>(
      body: (bind: <A>(value: Writer<O, A>) => A) => A
    ): Writer<O, A> => {
      let mutable: List<O> = []
      const result = body(
        value => {
          const [next, result] = value
          mutable = [...mutable, ...next]
          return result
        }
      )
      const final = mutable
      return [final, result]
    }

}

export const writer = WriterFn.do
