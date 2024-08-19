import React from "react"
import { Button, Theme } from "@mui/material"
import { IO } from "@briken-io/functional-io"
import { none, Unit } from "@briken-io/functional-core"
import { SxProps } from "@mui/system"
import { Row } from "../layout/Stack"
import { Loading } from "../primitives/Loading"
import { Sx } from "src/util//style"
import { useIsDarkTheme, useUiPalette } from "src/client//hooks/theme"
import { isColor } from "src/model/Misc"
import { StringT } from "src/model/Model"
import { Text } from "../primitives/Text"

export type RoundedButtonProps = {
  onClick?: IO<Unit>
  sx?: SxProps<Theme>
  // Primary es con color (generalmente el color primario) y secondary es el outlined
  variant?: "primary" | "secondary"
  backgroundColor?: string
  children?: React.ReactNode
  enabled?: boolean
  hover?: boolean
  loading?: boolean
  urlRef?: string
  tableButton?: boolean
}

export const RoundedButton = (
  props: RoundedButtonProps
) => {
  
  const palette = useUiPalette()
  const isDarkTheme = useIsDarkTheme()
  
  const secondaryButton = props.variant === "secondary"
  const childrenColor = secondaryButton ? palette.primary : palette.gray5

  // El color de relleno del botón no siempre es el primary
  const backgroundColor = secondaryButton ? palette.background : 
    props.backgroundColor === none ? 
      palette.primary :
      isColor(props.backgroundColor) ? props.backgroundColor : props.backgroundColor 

  // Si es un color custom no tiene boxShadow
  const boxShadowColor = props.backgroundColor === none ? 
    // Esto equivale a un color expresado con rgba e inyectarle un canal alpha
    palette.primary :
    "unset"
  
  const buttonStyle: Sx = 
    (props.enabled ?? true) ?
      // Boton habilitado
      {
        background: backgroundColor,
        color: childrenColor,
        border: secondaryButton ? `1px solid ${palette.primary}` : "none",
        // 61 es 38% de opacidad 
        boxShadow: secondaryButton ? "unset" : `0px 3px 15px 4px ${boxShadowColor}61`,
      } :
      // Boton deshabilitado
      {
        border: secondaryButton ? `1px solid ${isDarkTheme ? palette.gray4 : palette.gray2}` : "none",
        backgroundColor: secondaryButton ? "white" : palette.gray4,
        // Important para sobreescribir el color que impone material cuando deshabilitad un boton
        color: `${secondaryButton ?  palette.gray3 : palette.gray0}`
      } 

  const hoverStyle: Sx = 
    {
      ":hover": props.hover === true ?  
        {
          background: palette.emphasis,
          // Esto evita que cuando se active el hover, 
          // luego de sacar el cursor no haga un parpadeo en blanco
          webkitTransition: "4s ease",
          msTransition: "2s ease",
          transition: "2s ease" 
        } : 
        // TODO arreglar: Si no lo aclaro fallbackea en un hover con background blanco
        {
          background: backgroundColor
        }
    }     
  

  const layoutStyle: Sx = {
    borderRadius: "12px",
    textTransform: "none",
    // Los botones para las tablas son un poco más chicos
    width: props.tableButton === true ? "106px" : "135px",
    height: props.tableButton === true ? "32px" : "38px"
  }

  const children = StringT.check(props.children) ? <Text text={props.children} type={"button"}/> : props.children
  
  return (
    <Button
      sx={
        Sx.combineN(
          buttonStyle,
          hoverStyle,
          layoutStyle,
          props.sx            
        )
      }
      children={
        props.loading === true ?
          <Row justifyContent={"center"} alignItems={"center"} width="100%" height="100%">
            <Loading size={24} sx={{ marginRight: 1, color: childrenColor }}/>
            {children}
          </Row> :
          children  
      }
      onClick={event => {
        if (props.onClick !== none && props.loading !== true ) {
          event.stopPropagation()
          props.onClick()
        }
      }}
      href={props.urlRef}
      disabled={!(props.enabled ?? true)}
    />
  )
}
