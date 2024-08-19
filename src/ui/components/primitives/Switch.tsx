import React from "react"
import { Switch as MaterialSwitch, SwitchProps } from "@mui/material"
import { State } from "@briken-io/react-state"
import { Sx } from "src/util/style"
import { useIsDarkTheme, useUiPalette } from "src/client/hooks/theme"

export const Switch = (
  props: SwitchProps & {
        state: State<boolean>,
        sx?: Sx
    }
) => {
  
  const palette = useUiPalette()
  const isDarkTheme = useIsDarkTheme()

  
  return <MaterialSwitch
    sx={
      Sx.combineN(
        {
          "& .MuiSwitch-track": {
            opacity: isDarkTheme ? 1 : 0,
            backgroundColor: palette.gray3,
            borderRadius: 10,
          },
          "& .MuiSwitch-switchBase": {
            "&.Mui-checked": {
              // TODO: estaba mas oscuro con el darken 0.3
              color: palette.positive,
              "& + .MuiSwitch-track": {
                opacity: isDarkTheme ? 1 : 0,
                backgroundColor: palette.positive,
              },
            }
          },
            
        },
        props.sx
      )
    }
    checked={props.state.value}
    onChange={props.state.apply(it => !it)}
    size={"medium"}
    disabled={props.disabled}
  />
}
