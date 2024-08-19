import React from "react"
import { none } from "@briken-io/functional-core"
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import ExpandMore from "@mui/icons-material/ExpandMoreRounded"
import { Sx } from "src/util/style"


export const BrikenAccordion = (
  props: {
    sx?: Sx;
    children?: React.ReactNode
    summary?: React.ReactNode
    elevation?: number
    withExpandableIcon?: boolean
    disableGutters?: boolean
	defaultExpanded?: boolean
  }
) => <Accordion
  elevation={props.elevation ?? 0}
  disableGutters={props.disableGutters ?? false}
  defaultExpanded={props.defaultExpanded}
  sx={props.sx}
>
  <AccordionSummary expandIcon={props.withExpandableIcon !== none ? <ExpandMore /> : none}>
    {props.summary}
  </AccordionSummary>
  <AccordionDetails>
    {props.children}
  </AccordionDetails>
</Accordion>

