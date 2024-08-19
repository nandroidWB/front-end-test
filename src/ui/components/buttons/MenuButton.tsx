import {none} from "@briken-io/functional-core"
import { setTo, State } from "@briken-io/react-state"
import {IconButton, Menu, MenuProps} from "@mui/material"
import React, { useRef } from "react"
import {useIsDarkTheme} from "src/client/hooks/theme"
import { Sx } from "src/util//style"


export const MenuButton = (
  props: Omit<MenuProps, "open"> & {
    icon: JSX.Element
    children: React.ReactNode
    enabled?: boolean
    anchor?: {x?: number, y?: number}
    state: State<boolean>
    menuSx?: Sx
  }
) => {

  const reference = useRef<HTMLButtonElement | null>(null)
  const isDarkTheme = useIsDarkTheme()

  return (
    <>
      <IconButton
        disableRipple
        onClick={setTo(props.state, true)}
        ref={reference}
        disabled={!(props.enabled ?? true)}
      >
        {props.icon}
      </IconButton>

      <Menu
        keepMounted
        anchorOrigin={{ vertical: "bottom", horizontal: props.anchor?.x ?? -320 }}
        anchorEl={reference.current}
        onClose={setTo(props.state, false)}
        MenuListProps={{ 
          disablePadding: true
        }}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: isDarkTheme ? none : "0px 30px 69px rgba(13, 92, 97, 0.21)",
            ...props.menuSx
          }
        }}
        open={props.state.value}
        {...props}
        children={props.children}
      />
    </>
  )
}
