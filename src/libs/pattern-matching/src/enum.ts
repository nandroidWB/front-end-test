import { Optional } from "../../optional"


export const matchEnum = 
  <T extends string>(value: T) => 
  <R>(cases: Record<T, R>): R => 
    cases[value]

export const matchEnumPartial = 
  <T extends string>(value: T) => 
  <R>(cases: Partial<Record<T, R>>): Optional<R> => 
    cases[value]

export const matchEnumPartialLazy = 
  <T extends string>(value: T) => 
  <R>(cases: Partial<Record<T, () => R>>): Optional<R> => 
    cases[value]?.()

export const matchEnumLazy = <T extends string>(value: T) => 
  <R>(cases: Record<T, () => R>): R => 
    cases[value]()


export const lazyEnumMatch = matchEnumLazy
export const enumMatch = matchEnum

