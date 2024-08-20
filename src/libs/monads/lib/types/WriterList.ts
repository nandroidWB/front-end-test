import { List } from "../../../functional-core"
import { Writer, WriterFn } from "./Writer"
import { listMonoidConcatenation } from "../monoid/Monoid"

export type WriterList<L, T> = Writer<List<L>, T>

export const WriterListFn = <L>() => WriterFn(listMonoidConcatenation<L>())

