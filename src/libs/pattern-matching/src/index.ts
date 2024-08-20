import { Optional } from "../../optional"


export type Typed = Record<"type", string>

export type TagMap<T extends Typed> = {
  [K in T["type"]]: T extends { type: K } ? T : never
}

export type Pattern<T extends Typed, R> = {
  [K in keyof TagMap<T>]: (value: TagMap<T>[K]) => R
}

export const match = <T extends Typed>(
  value: T
) => <R>(
  cases: Pattern<T, R>
): R => 
      cases[value.type as T["type"]](value as TagMap<T>[T["type"]])

export const matchPartial = <T extends Typed>(
  value: T
) => <R>(
  cases: Partial<Pattern<T, R>>
): Optional<R> => 
      cases[value.type as T["type"]]?.(value as TagMap<T>[T["type"]])

export type EnumPattern<E extends string, R> = {
  [K in E]: R
}

export * from "./checks"
export * from "./enum"
