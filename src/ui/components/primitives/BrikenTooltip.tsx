import React from "react"
import Tippy from "@tippyjs/react"
import { PopperPlacementType, Stack } from "@mui/material"
import "tippy.js/dist/tippy.css"
import { TextProps, Txt } from "./Text"
import {Optional} from "@briken-io/optional"
import {Sx} from "../../../util/style"
//https://tippyjs.bootcss.com/

export type BrikenTooltipProps = {
  text?: string
  children?: React.ReactNode
  placement?: PopperPlacementType
  maxWidth?: number | string
  disabled?: Optional<boolean>
  offset?: { x?: number, y?: number } 
  hide?: boolean
  sx?: Sx
  textProps?: TextProps 
  trigger?: "mouseenter focus" | "mouseenter" | "focus" | "focusin" | "click" | "manual"
}


export const BrikenTooltip = (
  props: BrikenTooltipProps
) =>  
  <Tippy
    maxWidth={props.maxWidth ?? "max-content"}
    content={<Txt text={props.text} {...props.textProps}/>}
    // [skidding, distance]
    offset={[ props.offset?.x ?? 0, props.offset?.y ?? 0 ]}
    trigger={props.trigger ?? "mouseenter"}
    hideOnClick={props.hide}
    placement={props.placement}
    zIndex={2147483647}
    children={
      <Stack 
        justifyContent="center"
        alignItems="center" 
        sx={props.sx}
      >
        {props.children}
      </Stack>
    }
    disabled={props.disabled}
  />  