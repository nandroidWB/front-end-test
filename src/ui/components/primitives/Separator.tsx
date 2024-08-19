import React from "react"
import { Divider } from "@mui/material"
import { UiPrimitiveProps } from "./Types"
import {useIsDarkTheme, useUiPalette} from "src/client/hooks/theme"
import {Sx} from "src/util/style"
import {none} from "@briken-io/functional-core"


export const Separator = (
  props: UiPrimitiveProps & {
    alignSelf?: string
    borderTop?: string | number
    orientation?: "horizontal" | "vertical"
    sx?: Sx
  }
) => {

  const palette = useUiPalette()
  const isDarkTheme = useIsDarkTheme()

  return <Divider
    orientation={props.orientation ?? "horizontal"}
    sx={Sx.combineN(
      {
        alignSelf: props.alignSelf,
        borderTop: props.borderTop,
        width: props.width,
        height: props.height,
        borderColor: isDarkTheme ? palette.gray3 : none
      },
      props.sx
    )}
  />

}
