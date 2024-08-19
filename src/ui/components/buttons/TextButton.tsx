import React from "react"
import { Button } from "@mui/material"
import { IO } from "@briken-io/functional-io"
import { Unit } from "@briken-io/functional-core"
import { useUiTheme } from "../../../client/hooks/theme"
import { Sx } from "../../../util/style"

export const TextButton = (
  props: {
    onClick?: IO<Unit>
    sx?: Sx
    variant?: "contained" | "outlined" | "text"
    children?: React.ReactNode
    href?: string
    disabled?: boolean
    underline?: boolean
    disableRipple?: boolean
  }
) => {
  const theme = useUiTheme()
  
  const buttonStyle: Sx = 
    {
      textTransform: "none",
      padding: 0,
      color: props.disabled === true ? theme.palette.gray2 : theme.palette.primary,
      textDecoration: props.underline === true ? "underline" : "unset",
      ":hover": {
        background: "unset",
        textDecoration: props.underline === true ? "underline" : "unset"
      }
    } 
    
  return(
    <Button
      sx={
        Sx.combineN(
          buttonStyle,
          props.sx            
        )
      }
      href={props.href}
      children={props.children}
      onClick={props.onClick}
      disabled={props.disabled}
      variant={props.variant}
      disableTouchRipple={props.disableRipple}
    />
  )
}
