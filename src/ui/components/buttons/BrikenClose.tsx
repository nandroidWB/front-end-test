import { Unit } from "@briken-io/functional-core"
import { Theme } from "@mui/material"
import Close from "@mui/icons-material/CloseRounded"
import React from "react"
import { IO } from "@briken-io/functional-io"
import { SxProps } from "@mui/system"
import { useUiTheme } from "../../../client/hooks/theme"


export const BrikenClose = (
  props : { 
    onClick: IO<Unit>
    color?: string
    sx?: SxProps<Theme>
  }
) => {
  const theme = useUiTheme()

  return(
    <Close 
      sx={{ 
        cursor: "pointer",
        position: "absolute", 
        top: 10, 
        right: 10, 
        width: 20,
        height: 20,
        color: props.color ?? theme.palette.gray1,
        ...props.sx 
      }}
      onClick={props.onClick}  
    />
  )
}