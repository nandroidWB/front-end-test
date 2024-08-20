import { Typed } from ".";
import { Any, None, none, Nothing, Null } from "../../functional-core";


export const isNull = (value: Any): value is Null => value === null
export const isNone = (value: Any): value is None => value === none
export const isNumber = (value: Any): value is number => typeof value === "number"
export const isString = (value: Any): value is string => typeof value === "string"
export const isBoolean = (value: Any): value is boolean => typeof value === "boolean"
export const isRecord = (value: Any): value is Record<Nothing, Any> => typeof value === "object"
export const isDefined = <T>(value: T | None): value is T => value !== none

export const check = <T extends Typed, K extends T["type"]>(
  value: T,
  key: K
): value is T & { type: K } => value.type === key


export type TypeChecker<T> = (value: Any) => value is T

export const checkOr = <T1, T2>(
  check1: TypeChecker<T1>,
  check2: TypeChecker<T2>
): TypeChecker<T1 | T2> => 
    (it): it is T1 | T2 => check1(it) || check2(it)

export const checkAnd = <T1, T2>(
  check1: TypeChecker<T1>,
  check2: TypeChecker<T2>
): TypeChecker<T1 & T2> => 
    (it): it is T1 & T2 => check1(it) && check2(it)

export const checkProduct = <I extends Record<string, TypeChecker<any>>>(
  body: I
): TypeChecker<{ [K in keyof I]: I[K] extends TypeChecker<infer R> ? R : never }> => 
    ((value: never) => typeof value === "object" && !Object.keys(body).some(key => !body[key](value[key]))) as never


