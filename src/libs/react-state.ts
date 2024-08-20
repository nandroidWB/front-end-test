import { Dispatch, SetStateAction, useMemo, useState } from "react"
import { IO, IOFn } from "../libs/functional-io"
import { compose } from "../libs/functional-core"
import { buildObject, objectKeys } from "../libs/record-utils"
import { none, Unit } from "../libs/functional-core"
import { Affine, Endo, Lens, lens, prism } from "../libs/optics/src/index"
import { Optional } from "../libs/optional"

export type State<S> = {
  value: S
  apply: (transform: Endo<S>) => IO<Unit>
}

export type ReactState<S> = [S, Dispatch<SetStateAction<S>>]
export type StateType<S> = S extends State<infer T> ? T : never


export const useStatefull = <S>(
  initializer: () => S
): State<S> => {
    
  const [value, setValue] = useState(initializer)

  // Performance memoization
  return useMemo( () => ({ 
    value: value, 
    apply:  (transform: Endo<S>): IO<Unit> => () => setValue(transform)
  }), [value, setValue])
}


export const setTo = <S>(
  state: State<S>, 
  value: S
): IO<Unit> => state.apply(() => value)

export const setter = <S>(
  state: State<S>
) => (value: S) => state.apply(() => value)

export const modify = <S>(
  state: State<S>, 
  modifications: Partial<S>
): IO<Unit> => state.apply(previous => ({ ...previous, ...modifications }))

export const fallback = <S,>(
  state: State<Optional<S>>, 
  fallback: S
): State<S> => ({
    value: state.value ?? fallback,
    apply: transition => 
      state.apply(previous => 
        transition(previous ?? fallback)
      )
  })

export const ignoreNoneState = <T,>(
  state: State<T>
): State<Optional<T>> => ({
    value: state.value,
    apply: transition => 
      state.apply(previous => 
        transition(previous) ?? previous
      )
  })

export const definedState = <S>(state: State<Optional<S>>): Optional<State<S>> => 
  state.value === none ? none : {
    value: state.value,
    apply: transition => 
      state.apply(previous => 
        previous !== none ?  transition(previous) : previous
      )
  }


export const stateProduct = <T extends Record<string, State<any>>>(
  state: T
): State<{[K in keyof T]: StateType<T> }> => {

  const keys = objectKeys(state)

  const objects: {
    [K in keyof T]: StateType<T>
  } = buildObject(keys, (key) => state[key].value)

  return {
    value: objects,
    apply: transition => {
      const newState = transition(objects)
      
      return IOFn.sequential(keys.map(key => setTo(state[key], newState[key])))
    }
  }
}

export const applyLens = <S, P>(
  state: State<S>,
  lens: Lens<S, P>
): State<P> => ({
    value: lens.read(state.value),
    apply: compose(lens.over, state.apply)
})

export const applyAffine = <S, P>(
  state: State<S>,
  affine: Affine<S, P>
): State<Optional<P>> => ({
    value: affine.read(state.value),
    apply: transition => state.apply(
        affine.over(it => transition(it) ?? it)
      )
  })

export const stateCase = <S, P extends S>(
  state: State<S>, 
  check: (value: S) => value is P
): Optional<State<P>> =>
    definedState(applyAffine(state, prism(check)))


export const projections = <A>(
  state: State<A>
) => <K extends keyof A>(key: K): State<A[K]> => applyLens(state, lens(key))


export const destructure = <S extends Record<never, unknown>>(
  state: State<S>
): { [K in keyof S]: State<S[K]> } => 
    buildObject(
      objectKeys(state.value),
      key => applyLens(state, lens(key))
    )

export const lazyDestructure = <S>(
  state: State<S>
): <K extends keyof S>(key: K) => State<S[K]> => 
    key => applyLens(state, lens(key))

