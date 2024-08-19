import { useStatefull } from "@briken-io/react-state"
import { IconButton, Snackbar, SnackbarContent } from "@mui/material"
import React from "react"
import { useIsDarkTheme, useUiPalette } from "src/client/hooks/theme"
import { Sx } from "src/util/style"
import ContentCopy from "@mui/icons-material/ContentCopy"
import { __dict, translationHook } from "src/ui/i18n/internationalization"
import { IO } from "@briken-io/functional-io"
import { copyToClipBoard } from "../viewers/BlockchainAddressViewer"
import {none} from "@briken-io/functional-core"



export const CopyIconButton = (
  props: {
    value: string
    sx?: Sx
    iconSx?: Sx
  }
) => {

  const palette = useUiPalette()
  const isDarkTheme = useIsDarkTheme()
  
  const dict = useDict()

  const showNotification = useStatefull(() => false)

  return <IconButton
    sx={
      Sx.combine(
        { 
          color: palette.gray2 
        },
        props.sx
      )
    }
    onClick={
      IO.sequence(
        IO.sideEffect(copyToClipBoard(props.value)),
        showNotification.apply(() => true)
      )
    }
  >
    <ContentCopy
      sx={props.iconSx}
    />
    <Snackbar
      onClose={showNotification.apply(() => false)}
      autoHideDuration={2500}
      open={showNotification.value}
    >
      <SnackbarContent 
        sx={{
          marginBottom:{ xs:7, md:0 },
          color:palette.gray5,
          backgroundColor:palette.gray1,
          boxShadow: isDarkTheme ? none : "0px 0px 16px rgba(0, 0, 0, 0.1)"
        }} 
      
        message={dict.copySuccess}/>

    </Snackbar>
  </IconButton>
}


const useDict = translationHook(
  __dict({
    ES: {
      copySuccess: "Copiado con éxito en el portapapeles"
    },
    EN: {
      copySuccess: "Copied successfully to the clipboard"
    }
  })
)


