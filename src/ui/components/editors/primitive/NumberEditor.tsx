import React from "react"
import { State } from "@briken-io/react-state"
import { IO } from "@briken-io/functional-io"
import { TextField } from "@mui/material"
import { Unit } from "@briken-io/functional-core"
import NumberFormat, { NumberFormatProps } from "react-number-format"
import { coerceIn } from "../../../../util/math"
import { none, None, List } from "@briken-io/functional-core"
import { BrikenTooltip } from "../../primitives/BrikenTooltip"
import {Sx} from "../../../../util/style"
import { useFormContext } from "../../../../client/hooks/formContext"
import { Row } from "src/ui/components/layout/Stack"
import { useInputFormStyles } from "./StringEditor"
import {useIsDarkTheme, useUiPalette} from "src/client/hooks/theme"


type WrapperProps = {
 
  text?: string
  error: boolean
  disabled: boolean
  tooltip?: {
    enabled: true
    x?: number
    y?: number
  }
  children: JSX.Element

  sx?: Sx

}

const Wrapper = (
  props: WrapperProps
) => props.tooltip !== none ? 
  <BrikenTooltip
    disabled={!props.error}
    text={props.text}
    offset={{ x: props.tooltip.x, y: props.tooltip.y }}
    children={props.children}
    sx={props.sx}
  /> 
  : <Row sx={props.sx} children={props.children} />


export const NumberEditor = (
  props: {
    state?: State<number | None>
    prefix?: string
    suffix?: string
    endAdornment?: React.ReactNode
    label?: string
    placeholder?: string
    min?: number
    max?: number
    showErrors?: boolean
    errorList?: List<string>
    textFieldSx?: Sx
    inputSx?: Sx
    inputLabelSx?: Sx
    sx?: Sx
    disabled?: boolean,
    thousandSeparator?: boolean | string,
    decimalSeparator?: boolean | string,
    allowNegative?: boolean,
    possitive?: boolean
    onKeyPressed?: (key: string) => IO<Unit>
    noCoerce?: boolean
    maxLength?: number
    tooltip?: {
      enabled: true
      x?: number
      y?: number
    }
    newDesign?: boolean // TODO: Implementar con BrikenStringEditor
    size?: "small" | "medium"
    displayDecimals?: number
  }
) => {

  const formContext = useFormContext()

  const process = processInput(props.min, props.max, props.noCoerce) 
  const showErrors = props.showErrors ?? formContext.showErrors ?? false
  const palette = useUiPalette()

  const errorList = props.errorList ?? []

  const showTooltip = showErrors && errorList.length > 0

  const isDarkTheme = useIsDarkTheme()
  const styles = useInputFormStyles(isDarkTheme)()
  // const inputSx = Sx.combineN(
  //   props.newDesign === true ? {
  //     borderRadius: "5px",
  //     height: "33px",
  //     color: showTooltip ? theme.palette.negative : theme.palette.gray1,
  //   } : none,
  //   props.inputSx
  // )

  return <Wrapper
    tooltip={props.tooltip}
    error={showTooltip}
    disabled={!showTooltip}
    text={errorList.join(", ")}
    sx={props.sx}
  >
    <TextField
      value={props}
      variant={"outlined"}
      placeholder={props.placeholder}
      label={props.label}
      size={props.size}
      sx={
        Sx.combineN(
          {
            width: "100%",
            height: "100%"
          },
          props.textFieldSx
        )
      }
      InputLabelProps={{
        shrink: true,
        sx: props.inputLabelSx,
        classes: {
          // Para que el label sea del color del theme solo si se encuentra arriba
          shrink: styles.shrink,
          // Color del label cuando no esta siempre arriba
          formControl: styles.formControl
        }
      }}
      InputProps={{
        inputComponent: NumberFormatCustom as never,
        sx: {
          ...props.inputSx,
          color : isDarkTheme ? palette.gray0 : none,
          
        },
        classes: {
          root: props.showErrors === true ? styles.rootError : styles.root,
          focused: styles.focused,
          notchedOutline: styles.notchedOutline,
        },
        endAdornment: props.endAdornment
      }}
      inputProps={{
        value: process(props.state?.value),
        onValueChange: values => { props.state?.apply(() => process(values.floatValue))() },
        decimalScale: props.displayDecimals,
        min: props.min,
        max: props.max,
        thousandSeparator: props.thousandSeparator,
        decimalSeparator: props.decimalSeparator,
        prefix: props.prefix,
        suffix: props.suffix,
        allowNegative: props.allowNegative ?? props.possitive !== true,
        maxLength: props.maxLength ?? 26
      } as NumberFormatProps}
      error={showTooltip}
      //helperText={(props.showErrors ?? false) ? props.errorList?.join(", ") : none}
      onKeyPress={event => { props.onKeyPressed?.(event.key)() }}
      disabled={props.disabled}
    />
  </Wrapper>
}

const processInput = 
  (min?: number, max?: number, noCoerce?: boolean) => 
    (value: number | None) => 
      value === none ? none : 
      (min !== none && max !== none && noCoerce !== true) ? coerceIn(min, max)(value) :
      (min !== none && noCoerce !== true) ? Math.max(value, min) :
      (max !== none && noCoerce !== true) ? Math.min(value, max) :
      value

export const NumberFormatCustom = (
  props: NumberFormatProps & { 
    inputRef: (instance: NumberFormat<unknown> | null) => void 
  }
) => {

  const { inputRef, ...others } = props

  return (
    <NumberFormat
      {...others}
      getInputRef={inputRef}
    />
  )
}

