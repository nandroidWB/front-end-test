import React from "react"
import { CircularProgress, SxProps } from "@mui/material"
import { Row } from "../layout/Stack"

export const Loading = CircularProgress

export const BrikenLoading = (
  props: {
    sx?: SxProps
    loadingSize?: string | number
  }
) => <Row
    sx={props.sx}
    >
    <Loading 
      size={props.loadingSize}
    />
  </Row>
