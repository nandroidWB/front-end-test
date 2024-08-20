import { id, compose, List, Any, Nothing, error } from "../../functional-core"
import { Endo } from "."

export type Lens<A, B> = {
  read: (value: A) => B
  over: (transform: Endo<B>) => Endo<A>
}

export const lens = <S, P extends keyof S>(
  field: P
): Lens<S, S[P]> => ({
    read: value => value[field],
    over: transform => previous => ({ ...previous, [field]: transform(previous[field]) })
  })

type LensFst<F> = F extends { read: (value: infer I) => Any } ? I : Nothing
type LensSnd<F> = F extends { read: (value: Nothing) => infer O } ? O : Nothing

type LensComposition<Lhs, Rhs> = 
  LensSnd<Lhs> extends LensFst<Rhs>
    ? LensFst<Rhs> extends LensSnd<Lhs>
      ? Lens<LensFst<Lhs>, LensSnd<Rhs>>
      : Nothing
    : Nothing

type LensComposeResult<LensList> = LensList extends [infer Head, ...infer Tail]
  ? Tail extends []
    ? Head
    : LensComposition<Head, LensComposeResult<Tail>>
  : Nothing

export const LensFn = {

  id: <A>(): Lens<A, A> => ({
    read: id,
    over: id
  }),

  compose: <A, B, C>(
    lhs: Lens<A, B>,
    rhs: Lens<B, C>
  ): Lens<A, C> => ({
      read: compose(lhs.read, rhs.read),
      over: compose(rhs.over, lhs.over)
    }),

  compose3: <T1, T2, T3, T4>(
    lens1: Lens<T1, T2>,
    lens2: Lens<T2, T3>,
    lens3: Lens<T3, T4>,
  ): Lens<T1, T4> => LensFn.compose(LensFn.compose(lens1, lens2), lens3),
  
  compose4: <T1, T2, T3, T4, T5>(
    lens1: Lens<T1, T2>,
    lens2: Lens<T2, T3>,
    lens3: Lens<T3, T4>,
    lens4: Lens<T4, T5>,
  ): Lens<T1, T5> => LensFn.compose(LensFn.compose3(lens1, lens2, lens3), lens4),
  
  compose5: <T1, T2, T3, T4, T5, T6>(
    lens1: Lens<T1, T2>,
    lens2: Lens<T2, T3>,
    lens3: Lens<T3, T4>,
    lens4: Lens<T4, T5>,
    lens5: Lens<T5, T6>,
  ): Lens<T1, T6> => LensFn.compose(LensFn.compose4(lens1, lens2, lens3, lens4), lens5),

  composeN: <LensList extends List<{
    read: (value: Nothing) => Any, 
    over: (transform: (input: Any) => Nothing) => ((input: Nothing) => Any)
  }>>(
    ...lenses: LensList
  ): LensComposeResult<LensList> =>
    (lenses.length === 0
      ? error("cannot compose empty list") 
      : lenses.length === 1 ? lenses[0]
      : LensFn.compose(lenses[0] as Nothing, LensFn.composeN(...lenses.slice(1)))
    ) as Nothing

}
