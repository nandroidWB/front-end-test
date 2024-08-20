import { Any, List, none, None, Nothing, Null } from "../libs/functional-core"

export type NullToNone<T> = T extends Null ? None : T

export const nullToNone = <T>(value: T): NullToNone<T> => (value === null ? none : value) as Nothing

export type DeepNullToNone<T, KeepSame = never> = 
  T extends KeepSame ? T :
  T extends null ? None :
  {
    [P in keyof T]: DeepNullToNone<T[P], KeepSame>
  }

export const deepNullToNone = <T, K = never>(
  value: T, 
  keep?: (it: Any) => it is K
): DeepNullToNone<T, K> =>
  (keep !== none && keep(value) ? value :
    value === null ? none :
    Array.isArray(value) ? value.map(it => deepNullToNone(it, keep)) :
    typeof value === "object" ?
          buildObject(
            objectKeys(value),
            key => deepNullToNone(value[key], keep) as never
          ):
          value
  ) as never

export const mapObjectValues = <K extends keyof never, T, R>(
  record: Record<K, T>, 
  f: (key: K, value: T) => R
): Record<K, R> => {
  let result: Partial<Record<K, R>> = {}
  Object.entries<T>(record).map(([key, value]) => {
    result[key as K] = f(key as K, value)
  })
  return result as Record<K, R>
}
  
export const access = (value: unknown, key: keyof never): unknown => 
  typeof value === "object" && value !== null ? (value as never)[key] : none

export const objectKeys = <T>(
  object: T
): List<keyof T> => Object.getOwnPropertyNames(object) as never


export const buildObject = <R, K extends keyof R>(
  keys: List<K>,
  values: (key: K) => R[K]
): R =>
  keys.reduce((acc, next) => ({...acc, [next]: values(next)}), {}) as R


export const valueEquals = (lhs: unknown, rhs: unknown): boolean => {
  if (lhs === rhs) return true

  if (
    lhs === null || lhs === none || 
    rhs === null || rhs === none
  ) return false

  const leftType = typeof lhs
  const rightType = typeof lhs
  
  if (leftType !== rightType) return false

  if (leftType !== "object") return lhs === rhs
  
  const leftKeys = Object.keys(lhs as never)
  const rightKeys = Object.keys(rhs as never)

  if (leftKeys.length !== rightKeys.length) return false

  return !leftKeys.some(key => !valueEquals((lhs as never)[key], (rhs as never)[key]))
}
