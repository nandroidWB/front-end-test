import React from "react"
import { State, useStatefull } from "@briken-io/react-state"
import { IO } from "@briken-io/functional-io"
import { TextField } from "@mui/material"
import { Unit } from "@briken-io/functional-core"
import NumberFormat, { NumberFormatProps } from "react-number-format"
import { none, None, List } from "@briken-io/functional-core"
import { BrikenTooltip } from "../../primitives/BrikenTooltip"
import { useInputFormStyles } from "./StringEditor"
import {Sx} from "../../../../util/style"
import { useFormContext } from "../../../../client/hooks/formContext"
import { useIsDarkTheme, useUiPalette } from "../../../../client/hooks/theme"
import { Optional } from "@briken-io/optional"
import { Row } from "src/ui/components/layout/Stack"
import { Fixed, fixedEq, fixedTimes10Power, parseFixed } from "src/model/Fixed"
import { formatFixed } from "src/ui/formatting/formatting"
import { useDecimalSeparator } from "src/ui/i18n/internationalization"
import { ifCatch } from "src/util/functional"
import { useIO } from "src/client/hooks/ioState"
import { stateSet } from "src/util/utils"


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

export const FixedEditor = (
  props: {
    fieldId?: string
    state?: State<Fixed | None>
    prefix?: string
    suffix?: string
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
    decimalSeparator?: string,
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
    percent?: boolean
    newDesign?: boolean // TODO: Implementar con BrikenStringEditor
    endAdornment?: JSX.Element
    displayDecimals?: number
  }
) => {

  const formContext = useFormContext()

  //const process = processInput(props.min, props.max, props.noCoerce) 
  const showErrors = props.showErrors ?? formContext.showErrors ?? false

  const errorList = 
    props.errorList ?? 
    formContext.errors?.[props.fieldId ?? ""] ?? 
    []

  const showTooltip = showErrors && errorList.length > 0

  const isDarkTheme = useIsDarkTheme()
  const styles = useInputFormStyles(isDarkTheme)()

  const contextSeparator = useDecimalSeparator()

  const decimalSeparator = props.decimalSeparator ?? contextSeparator

  const tenPowerFactor = (props.percent ?? false) ? 2 : 0

  const textToFixed = (text: string) => 
    ifCatch(
      () => fixedTimes10Power(parseFixed(text), -tenPowerFactor), 
      none
    )

  const fixedToText = (fixed: Optional<Fixed>) =>
    Optional.map(fixed, it => formatFixed(fixedTimes10Power(it, tenPowerFactor))) ?? ""

  const propsStateFixed = props.state?.value
  const propsStateText = fixedToText(propsStateFixed)

  const internalState = useStatefull(() => propsStateText)

  const palette = useUiPalette()
  const darkTheme = useIsDarkTheme()

  const internalStateFixed = textToFixed(internalState.value)

  const propsStateSet = (value: Optional<Fixed>) => props.state?.apply(() => value) ?? IO.noOp
  const internalStateSet = stateSet(internalState)
  
  const synced = 
    (internalStateFixed == none && propsStateFixed == none) ||
    (Optional.do(__ => fixedEq(__(internalStateFixed), __(propsStateFixed))) ?? false)

  useIO(
    !synced ? internalStateSet(propsStateText) : IO.noOp,
    [synced]
  )

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
        readOnly: props.disabled,
        sx: Sx.combine(
          props.inputSx,
          { 
            color: darkTheme ? palette.gray0 : palette.gray1 
          }
        ),
        classes: {
          root: props.showErrors === true ? styles.rootError : styles.root,
          focused: styles.focused,
          notchedOutline: styles.notchedOutline,
        },
        endAdornment: props.endAdornment
      }}
      inputProps={{
        value: internalState.value.replace(".", decimalSeparator),//process(props.state?.value),
        onValueChange: values => {
          const text = values.value
          propsStateSet(textToFixed(text))()
        },
        // For mobile overflow
        style: {
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          width: "100%"
        },
        min: props.min,
        max: props.max,
        thousandSeparator: props.thousandSeparator,
        decimalSeparator: decimalSeparator,
        prefix: props.prefix,
        suffix: props.suffix,
        allowNegative: props.allowNegative ?? props.possitive !== true,
        maxLength: props.maxLength ?? 26,
        decimalScale: props.displayDecimals
      } as NumberFormatProps}
      error={showTooltip}
      //helperText={(props.showErrors ?? false) ? props.errorList?.join(", ") : none}
      onKeyPress={event => { props.onKeyPressed?.(event.key)() }}
    />
  </Wrapper>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const processInput = 
  (min?: Fixed, max?: Fixed, noCoerce?: boolean) => 
    (value: Optional<Fixed>) => 
      value === none ? none : 
      (min !== none && max !== none && noCoerce !== true) ? value : // TODO coerceIn(min, max)(value) :
      (min !== none && noCoerce !== true) ? value : // TODO fixed max
      (max !== none && noCoerce !== true) ? value : // TODO min
      value



const NumberFormatCustom = (
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

