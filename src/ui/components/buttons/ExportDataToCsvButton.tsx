import { Unit } from "@briken-io/functional-core"
import React from "react"
import { Txt } from "../primitives/Text"
import { IO } from "@briken-io/functional-io"
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded"
import { Row } from "../layout/Stack"
import { TextButton } from "./TextButton"
import { useUiPalette } from "src/client//hooks/theme"


export const ExportDataToCsvButton = (
  props: {
    title: string
    icon?: JSX.Element
    onClick: IO<Unit>
  }
) => {

  const palette = useUiPalette()


  return <TextButton onClick={props.onClick}>
    <Row spacing={1}>
      <Txt
        type={"body1"}
        text={props.title}
        sx={{
          color: palette.primary
        }}
      />
      {props.icon ?? <FileDownloadRoundedIcon />}
    </Row>
  </TextButton>
}
