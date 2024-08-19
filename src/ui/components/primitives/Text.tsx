/* eslint-disable react/jsx-key */
import React, { ReactNode } from "react"
import { Typography } from "@mui/material"
import { buildSxStyle, UiPrimitiveProps } from "./Types"
import { none, None } from "@briken-io/functional-core"
import { enumMatch } from "@briken-io/pattern-matching"
import { UiPalette } from "../../../contextual/appLabel/AppLabel"
import { useUiPalette } from "../../../client/hooks/theme"
import { Sx } from "src/util//style"
import { addFieldOrEmpty } from "src/util//functional"
import { Optional } from "@briken-io/optional"
import { List } from "@briken-io/list-utils"
import { isGradient } from "./GradientIcon"

export type UiPaletteColor = keyof UiPalette

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
 

export const typographyStyleCases = (palette: UiPalette): Record<TypographyStyle, Sx> => 
  ({
    headline1: {
      // Tamaño mobile
      fontSize: { xs: "24px", md: "30px" },
      fontFamily: "Nunito Sans",
      fontWeight: 700,
      color: palette.gray1
    },
    headline2: {
      fontSize: "18px",
      fontFamily: "Roboto",
      fontWeight: 500,
      color: palette.gray1
    },
    subtitle1: {
      fontSize: "15px",
      fontFamily: "Roboto",
      fontWeight: 400,
      color: palette.gray1
    
    },
    subtitle2: {
      fontSize: "13px",
      fontFamily: "Roboto",
      fontWeight: 600,
      color: palette.gray1
    },
    body1: {
      fontSize: "13px",
      fontFamily: "Roboto",
      fontWeight: 400, 
      color: palette.gray1
    },
    body2: {
      fontSize: "12px",
      fontFamily: "Roboto",
      fontWeight: 400, 
      color: palette.gray1
    },
    item: {
      fontSize: "12px",
      fontFamily: "Roboto",
      fontWeight: 300, 
      color: palette.gray1
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
      color: palette.gray1
    },
    overline: {
      fontSize: "12px",
      fontFamily: "Roboto",
      fontWeight: 400,
      textTransform: "uppercase", 
      color: palette.gray2
    }
  })

export const buildTypographyStyle = (palette: UiPalette, type?: TypographyStyle): Sx => 
  type !== none ? 
    enumMatch(type)<Sx>(typographyStyleCases(palette)) : {}

export type TextProps = UiPrimitiveProps & {
  sx?: Sx
  type?: TypographyStyle
  // Soporta gradientes
  color?: string
  paletteColor?: UiPaletteColor
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


    const palette = useUiPalette()
    const Wrapper = props.wrapper
    const typographyStyle = buildTypographyStyle(palette, props.type)
    
    const withLineBreaks = (text: Optional<string>): List<ReactNode> => {
      if (text == undefined) return [<></>]
      return text.split("\n").flatMap((paragraph, index) => (
        index == 0 ? [<>{paragraph}</>] : [<br />, <>{paragraph}</>])
      )
    }

    const color = props.color ?? Optional.map(props.paletteColor, it => palette[it])

    // Para textos con gradientes
    const colorSx: Optional<Sx> = Optional.map(
      color, it =>
        isGradient(it) ? 
          ({
            background: it,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }) :
          ({ color : it })
    )

    const content = <Typography
      ref={ref}
      sx={
        Sx.combineN(
          typographyStyle,
          addFieldOrEmpty(props, "fontSize"),
          addFieldOrEmpty(props, "fontWeight"),
          addFieldOrEmpty(props, "fontStyle"),
          addFieldOrEmpty(props, "textAlign"),
          addFieldOrEmpty(props, "cursor"),
          buildSxStyle(props),
          colorSx,
          props.sx            
        )
      }
      align={props.align}
      onClick={props.onClick}
      noWrap={props.noWrap ?? false}
    >
      {withLineBreaks(props.text)}
      {props.children}
    </Typography>
    
    return Wrapper !== none ? <Wrapper children={content} /> : content
  }
)

export type AlignText = "inherit" | "left" | "center" | "right" | "justify" | None 

export const Txt = Text
