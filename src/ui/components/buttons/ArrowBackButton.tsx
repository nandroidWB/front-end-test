import React from "react"
import {useBrikenContext} from "src/client/common/BrikenContext"
import {Row} from "../layout/Stack"
import ArrowBack from "@mui/icons-material/ArrowBack"
import {Sx} from "src/util/style"


export const ArrowBackButton = (
  props: {
    sx?: Sx
  }
) => {

  const context = useBrikenContext()
  const navActions = context.navigation
  const deviceSize = context.deviceSize

  const isSmall = deviceSize === "small"


  return isSmall ? 
    <Row 
      sx={
        Sx.combineN(
          {
            width: "100%",
            justifyContent: "left"
          },
          props.sx
        )
      }
    >
      <ArrowBack
        onClick={navActions.back}
        sx={{
          marginTop: 1.5,
          cursor: "pointer",
        }}
      />
    </Row>
    : null

}
