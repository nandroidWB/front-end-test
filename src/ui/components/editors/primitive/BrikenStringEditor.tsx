import React from "react"
import {none} from "@briken-io/functional-core"
import { State } from "@briken-io/react-state"
import { SxProps } from "@mui/system"
import { TextField, TextFieldProps, Theme } from "@mui/material"
import { useFormContext } from "../../../../client/hooks/formContext"
import { useUiTheme } from "../../../../client/hooks/theme"
import { List } from "@briken-io/list-utils"

export const BrikenStringEditor = (
  props: TextFieldProps & {
    inputSx?: SxProps<Theme>
    state?: State<string>
    showErrors?: boolean
    errorList?: List<string>
  }
) => {

  const formContext = useFormContext()

  const showErrors = props.showErrors ?? formContext.showErrors ?? false

  const errorList = props.errorList ?? []

  const showTooltip = showErrors && errorList.length > 0

  const theme = useUiTheme()

  const inputPropsSx: SxProps<Theme> = props.InputProps?.sx ?? {}

  const inputSx: SxProps<Theme> = {
    background: "transparent",
    borderRadius: 1,
    padding: 1,
    height: "42px",
    color: showTooltip ? theme.palette.negative : theme.palette.gray1,
    borderColor: showTooltip ? theme.palette.negative : theme.palette.gray3,
    ...props.inputSx
  }

  const totalInputSx = {
    ...inputPropsSx,
    ...inputSx
  }

  return <TextField
    value={props.state?.value}
    onChange={event => props.state !== none ? props.state.apply(() => event.target.value)() : none}
    {...props}
    InputProps={{
      sx: totalInputSx,
      ...props.InputProps
    }}
  />
}
