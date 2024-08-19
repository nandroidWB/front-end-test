import React from "react"
import { setTo, State } from "@briken-io/react-state"
import { Checkbox, Theme } from "@mui/material"
import { none } from "@briken-io/functional-core"
import { Row } from "../layout/Stack"
import { SxProps } from "@mui/system"
import { Optional } from "@briken-io/optional"
import { useUiTheme } from "src/client/hooks/theme"

export const BrikenCheckbox = (
  props: {
    state?: State<Optional<boolean>>
    children?: React.ReactNode
    style?: React.CSSProperties
    sx?: SxProps<Theme>
    className?: string
    label?: React.ReactNode
    disabled?: boolean
  }
  
) => {
  const theme = useUiTheme()

  const checkbox =
    <Checkbox
      {...props}
      checked={props.state?.value}
      onChange={event => props.state !== undefined ? setTo(props.state, event.target.checked)() : undefined}
      style={{
        color:theme.palette.primary
      }}
      disabled={props.disabled}
    />  
  
  return(
    props.label === none ?
      checkbox :
      <Row alignItems="center">
        {checkbox}
        {props.label}
      </Row>
  )
}
