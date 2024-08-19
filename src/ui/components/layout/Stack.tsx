import React from "react"
import Stack from "@mui/material/Stack"
import { Optional } from "@briken-io/optional"

export type StackProps = React.ComponentProps<typeof Stack>
export type StackDirection = StackProps["direction"]


export const Col = React.forwardRef<Optional<HTMLDivElement>, StackProps>(
  (props, ref) => 
    <Stack
      ref={ref}
      direction={"column"}
      {...props}
    />
)

export const Row = React.forwardRef<Optional<HTMLDivElement>, StackProps>(
  (props, ref) => 
    <Stack
      ref={ref}
      direction={"row"}
      {...props}
    />
)
