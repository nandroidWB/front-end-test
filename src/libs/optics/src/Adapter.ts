import { id, compose, Any, Nothing, List, error } from "../../functional-core"

export type Adapter<A, B> = {
  from: (a: A) => B
  to: (b: B) => A
}

type AdapterFst<F> = 
  F extends { from: (a: infer A) => Any } ? A : Nothing

type AdapterSnd<F> = 
  F extends { to: (b: infer B) => Any } ? B : Nothing

type AdapterComposition<Lhs, Rhs> = 
  AdapterSnd<Lhs> extends AdapterFst<Rhs>
    ? AdapterFst<Rhs> extends AdapterSnd<Lhs>
      ? Adapter<AdapterFst<Lhs>, AdapterSnd<Rhs>>
      : Nothing
    : Nothing

type AdapterComposeResult<LensList> = LensList extends [infer Head, ...infer Tail]
  ? Tail extends []
    ? Head
    : AdapterComposition<Head, AdapterComposeResult<Tail>>
  : Nothing

export const AdapterFn = {

  id: <A>(): Adapter<A, A> => ({
    from: id,
    to: id
  }),

  compose: <A, B, C>(
    lhs: Adapter<A, B>,
    rhs: Adapter<B, C>
  ): Adapter<A, C> => ({
    from: compose(lhs.from, rhs.from),
    to: compose(rhs.to, lhs.to)
  }),

  compose3: <T1, T2, T3, T4>(
    adapter1: Adapter<T1, T2>,
    adapter2: Adapter<T2, T3>,
    adapter3: Adapter<T3, T4>,
  ): Adapter<T1, T4> => AdapterFn.compose(AdapterFn.compose(adapter1, adapter2), adapter3),
  
  compose4: <T1, T2, T3, T4, T5>(
    adapter1: Adapter<T1, T2>,
    adapter2: Adapter<T2, T3>,
    adapter3: Adapter<T3, T4>,
    adapter4: Adapter<T4, T5>,
  ): Adapter<T1, T5> => AdapterFn.compose(AdapterFn.compose3(adapter1, adapter2, adapter3), adapter4),
  
  compose5: <T1, T2, T3, T4, T5, T6>(
    adapter1: Adapter<T1, T2>,
    adapter2: Adapter<T2, T3>,
    adapter3: Adapter<T3, T4>,
    adapter4: Adapter<T4, T5>,
    adapter5: Adapter<T5, T6>,
  ): Adapter<T1, T6> => AdapterFn.compose(AdapterFn.compose4(adapter1, adapter2, adapter3, adapter4), adapter5),

  composeN: <AdapterList extends List<{
    from: (a: Nothing) => Any
    to: (b: Nothing) => Any
  }>>(...adapters: AdapterList): AdapterComposeResult<AdapterList> =>
    (adapters.length === 0
      ? error("cannot compose empty list") 
      : adapters.length === 1 ? adapters[0]
      : AdapterFn.compose(adapters[0] as Nothing, AdapterFn.composeN(...adapters.slice(1)))
    ) as Nothing

}
