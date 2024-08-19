import {none, Unit} from "@briken-io/functional-core"
import {setTo, State} from "@briken-io/react-state"
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material"
import React from "react"
import {translationHook, __dict} from "src/ui/i18n/internationalization"
import {BooleanT, stringCodecOf} from "../../../model/Model"
import {Sx} from "../../../util/style"
import { useUiPalette } from "src/client/hooks/theme"
import { IO } from "@briken-io/functional-io"


export const BkRadio = (
  props: {
    state?: State<boolean>
    label?: React.ReactNode
    disabled?: boolean
    sx?: Sx
  }
) => {

  const dict = useDict()


  return <FormControl sx={props.sx}>
    <FormLabel
      id={"demo-radio-buttons-group-label"}
      children={props.label}
    />

    <RadioGroup
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="controlled-radio-buttons-group"
      value={props.state?.value}
      onChange={event => props.state !== none ?
        setTo(
          props.state,
          stringCodecOf(BooleanT).decode(event.target.value)
        )()
        : none
      }
    >
      <FormControlLabel
        value={true}
        control={<Radio />}
        label={dict.yes}
      />
      <FormControlLabel
        value={false}
        control={<Radio />}
        label={dict.no}
      />
    </RadioGroup>
  </FormControl>
}

export const RadioButton = (
  props: {
    checked: boolean
    onClick?: IO<Unit>
  }
) => {

  const palette = useUiPalette()

  return(
    <Radio 
      checked={props.checked} 
      onClick={props.onClick}
      sx={{ 
        "&.Mui-checked": {
          color: palette.primary,
        },
        color:palette.gray3
      }}
    />
  )
}


const useDict = translationHook(

  __dict({

    ES: {

      yes: "Sí",
      no: "No"

    },

    EN: {

      yes: "Yes",
      no: "No"

    }

  })

)
