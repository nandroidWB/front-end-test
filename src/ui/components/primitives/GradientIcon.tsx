import React, { useMemo } from "react"
import { OverridableComponent } from "@mui/material/OverridableComponent"
import { SvgIconTypeMap, SvgIconProps } from "@mui/material"
import { Sx } from "src/util/style"
import { listOf } from "@briken-io/list-utils"
import { IO } from "@briken-io/functional-io"
import { Optional } from "@briken-io/optional"
import { none } from "@briken-io/functional-core"

export type GradientType = "Linear" | "Radial"

export type Gradient = {
  type: Optional<GradientType>,
  angle: Optional<number>,
  first: {
    color: string
    offset: Optional<number>
  },
  second: {
    color: string,
    offset: Optional<number>
  }
}

export const rgbaToHex = (color: string): string => {

  if (color.includes("#"))
    return color

  // Get the numbers from the input string
  const values = color.match(/\d+/g)?.map(Number) ?? []
  // Convert each number to a hexadecimal string
  const hexValues = values.map((num) => num.toString(16).padStart(2, "0"))
  // Combine the hexadecimal values into a single string
  const hexColor = `#${hexValues.join("")}`
  return hexColor
}

export const isGradient = (color: string) => 
  color.length > 6 && (color.includes("linear") || color.includes("radial"))


const randomChar: IO<string> =
  () => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
    return characters[Math.floor(Math.random() * characters.length)]
  }

const randomId: IO<string> =
  IO.map(IO.sequential(listOf(15, () => randomChar)), it => it.join(""))

export type MaterialIcon = OverridableComponent<SvgIconTypeMap> & { muiName: string }

// Los iconos de material no toman un color gradiente (sx={{color: gradiente}}) 
export const GradientIcon = (
  props: {
    icon:  MaterialIcon
    iconProps?: SvgIconProps
    gradient: string
  }
) => {

  const parsed = parseGradient(props.gradient) ?? {
    angle: 0,
    first: {
      color: props.gradient,
      offset: 0
    },
    second: {
      color: props.gradient,
      offset: 1
    }
  }

  const Icon = props.icon

  const id = useMemo(randomId, [])
  
  return <>
    <Icon
      {...props.iconProps}  
      sx={
        Sx.combineN(
          props.iconProps?.sx,
          {fill: `url(#${id})`}
        )
      }
    />
    <svg width={0} height={0}>
      <linearGradient id={id} gradientTransform={`rotate(${parsed.angle})`}>
        <stop offset={parsed.first.offset} stopColor={parsed.first.color}  />
        <stop offset={parsed.second.offset} stopColor={parsed.second.color} />
      </linearGradient>
    </svg>
  </>
}

export const parseGradient = (gradient: string, hexaColor?: boolean): Optional<Gradient> =>
  Optional.do(__ => {

    const gradientType = gradient.toLowerCase().includes("linear") ? "Linear" : "Radial"

    const gradientSplit = 
      gradient.
        substring(gradient.indexOf("(") + 1, gradient.lastIndexOf(")")).
        split( /,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/ ) 

    const angle = gradientSplit[0]?.split("deg")?.[0] ?? __(none)
    const first = gradientSplit[1] ?? __(none)
    const second = gradientSplit[2] ?? __(none)

    const hexaColors = first.includes("#")
    const separator = hexaColors ? " " : ")" 

    const firstColor = first.substring(0, first.lastIndexOf(separator) + 1)
    const firstOffset = Number(first.substring(first.lastIndexOf(separator) + 1).split("%")[0])

    const secondColor = second.substring(0, second.lastIndexOf(separator) + 1)
    const secondOffset = Number(second.substring(second.lastIndexOf(separator) + 1).split("%")[0])

    return {
      type: gradientType,
      first: {
        color: hexaColor === true && !hexaColors ? rgbaToHex(firstColor) : firstColor.trim(),
        offset: firstOffset
      },
      second: {
        color: hexaColor === true && !hexaColors ? rgbaToHex(secondColor) : secondColor.trim(),
        offset: secondOffset
      },
      angle: Number(angle)
    }
  })


