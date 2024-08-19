import React, { useContext } from "react"
import { IO } from "@briken-io/functional-io"
import { Optional } from "@briken-io/optional"
import { useIsDarkTheme, useUiPalette } from "src/client/hooks/theme"
import { Col, Row } from "../layout/Stack"
import { Snackbar, SnackbarContent } from "@mui/material"
import { Unit, none } from "@briken-io/functional-core"
import { useStatefull } from "@briken-io/react-state"
import { enumMatch } from "@briken-io/pattern-matching"
import { Txt } from "./Text"
import CheckRounded from "@mui/icons-material/CheckRounded"
import WarningAmber from "@mui/icons-material/WarningAmberRounded"
import { AsyncResult } from "src/ui/hooksUi/apollo"
import { useIO } from "src/client/hooks/ioState"


const BrikenSnackBarContext = React.createContext<BrikenSnackBarInterface>(
  {
    show: () => IO.noOp,
    showSuccess: () => IO.noOp,
    showError: () => IO.noOp,
    showNeutral: () => IO.noOp,
  }
)

export const BrikenSnackbarProvider = (
  props: {
    children: React.ReactNode
  }
) => {

  const palette = useUiPalette()
  const isDarkTheme = useIsDarkTheme()

  const state = useStatefull<{
    show: boolean
    data: Optional<BrikenSnackBar>
  }>(() => ({
    show: false,
    data: none
  }))

  const show = (data: BrikenSnackBar) => state.apply(() => ({ show: true, data }))

  const snackarInterface: BrikenSnackBarInterface = {
    show: show,
    showSuccess: message => show({ type: "positive", message }),
    showError: message => show({ type: "negative", message }),
    showNeutral: message => show({ type: "neutral", message }),
  }

  const type = state.value.data?.type ?? "neutral"

  const contentColor = isDarkTheme ? palette.gray1 : palette.gray5

  return <Col>
    <BrikenSnackBarContext.Provider
      value={snackarInterface}
    > 
      {props.children}
    </BrikenSnackBarContext.Provider>
    <Snackbar
      open={state.value.show}
      onClose={state.apply(it => ({ show: false, data: it.data }))}
      autoHideDuration={4000}
    >
      <SnackbarContent
        sx={{
          marginBottom:{ xs:7, md:0 },
          color: palette.gray5,
          backgroundColor: 
            enumMatch(type)({
              positive: palette.positive,
              neutral: isDarkTheme ? palette.gray4 : palette.gray2,
              negative: palette.negative
            }),
          boxShadow: isDarkTheme ? none : "0px 0px 16px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
        }} 
        message={
          <Row
            alignItems={"center"}
            spacing={1}
          >
            {
              enumMatch(type)({
                positive: <CheckRounded
                  sx={{ color: contentColor }}
                />,
                neutral: none,
                negative: <WarningAmber
                  sx={{ color: contentColor }}
                />
              })
            }
            <Txt
              color={contentColor}
              text={state.value.data?.message ?? ""}
            />
          </Row>
        }
      />
    </Snackbar>
  </Col>
}

export type BrikenSnackBar =
  {
    type: "positive" | "neutral" |"negative",
    message: string
  }

export type BrikenSnackBarInterface = {
  show: (data: BrikenSnackBar) => IO<Unit>
  showError: (message: string) => IO<Unit>
  showSuccess: (message: string) => IO<Unit>
  showNeutral: (message: string) => IO<Unit>
}

export const useBrikenSnackbar = (): BrikenSnackBarInterface => {
  return useContext(BrikenSnackBarContext)
}


export const useSnackbarAsyncError = (
  result: AsyncResult<unknown>,
  message: string
) => {
  const snackbar = useBrikenSnackbar()
  useIO(
    result.type === "failure" ?
      snackbar.showError(message) :
      IO.noOp,
    [result.type]
  )
}


export const useSnackbarAsyncSuccess = <T,>(
  result: AsyncResult<T>,
  message: (value: T) => string
) => {
  const snackbar = useBrikenSnackbar()
  useIO(
    result.type === "success" ?
      snackbar.showSuccess(message(result.data)) :
      IO.noOp,
    [result.type]
  )
}