import React, { CSSProperties } from "react"
import {IOFn} from "../../../libs/functional-io"


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
) => 
  <a
      href={props.url}
      rel="noopener noreferrer"
      target={props.newPage === true ? "_blank" : ""}
      style={props.noUnderline === true ? 
        {textDecoration: "none", fontSize:props.fontSize, ...props.style, cursor: "pointer"} : 
        {fontSize:props.fontSize, cursor: "pointer", ...props.style }
      } 
      onClick={IOFn.pure(props.url)}
    >   
      {props.prefix}
      {props.bold === true ? <strong>{props.text}</strong> : props.text}
      {props.sufix}
    </a>


