import { Any, compose, error, id, List, Nothing } from "../../functional-core"
import { Optional, OptionalFn } from "../../optional"
import { Endo } from "."

export type Affine<A, B> = {
  read: (value: A) => Optional<B>
  over: (transform: Endo<B>) => Endo<A>
}

type AffineFst<F> = F extends { read: (value: infer I) => Any} ? I : Nothing
type AffineSnd<F> = F extends { read: (value: Nothing) => Optional<infer O> } ? O : Nothing

type AffineComposition<Lhs, Rhs> = 
  AffineSnd<Lhs> extends AffineFst<Rhs>
    ? AffineFst<Rhs> extends AffineSnd<Lhs>
      ? Affine<AffineFst<Lhs>, AffineSnd<Rhs>>
      : Nothing
    : Nothing

type AffineComposeResult<LensList> = LensList extends [infer Head, ...infer Tail]
  ? Tail extends []
    ? Head
    : AffineComposition<Head, AffineComposeResult<Tail>>
  : Nothing

export const AffineFn = {

  id: <A>(): Affine<A, A> => ({
    read: id,
    over: id,
  }),

  compose: <A, B, C>(
    lhs: Affine<A, B>,
    rhs: Affine<B, C>
  ): Affine<A, C> => ({
      read: OptionalFn.compose(lhs.read, rhs.read),
      over: compose(rhs.over, lhs.over)
    }),

  compose3: <T1, T2, T3, T4>(
    affine1: Affine<T1, T2>,
    affine2: Affine<T2, T3>,
    affine3: Affine<T3, T4>,
  ): Affine<T1, T4> => AffineFn.compose(AffineFn.compose(affine1, affine2), affine3),
  
  compose4: <T1, T2, T3, T4, T5>(
    affine1: Affine<T1, T2>,
    affine2: Affine<T2, T3>,
    affine3: Affine<T3, T4>,
    affine4: Affine<T4, T5>,
  ): Affine<T1, T5> => AffineFn.compose(AffineFn.compose3(affine1, affine2, affine3), affine4),
  
  compose5: <T1, T2, T3, T4, T5, T6>(
    affine1: Affine<T1, T2>,
    affine2: Affine<T2, T3>,
    affine3: Affine<T3, T4>,
    affine4: Affine<T4, T5>,
    affine5: Affine<T5, T6>,
  ): Affine<T1, T6> => AffineFn.compose(AffineFn.compose4(affine1, affine2, affine3, affine4), affine5),

  composeN: <AffineList extends List<{
    from: (a: Nothing) => Any
    to: (b: Nothing) => Any
  }>>(...affines: AffineList): AffineComposeResult<AffineList> =>
    (affines.length === 0
      ? error("cannot compose empty list") 
      : affines.length === 1 ? affines[0]
      : AffineFn.compose(affines[0] as Nothing, AffineFn.composeN(...affines.slice(1)))
    ) as Nothing

}
