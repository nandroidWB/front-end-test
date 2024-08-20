import { List, none } from "../../functional-core"
import {Affine} from "./Affine"

export type Endo<T> = (input: T) => T

export const prism = <A, B extends A>(
  check: (value: A) => value is B
): Affine<A, B> => ({
    read: value => check(value) ? value : none,
    over: transform => previous => check(previous) ? transform(previous) : previous
  })

export const indexAccesor = <T>(index: number): Affine<List<T>, T> => ({
  read: list => list[index],
  over: transform => previous => (0 <= index && index < previous.length) ?
    [
      ...previous.slice(0, index), 
      transform(previous[index]), 
      ...previous.slice(index + 1, previous.length)
    ] :
    previous
})

export * from "./Lens"
export * from "./Affine"
export * from "./Adapter"

