import React from "react"
import ArrowBack from "@mui/icons-material/NavigateBeforeRounded"
import ArrowForward from "@mui/icons-material/NavigateNextRounded"
import { Unit } from "@briken-io/functional-core"
import { RoundedButton } from "../buttons/RoundedButton"
import { Separator } from "../primitives/Separator"
import { letIn } from "@briken-io/functional-core"
import {Loading} from "../primitives/Loading"
import { useTranslationDict } from "../../i18n/internationalization"
import { none } from "@briken-io/functional-core"
import { IO } from "@briken-io/functional-io"
import { Col, Row } from "../layout/Stack"
import { Theme } from "@mui/material"
import { SxProps } from "@mui/system"
import {useUiTheme} from "../../../client/hooks/theme"
import { Text } from "../primitives/Text"

export const BrikenStepControls = (
  props: {
    sx?: SxProps<Theme>
    showNext?: boolean
    showPrevious?: boolean
    showFinish?: boolean
    enableNext?: boolean
    enablePrevious?: boolean
    enableFinish?: boolean
    loading?: boolean
    finishText?: string
    onNext?: IO<Unit>
    onBack?: IO<Unit>
    onFinish?: IO<Unit>
  }
) => {

  const dict = useTranslationDict()
  const theme = useUiTheme()

  return (
    <Col sx={props.sx}>
      <Separator />
      <Row
        width={"100%"}
        justifyContent={props.showPrevious === none ? "end" : "space-between"}
        margin={{ top: "1em", bottom: "1em" }}
      >
        {(props.showPrevious ?? false) ? (
          <RoundedButton
            onClick={props.onBack}
            sx={{ width: "15%", minWidth:"max-content" }}
            enabled={props.enablePrevious}
          >
            <ArrowBack />
            <Text
              text={dict.label.prev}
              type={"button"}
            />
          </RoundedButton>
        ) : <div style={{flexGrow: 1}}></div>}
        {letIn(props.showNext ?? false, show =>
          show ? (
            <RoundedButton
              onClick={!(props.loading ?? false) ? props.onNext : IO.noOp}
              sx={{ width: "15%", minWidth:"max-content" }}
              enabled={props.enableNext}
            >
              <Row>
                {(props.loading ?? false) ? (
                  <Loading style={{ width: 20, height: 20, marginRight: 10, color: theme.palette.gray5 }} />
                ) : null}
                <Text
                  text={show ? dict.label.next : dict.label.omit}
                  type={"button"}
                />
                <ArrowForward />
              </Row>
            </RoundedButton>
          ) : null
        )}
        {props.showFinish ?? false ? (
          <RoundedButton
            onClick={props.onFinish}
            sx={{ width: "15%", minWidth:"max-content" }}
            enabled={props.enableFinish}
          >
            <Row>
              {(props.loading ?? false) ? (
                <Loading style={{ width: 20, height: 20, marginRight: 10, color: theme.palette.gray5}} />
              ) : null}
              <Text
                text={dict.label.finish}
                type={"button"}
              />              
              <ArrowForward />
            </Row>
          </RoundedButton>
        ) : null}
      </Row>
    </Col>
  )
}

export const MiniStepControls = (
  props: {
    sx?: SxProps<Theme>
    showNext?: boolean
    showPrevious?: boolean
    showFinish?: boolean
    enableNext?: boolean
    enablePrevious?: boolean
    loading?: boolean
    finishText?: string
    onNext?: IO<Unit>
    onBack?: IO<Unit>
    onFinish?: IO<Unit>
  }
) => {

  const theme = useUiTheme()

  return (
    <Row
      justifyContent={"end"}
      sx={{
        ...props.sx
      }}
    >

      {
        props.showPrevious ?? false ? 
          <Row
            onClick={props.onBack}
            sx={{ 
              width: 38, 
              height: 38, 
              borderRadius: "50%", 
              marginRight: 1,
              border: `1px solid ${theme.palette.primary}`,
              cursor: "pointer" 
            }}
            justifyContent={"center"}
          >
            <ArrowBack 
              style={{
                color: theme.palette.primary,  
                alignSelf: "center" 
              }}
            /> 
          </Row> : 
          null
      }
      
      {
        props.showNext ?? false ? 
          <Row
            onClick={!(props.loading ?? false) ? props.onNext : IO.noOp}
            sx={{ 
              width: 38, 
              height: 38, 
              borderRadius: "50%", 
              border: `1px solid ${theme.palette.primary}`,
              background: theme.palette.primary,
              cursor: "pointer"  
            }}
            justifyContent={"center"}
          >
            {(props.loading ?? false) ? 
              <Loading 
                style={{ 
                  width: 20, 
                  height: 20, 
                  color: theme.palette.gray5, 
                  alignSelf: "center" 
                }} 
              /> : 
              <ArrowForward 
                style={{
                  color: theme.palette.gray5, 
                  alignSelf: "center" 
                }}
              />}
          </Row> : 
          null
      }
    </Row>
  )
}
