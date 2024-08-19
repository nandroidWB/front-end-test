import React from "react"
import { CircularProgress } from "@mui/material"
import { Sx } from "src/util//style"
import { Row } from "../layout/Stack"
import { useUiPalette } from "src/client//hooks/theme"

export const Loading = CircularProgress

export const BrikenLoading = (
  props: {
    sx?: Sx
    loadingSize?: string | number
  }
) => {

  const palette = useUiPalette()

  return <Row
    sx={Sx.combineN(
      props.sx,
      {
        justifyContent:"center",
        alignItems: "center"
      }
    )}
  >
    <Loading 
      sx={{ 
        color: palette.secondary
      }}
      size={props.loadingSize}
    />
  </Row>
}
