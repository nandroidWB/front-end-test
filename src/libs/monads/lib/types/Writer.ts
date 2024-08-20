import { List, Unit, id, letIn, unit } from "../../../functional-core"
import { Monoid, monoidReduce } from "../monoid/Monoid"


export type Writer<L, T> = {
  log: L
  value: T
}

export const WriterFn = <L>(monoid: Monoid<L>) => ({

  pure: <T>(value: T): Writer<L, T> => ({
    log: monoid.identity,
    value: value,
  }),

  lift: <I, O>(transform: (input: I) => O) => (value: Writer<L, I>): Writer<L, O> =>
    ({
      log: value.log,
      value: transform(value.value),
    }),
  
  map: <I, O>(value: Writer<L, I>, transform: (input: I) => O): Writer<L, O> =>
    WriterFn(monoid).lift(transform)(value),
  
  bind: <I, O>(value: Writer<L, I>, transform: (input: I) => Writer<L, O>): Writer<L, O> =>
    letIn(transform(value.value), result => 
      ({
        log: monoid.combine(value.log, result.log),
        value: result.value,
      })
    ),

  flatten: <T>(value: Writer<L, Writer<L, T>>): Writer<L, T> =>
    WriterFn(monoid).bind(value, id),

  compose: <A, B, C>(
    lhs: (a: A) => Writer<L, B>, 
    rhs: (b: B) => Writer<L, C>
  ) =>
    (a: A): Writer<L, C> => WriterFn(monoid).bind(lhs(a), rhs),
  
  do: <T>(
    body: (__: <R>(value: Writer<L, R>) => R) => T
  ): Writer<L, T> => {
      
      let log: L = monoid.identity

      const value = body(
        value => {
          log = monoid.combine(log, value.log)
          return value.value
        }
      )

      return {
        log: log,
        value: value,
      }
    },


  log: (log: L): Writer<L, Unit> =>
    ({
      log: log,
      value: unit,
    }),
  
  logMany: (logs: List<L>): Writer<L, Unit> =>
    ({
      log: monoidReduce(monoid)(logs),
      value: unit,
    })

})

