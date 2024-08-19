import React, { ComponentProps } from "react"
import { AnimationProps, buildStyle, UiPrimitiveProps } from "./Types"
import { Property } from "csstype"
import { motion } from "framer-motion"
import { setTo, useStatefull } from "@briken-io/react-state"
import { Sx } from "src/util//style"
import { Box } from "@mui/material"
import { none } from "@briken-io/functional-core"

// TODO: mejorar
// Para cambiar las dimensiones de un SVG hay que explicitarle el ancho y alto, con uno no basta
export const Picture = (
  props: UiPrimitiveProps & {
    source?: string
    svg?: JSX.Element
    alt?: string
    fit?: Property.ObjectFit
    style?: React.CSSProperties
    sx?: Sx
  }
) => {

  const loaded = useStatefull(() => false)
  return props.svg === none ?
    <Box
      component={"img"}
      src={props.source}
      onLoad={setTo(loaded, true)}
      alt={props.alt}
      sx={props.sx}
      style={{
        objectPosition: "center",
        objectFit: props.fit,
        ...buildStyle(props)
      }}
      onClick={props.onClick}
    /> :
    <Box
      onLoad={setTo(loaded, true)}
      sx={props.sx}
      style={{
        objectPosition: "center",
        objectFit: props.fit,
        ...buildStyle(props),
      }}
      onClick={props.onClick}
      children={props.svg}
    />
}

export const MotionPicture = (
  props: UiPrimitiveProps & {
    source?: string
    alt?: string
    fit?: Property.ObjectFit
    imgProps?: ComponentProps<typeof motion.img>
    opacity?: number
  } & AnimationProps
) => {

  const loaded = useStatefull(() => false)

  return <motion.img
    className={props.className}
    src={props.source}
    onLoad={setTo(loaded, true)}
    alt={props.alt}
    style={{
      objectPosition: "center",
      objectFit: props.fit,
      ...buildStyle(props)
    }}
    initial={props.enter ?? { opacity: 0 }}
    animate={props.target ?? { opacity: loaded.value ? props.opacity ?? 1 : 0 }}
    exit={props.exit ?? { opacity: 0 }}
    layout={props.animateLayout}
    onClick={props.onClick}
    {...props.imgProps}
  />
}
