import React from "react"
import {Stack} from "@mui/material"


export type StackProps = React.ComponentProps<typeof Stack>
export type StackDirection = StackProps["direction"]


export const Col = React.forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => 
    <Stack
      ref={ref}
      direction={"column"}
      {...props}
    />
)

export const Row = React.forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => 
    <Stack
      ref={ref}
      direction={"row"}
      {...props}
    />
)
