import React from "react"
import { SxProps, Typography } from "@mui/material"
import {none, None, Unit} from "../../../libs/functional-core"
import {IO} from "../../../libs/functional-io"


export type FontWeight =  
  | "light"       // 300
  | "regular"     // 400
  | "medium"      // 500
  | "semiBold"    // 600
  | "bold"        // 700
  | "extraBold"   // 800

export type TypographyStyle = 
  | "headline1" 
  | "headline2" 
  | "subtitle1" 
  | "subtitle2" 
  | "body1" 
  | "body2" 
  | "item" 
  | "button" 
  | "caption" 
  | "overline" 
 

export const typographyStyleCases = (): Record<TypographyStyle, SxProps> => 
  ({
    headline1: {
      // Tamaño mobile
      fontSize: { xs: "24px", md: "30px" },
      fontFamily: "Nunito Sans",
      fontWeight: 700,
    },
    headline2: {
      fontSize: "18px",
      fontFamily: "Roboto",
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: "15px",
      fontFamily: "Roboto",
      fontWeight: 400,
      
    
    },
    subtitle2: {
      fontSize: "13px",
      fontFamily: "Roboto",
      fontWeight: 600,
      
    },
    body1: {
      fontSize: "13px",
      fontFamily: "Roboto",
      fontWeight: 400, 
      
    },
    body2: {
      fontSize: "12px",
      fontFamily: "Roboto",
      fontWeight: 400, 
      
    },
    item: {
      fontSize: "12px",
      fontFamily: "Roboto",
      fontWeight: 300, 
      
    },
    button: {
      fontSize: "14px",
      fontFamily: "Roboto",
      fontWeight: 400,
      // Generalmente vamos a querer que el color lo maneje el RoundedButton, caso contrario explicitarlo 
      //color: theme.palette.primary
    },
    caption: {
      fontSize: "10px",
      fontFamily: "Roboto",
      fontWeight: 400,
      
    },
    overline: {
      fontSize: "12px",
      fontFamily: "Roboto",
      fontWeight: 400,
      textTransform: "uppercase", 
      
    }
  })


export type TextProps = {
  onClick?: IO<Unit>
  sx?: SxProps
  type?: TypographyStyle
  // Soporta gradientes
  color?: string
  backgroundColor?: string
  text?: string
  fontSize?: number | string
  fontStyle?: "normal" | "italic" | "oblique"
  textAlign?: "center" | "left" | "right" | "justify"
  fontWeight?: FontWeight
  children?: React.ReactNode
  align?: AlignText
  // Para que funcione bien el no wrap en responsive hay que poner width: 0 y flexGrow: 1
  noWrap?: boolean
  cursor?: string
  wrapper?: (props: { children: JSX.Element }) => JSX.Element
}

// BUG: Si se el padre de un <Text/> se le pone una width en porcentaje para que el texto quede en varios renglones
// visualmente el texto se wrapea pero su padre continua agrandandose tanto como si el text estuviese al 100%
// Da problemas cuando se usan % de width con el padre, se puede resolver harcodeando el width del texto numericamente 
export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (props, ref) => {


    const Wrapper = props.wrapper
    

    const content = <Typography
      ref={ref}
      sx={props.sx}
      align={props.align}
      onClick={props.onClick}
      noWrap={props.noWrap ?? false}
    >
      {props.children}
    </Typography>
    
    return Wrapper !== none ? <Wrapper children={content} /> : content
  }
)

export type AlignText = "inherit" | "left" | "center" | "right" | "justify" | None 

export const Txt = Text
