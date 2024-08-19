import React from "react"
import { TextButton } from "./TextButton"
import { Optional } from "@briken-io/optional"
import { openLink } from "../../../util/utils"
import { useUiTheme } from "../../../client/hooks/theme"
import { Col, Row } from "../layout/Stack"
import { Text } from "../primitives/Text"
import {limitNameLengthForProjectDocument} from "src/client/blockchain/utils"
import DescriptionIcon from "@mui/icons-material/DescriptionRounded"


export const FilePreviewButton = (
  props: {
        url: string
        fileName: string
        date?: string
    }
) => {

  const theme = useUiTheme()

  return(
    <TextButton
      onClick={Optional.map(props.url, openLink)}
      sx={{ 
        width: {xs:"343px",md:"244px"},
        height:"66px", 
        margin: 1, 
        border: "1px solid #E7E7E7",
        borderRadius: 2, 
        background: theme.palette.gray5,
        color: theme.palette.gray1,
        "&:hover": {
          background: theme.palette.gray3
        } 
      }}
      children={
        <Row
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
          padding={1}
          spacing={2}
        >
          <DescriptionIcon
            style={{
              justifySelf: "start"
            }}
          />
          <Col
            alignContent="center"
          >
            <Text
              // Print name without file extension 
              text={limitNameLengthForProjectDocument(props.fileName.split(".")[0])}
              type={"subtitle2"}
              sx={{
                wordWrap: "break-word",
                textAlign: "start"
              }}
            />
          </Col>
          
        </Row>
      }
    />
  )
}
