import React from "react"
import { IconButton, SxProps, TextField } from "@mui/material"
import {List, Unit, none} from "../../../libs/functional-core"
import {IO, IOFn} from "../../../libs/functional-io"
import {enumMatch} from "../../../libs/pattern-matching/src"
import {State, setTo} from "../../../libs/react-state"
import {Row} from "../layout/Stack"
import {BrikenTooltip} from "../primitives/BrikenTooltip"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


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
    sx?: SxProps
    inputSx?: SxProps
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
) =>  <BaseStringEditor 
      {...props} 
    />


export const Identity = (props: { children: JSX.Element } ) => props.children

export type TooltipProps = {

    enabled?: true
    x?: number
    y?: number
    width?: number | string

}

type WrapperProps = {
 
  sx?: SxProps
  text?: string
  error?: boolean
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
    error?: boolean,
    helperText?: string
    tooltip?: {
      enabled?: true
      x?: number
      y?: number
      width?: number | string
    }
    inputSx?: SxProps
  }
) => {
    

  const type = props.type ?? "normal"

  
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
            setTo(props.state, event.target.value)() : IOFn.noOp()
      }
      variant={"outlined"}
      placeholder={props.placeholder}
      label={props.label}
      InputLabelProps={{ 
        shrink: props.labelAlwaysUp 
      }}
      inputProps={ 
        props.upperCaseText === true ? 
          {  sx: { textTransform: "uppercase" } } : 
          {}
      }
      InputProps={{
        startAdornment: props.prefix,
        readOnly:props.disable,
        endAdornment: props.type === "password" && props.showPassword !== none ?
          <IconButton
            aria-label={"toggle password visibility"}
            onClick={setTo(props.showPassword, !props.showPassword?.value)}
            onMouseDown={(event) => event.preventDefault()}
            size={"small"}
            edge={"end"}
          >
            { props.showPassword.value ? <VisibilityIcon /> : <VisibilityOffIcon /> }
          </IconButton>
          : props.suffix,
        autoComplete: props.disableAutocomplete === true ? "off" : none,
        sx: props.inputSx,
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
