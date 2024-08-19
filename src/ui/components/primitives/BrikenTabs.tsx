import {none} from "@briken-io/functional-core"
import { IO } from "@briken-io/functional-io"
import { List } from "@briken-io/list-utils"
import { Optional } from "@briken-io/optional"
import { setter, State, useStatefull } from "@briken-io/react-state"
import { SxProps, Tab, Theme } from "@mui/material"
import React from "react"
import { Sx } from "src/util//style"
import { useIsDarkTheme, useUiTheme } from "../../../client/hooks/theme"
import {KycStepControls, StepControls} from "../pages/KYCForm/steps/KycStepControls"
import { Col, Row } from "../layout/Stack"
import {Layout} from "../viewers/generic/EnumViewer"
import { Text } from "./Text"


export type Tab = {
  label: string, 
  body?: JSX.Element, 
  style?: React.CSSProperties,
  disabled?: boolean
}

export const BrikenTabs = (
  props: {
    tabs: List<Tab>
    currentState?: State<number>
    stepControls?: StepControls,
    Layout?: Layout
    showIndicator?: boolean
    headerStyle?: React.CSSProperties
    selectedTabStyle?: React.CSSProperties
    unselectedTabStyle?: React.CSSProperties
    bodySx?: Sx
    topRightContent?: React.ReactNode
    sx?: SxProps<Theme>
  }
) => {

  const _currentTab = useStatefull<number>(() => 0)
  const currentTab = props.currentState ?? _currentTab

  const theme = useUiTheme()

  const Layout = props.Layout ?? Col

  const isDarkTheme = useIsDarkTheme()


  return <Layout
    sx={{
      padding: 2,
      borderRadius: 3,
      ...props.sx
    }}
  >
    <Row
      sx={{
        justifyContent: "space-between",
        alignContent: "center"
      }}
    >
      <Row>
        {
          props.tabs.map((tab, index) => (
            <Row
              key={tab.label}
              children={
                <Text
                  type={"subtitle1"}
                  fontWeight={currentTab.value === index ? "bold" : none}
                  text={tab.label}
                  color={(tab.disabled ?? false) ? isDarkTheme ? theme.palette.gray4 : theme.palette.gray2 : theme.palette.gray1}
                />
              }
              onClick={(tab.disabled ?? false) ?
                IO.noOp : Optional.map(currentTab, it => setter(it)(index))
              }                
              sx={
                currentTab.value === index ? 
                  tab.style ?? props.selectedTabStyle ?? {
                    color: theme.palette.gray1,
                    padding: 2,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    fontWeight: 500,
                    // Parametrizar los grises que se usan en figma
                    border: "1px solid #E7E7E7",
                    background: theme.palette.background,
                    borderBottom: "none",
                    position: "relative",
                    textTransform: "none",
                    zIndex: 1,
                    cursor: "pointer"
                  }
                  : props.unselectedTabStyle ?? 
                    {
                      padding: 2, 
                      fontWeight: 400,
                      
                      textTransform: "none",
                      color: `${(tab.disabled ?? false) ? theme.palette.gray2 : theme.palette.gray1}`,
                      borderTopLeftRadius: 10,                     
                      borderTopRightRadius: 10,
                      "&:hover": {
                        backgroundColor: `${(tab.disabled ?? false) ? none : theme.palette.gray3}`
                      },
                      cursor: `${(tab.disabled ?? false) ? none : "pointer"}`
                    } 
              }
            />
          ))
        }
      </Row>

      {props.topRightContent}

    </Row>

    <Col
      spacing={2}
      sx={{
        width: "940px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.palette.gray3,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: currentTab.value === 0 ? 0 : 20,
        borderTopRightRadius: 20,
        position: "relative",
        overflow: "hidden",
        top: "-1px",
        zIndex: 0,
        ...props.bodySx
      }}
    >
      {props.tabs?.[currentTab.value]?.body}

      { props.stepControls === none ?
        null :
        <KycStepControls
          controls={props.stepControls}
        />
      }
    </Col>
  </Layout>
}


