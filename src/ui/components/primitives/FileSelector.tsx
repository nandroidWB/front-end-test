
import { constant, Unit } from "@briken-io/functional-core"
import React, { useRef } from "react"
import { IO } from "@briken-io/functional-io"
import { listOf } from "@briken-io/list-utils"
import { List } from "@briken-io/functional-core"
import {DragAndDrop} from "../utils/DragAndDrop"
import {Optional} from "@briken-io/optional"
import {enumMatch, lazyEnumMatch} from "@briken-io/pattern-matching"
import { Sx } from "src/util/style"


export type FileType = "pdf" | "image" | "video"

const isFileType = (type: FileType) => (file: File): boolean =>
  lazyEnumMatch(type)({
    image: () => /image\/*/.test(file.type),
    pdf: () => file.type === "application/pdf",
    video: () => /video\/*/.test(file.type)
  })
 
export const FileSelector = (
  props: {
    onSelect?: (files: List<File>) => IO<Unit>
    children?: React.ReactNode
    enabled?: boolean
    fileType?: FileType
    sx?: Sx
  }
) => {

  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <DragAndDrop
      onClick={() => { inputRef.current?.click() }}
      onDrop={(files) => {
        const filter = Optional.map(props.fileType, isFileType) ?? constant(true)
        return props.onSelect?.(files.filter(filter)) ?? IO.noOp
      }}
      sx={props.sx}
    >
      <input
        ref={inputRef}
        disabled={!(props.enabled ?? true)}
        type="file"
        accept={Optional.map(props.fileType, 
          it => enumMatch(it)({
            pdf: "application/pdf",
            image: "image/*",
            video: "video/*"
          })
        )}
        style={{ display: "none" }}
        onChange={(event) => {
          props.onSelect?.(toListOfFiles(event.target.files))()
          // eslint-disable-next-line functional/immutable-data
          event.target.value = null as never
        }}
      />
      {props?.children}
    </DragAndDrop>
  )
}

export const toListOfFiles = (fileList: FileList | null): List<File> => 
  fileList !== null ? listOf(fileList.length, i => fileList[i]) : []


