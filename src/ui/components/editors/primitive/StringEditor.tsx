import React from "react"
import { IconButton, TextField } from "@mui/material"
import { IO } from "@briken-io/functional-io"
import { setTo, State } from "@briken-io/react-state"
import { Unit } from "@briken-io/functional-core"
import {useFormFieldContext} from "../../../../client/hooks/formContext"
import { none, List } from "@briken-io/functional-core"
import {BrikenTooltip} from "../../primitives/BrikenTooltip"
import Visibility from "@mui/icons-material/VisibilityRounded"
import VisibilityOff from "@mui/icons-material/VisibilityOffRounded"
import {makeThemedStyles, useIsDarkTheme, useUiPalette} from "../../../../client/hooks/theme"
import { Sx } from "src/util//style"
import { Row } from "src/ui/components/layout/Stack"
import { enumMatch } from "@briken-io/pattern-matching"
import { NumberFormatCustom } from "./NumberEditor"


export type StringEditorProps = {

    state?: State<string>
    label?: string
    type?: "normal" | "email" | "password"
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    showErrors?: boolean
    valid?: boolean
    placeholder?: string
    style?: React.CSSProperties
    sx?: Sx
    inputSx?: Sx
    errorList?: List<string>
    onKeyPressed?: (key: string) => IO<Unit>
    rows?: number
    disable?: boolean
    showPassword?: State<boolean>
    // To prevent the remember password pop up
    disableAutocomplete?: boolean,
    labelAlwaysUp?: boolean,
    numbersOnly?: boolean,
    maxLength?: number
    fieldId?: string
    error?: boolean
    upperCaseText?: boolean
    customRegExp?: RegExp
}


export const StringEditor = (
  props: StringEditorProps &
  {
    tooltip?: {
      enabled?: true
      offsetX?: number
      offsetY?: number
      width?: string | number
    }
  }
) =>  {

  const formContext = useFormFieldContext(props.fieldId)

  return (
    <BaseStringEditor 
      {...props} 
      error={formContext.showErrors}
      errorList={formContext.errors}
    />
  )
}


export const Identity = (props: { children: JSX.Element } ) => props.children

export type TooltipProps = {

    enabled?: true
    x?: number
    y?: number
    width?: number | string

}

type WrapperProps = {
 
  sx?: Sx
  text?: string
  error: boolean
  disabled: boolean
  tooltip?: TooltipProps 
  children: JSX.Element

}

export const Wrapper = (
  props: WrapperProps
) => props.tooltip?.enabled !== none ? 
  <BrikenTooltip
    maxWidth={props.tooltip?.width}
    disabled={!props.error}
    text={props.text}
    offset={{ x: props.tooltip.x, y: props.tooltip.y }}
    children={props.children}
    sx={props.sx}
  /> : 
  <Row sx={props.sx} children={props.children} />


const BaseStringEditor = (
  props: StringEditorProps &
  {
    error: boolean,
    helperText?: string
    tooltip?: {
      enabled?: true
      x?: number
      y?: number
      width?: number | string
    }
    inputSx?: Sx
  }
) => {
    
  const isDarkTheme = useIsDarkTheme()
  const styles = useInputFormStyles(isDarkTheme)()

  const type = props.type ?? "normal"

  const palette = useUiPalette()
  
  return <Wrapper
    tooltip={props.tooltip}
    error={props.error}
    disabled={!props.error}
    text={props.error ? props.errorList?.[0] : none}
    sx={props.sx}
  >
    <TextField
      style={props.style}
      sx={{
        width: "100%",
        height: "100%"
      }}
      multiline={props.rows === undefined ? false : true}
      rows={props.rows}
      value={props.state?.value}
      onChange={event => 
        props.state !== none && props.customRegExp === none ? 
          setTo(props.state, event.target.value)() :
          props.state !== none &&
          props.customRegExp !== none && 
          props.customRegExp.test(event.target.value) ? 
            setTo(props.state, event.target.value)() : IO.noOp()
      }
      variant={"outlined"}
      placeholder={props.placeholder}
      label={props.label}
      InputLabelProps={{ 
        shrink: props.labelAlwaysUp, 
        classes: {
          // Para que el label sea del color del theme solo si se encuentra arriba
          shrink: styles.shrink,
          // Color del label cuando no esta siempre arriba
          formControl: styles.formControl,
          root: styles.root
        }
        
      }}
      inputProps={ 
        props.upperCaseText === true ? 
          {  sx: { textTransform: "uppercase" } } : 
          {}
      }
      InputProps={{
        inputComponent: props.numbersOnly ?? false ? NumberFormatCustom as never : undefined,
        startAdornment: props.prefix,
        readOnly:props.disable,
        endAdornment: props.type === "password" && props.showPassword !== none ?
          <IconButton
            aria-label={"toggle password visibility"}
            onClick={setTo(props.showPassword, !props.showPassword?.value)}
            onMouseDown={(event) => event.preventDefault()}
            size={"small"}
            edge={"end"}
            sx={{ color: palette.gray3 }}
          >
            { props.showPassword.value ? <Visibility /> : <VisibilityOff /> }
          </IconButton>
          : props.suffix,
        autoComplete: props.disableAutocomplete === true ? "off" : none,
        sx: Sx.combine(
          props.inputSx,
          { 
            color: isDarkTheme ? palette.gray3 : palette.gray1,
            
          }
        ),
        
        // Con esto se cambia el borde del TextField cuando esta seleccionado (para que no sea azul material)
        classes: {
          root: props.error === true ? styles.rootError : styles.root,
          focused: styles.focused,
          notchedOutline: styles.notchedOutline,
        }
      }}
      error={props.error}
      helperText={
        props.helperText
      }
      onKeyPress={(event) => {
        props.onKeyPressed?.(event.key)()
      }}      
      type={
        enumMatch(type)({
          normal: "text",
          email: "email",
          password: (props.showPassword?.value ?? false) ? "text" : "password" 
        })
      }
      disabled={props.disable}     
    />
  </Wrapper>
}

// Con esto se cambia el borde del TextField cuando esta seleccionado (para que no sea azul material)
export const useInputFormStyles = (isDarkTheme: boolean) => makeThemedStyles(theme => ({
  root: {
    "&$focused $notchedOutline": {
      borderColor: theme.palette.gray3,
      borderWidth: "1px",
    },
    "& > fieldset": {
      borderColor: theme.palette.gray3,
    },
    "&.MuiOutlinedInput-root:hover": {
      "& > fieldset": {
        borderColor: theme.palette.gray3,
      }
    },
    "&.MuiOutlinedInput-root.Mui-disabled":{
      color: isDarkTheme ? theme.palette.gray0 : none
    },
    "&.MuiOutlinedInput-root":{
      color: isDarkTheme ? theme.palette.gray0 : none

    },
    "&.MuiOutlinedBase-root.Mui-disabled":{
      color: isDarkTheme ? theme.palette.gray0 : none

    }
    

  },
  // Para que cuando haya error+hover no se vaya el reborde rojo
  rootError: {
    "&$focused $notchedOutline": {
      borderColor: theme.palette.gray3,
      borderWidth: "1px",
    },   
  },
  focused: {},
  notchedOutline: {},
  shrink: {
    "&.MuiInputLabel-root": {
      // Para que prevalezca sobre el form control cuando sube
      color: `${theme.palette.primary} !important`
    },
  },
  formControl: {
    "&.MuiInputLabel-root": {
      // Color para cuando el label actua de placeholder
      // TODO: Para un darktheme queda un poco fuerte este blanco
      color: isDarkTheme ? theme.palette.gray3 : theme.palette.gray2
    },
  }
}))
