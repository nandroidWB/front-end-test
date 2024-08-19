import React, { CSSProperties } from "react"
import { useUiTheme } from "../../../client/hooks/theme"
import {UiTheme} from "../../../contextual/appLabel/AppLabel"
import {openLink} from "../../../util/utils"

export const Hyperlink = (
  props: {
    url: string
    text?: string
    newPage?: boolean
    prefix?: React.ReactNode
    sufix?: React.ReactNode
    bold?: boolean
    fontSize?: string | number
    noUnderline?: boolean
    style?: CSSProperties
  }
) => {
  const theme = useUiTheme()
  return(
    <a
      rel="noopener noreferrer"
      target={props.newPage === true ? "_blank" : ""}
      style={props.noUnderline === true ? 
        {textDecoration: "none", fontSize:props.fontSize, ...props.style, cursor: "pointer", ...customStyle(theme)  } : 
        {fontSize:props.fontSize, cursor: "pointer", ...customStyle(theme), ...props.style }
      } 
      onClick={openLink(props.url)}
    >   
      {props.prefix}
      {props.bold === true ? <strong>{props.text}</strong> : props.text}
      {props.sufix}
    </a>
  )
}

const customStyle = (theme: UiTheme) : CSSProperties => ({
  display: "flex",
  alignItems:"center",
  fontFamily:"-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
  color: theme.palette.secondary
})
