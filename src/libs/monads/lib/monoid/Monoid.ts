import { List } from "../../../functional-core"


export type Monoid<T> = {
  identity: T
  combine: (lhs: T, rhs: T) => T
}

export const monoidReduce = 
  <T>(monoid: Monoid<T>) => (value: List<T>): T =>
    value.reduce(monoid.combine, monoid.identity)

export const numberMonoidAddition: Monoid<number> = {
  identity: 0,
  combine: (lhs, rhs) => lhs + rhs
}

export const numberMonoidMul: Monoid<number> = {
  identity: 1,
  combine: (lhs, rhs) => lhs * rhs
}

export const stringMonoidConcat: Monoid<string> = {
  identity: "",
  combine: (lhs, rhs) => lhs + rhs
}

export const listMonoidConcatenation = <T>(): Monoid<List<T>> => ({
  identity: [],
  combine: (lhs, rhs) => [...lhs, ...rhs]
})

export const booleanMonoidAnd: Monoid<boolean> = {
  identity: true,
  combine: (lhs, rhs) => lhs && rhs
}

export const booleanMonoidOr: Monoid<boolean> = {
  identity: false,
  combine: (lhs, rhs) => lhs || rhs
}

export const numberMonoidMax: Monoid<number> = {
  identity: -Infinity,
  combine: (lhs, rhs) => Math.max(lhs, rhs)
}

export const numberMonoidMin: Monoid<number> = {
  identity: Infinity,
  combine: (lhs, rhs) => Math.min(lhs, rhs)
}


