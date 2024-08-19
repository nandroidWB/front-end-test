import { Theme, Modal, Paper } from "@mui/material"
import React from "react"
import { State } from "@briken-io/react-state"
import { IO } from "@briken-io/functional-io"
import { Unit } from "@briken-io/functional-core"
import { SxProps } from "@mui/system"
import { Property } from "csstype"
import { BrikenClose } from "../buttons/BrikenClose"
import { useUiPalette } from "src/client/hooks/theme"

export const Window = (
  props: {
    open: State<boolean>
    children?: React.ReactNode
    sx?: SxProps<Theme>
    disableBackdropClick?: boolean
    borderSpacing?: Property.Padding<string | number>
    onClose?: IO<Unit>
    closeButton?: boolean
    mobileContent?: boolean
  }
) => {
  
  const palette = useUiPalette()

  return(
    props.mobileContent === true && props.open.value === true ? 
      <>{props.children}</> : 
      <Modal
        disableEnforceFocus
        open={props.open.value}
        sx={{ 
          padding: props.borderSpacing ?? 2, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center"
        }}
        onClose={
          (event, reason) => {
            const disableBackdropClick = props.disableBackdropClick ?? false
            const onClose = props.onClose ?? props.open.apply(() => false)
            if (
              reason === "backdropClick" && !disableBackdropClick
            ) {
              onClose()
            } 
          } 
        }
      >
        <Paper
          sx={{
            overflowY: "auto",
            background: palette.background,
            borderRadius: 4,
            ...props.sx
          }}
          elevation={4}
        >
          {props.children}
          {
            (props.closeButton ?? false) ? 
              <BrikenClose onClick={props.open.apply(() => false)}/> : 
              null
          }
        </Paper>
      </Modal>
  )
}  
