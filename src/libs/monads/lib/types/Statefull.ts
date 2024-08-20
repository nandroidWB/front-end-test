import { Int, List, id } from "../../../functional-core"


export type Statefull<S, T> = (state: S) => [S, T]

export const StatefullFn = <S>() => ({

  run: (state: S) => <T>(value: Statefull<S, T>): [S, T] =>
    value(state),

  pure: <T>(value: T): Statefull<S, T> =>
    state => [state, value],

  map: <I, O>(value: Statefull<S, I>, transform: (input: I) => O): Statefull<S, O> =>
    state => {
      const [newState, newValue] = value(state)
      return [newState, transform(newValue)]
    },

  lift: <I, O>(transform: (input: I) => O) => (value: Statefull<S, I>): Statefull<S, O> =>
    StatefullFn<S>().map(value, transform),

  bind: <I, O>(value: Statefull<S, I>, transform: (input: I) => Statefull<S, O>): Statefull<S, O> =>
    state => {
      const [newState, newValue] = value(state)
      return transform(newValue)(newState)
    },

  flatten: <T>(value: Statefull<S, Statefull<S, T>>): Statefull<S, T> =>
    StatefullFn<S>().bind(value, id),

  compose: <A, B, C>(lhs: (a: A) => Statefull<S, B>, rhs: (b: B) => Statefull<S, C>) =>
    (a: A): Statefull<S, C> => StatefullFn<S>().bind(lhs(a), rhs),
  
  do: <T>(
    body: (__: <R>(value: Statefull<S, R>) => R) => T
  ): Statefull<S, T> => 
    state => {
      let current = state
      const result = body(value => {
        const [newState, newValue] = value(current)
        current = newState
        return newValue
      })
      return [current, result]
    },

  forEach: <I>(value: List<I>) => <O>(action: (value: I) => Statefull<S, O>): Statefull<S, List<O>> =>
    state => {
      let current = state
      const result = value.map(value => {
        const [newState, newValue] = action(value)(current)
        current = newState
        return newValue
      })
      return [current, result]
    },

  sequence: <T>(value: List<Statefull<S, T>>): Statefull<S, List<T>> =>
    StatefullFn<S>().forEach(value)(id),

  repeat: (times: Int) => <T>(value: Statefull<S, T>): Statefull<S, List<T>> =>
    state => {
      let current = state
      const result = new Array<T>(times)
      for (let i = 0; i < times; i++) {
        const [newState, newValue] = value(current)
        current = newState
        result[i] = newValue
      }
      return [current, result]
    },

  get: (): Statefull<S, S> =>
    state => [state, state],

  put: (state: S): Statefull<S, void> =>
    () => [state, undefined],

  modify: (transform: (state: S) => S): Statefull<S, S> => 
    state => {
      const newState = transform(state)
      return [newState, newState]
    },

})

