import { NumberT, StringT } from "../../../model/Model"
import { IO } from "@briken-io/functional-io"
import { Unit } from "@briken-io/functional-core"
import { Target, Transition } from "framer-motion"
import {centerHorizontalStyle, centerStyle, centerVerticalStyle} from "../layout/Frame"
import { none } from "@briken-io/functional-core"
import { Sx } from "src/util//style"

export type ClassName = string
export type Background = string | number | undefined
export type CssValue = string | number

export type Insets = CssValue | Positioning<CssValue> 

type LineStyle = "none" | "dotted" | "dashed" | "solid" | "double" | "groove" | "ridge"  

export type Positioning<T> = {
  top?: T
  left?: T
  right?: T
  bottom?: T
}

export type BorderValue = {
  width?: string,
  style?: LineStyle,
  color?: string
}

export const isCssValue = (value: unknown): value is CssValue => 
  NumberT.check(value) || StringT.check(value)

export type AnimationProps = {
  animateLayout?: boolean
  enter?: Target
  target?: Target
  exit?: Target
  transition?: Transition
}

export type UiPrimitiveProps = {
  relativeToParent?: boolean
  centerInParent?: boolean
  centerHorizontal?: boolean
  centerVertical?: boolean
  alignLeft?: boolean
  alignRight?: boolean
  alignTop?: boolean
  alignBottom?: boolean
  height?: CssValue
  width?: CssValue
  fill?: boolean
  fillWidth?: boolean
  fillHeight?: boolean
  className?: string
  padding?: Insets
  margin?: Insets
  border?: Positioning<BorderValue | "default"> | "default" 
  positioning?: Positioning<CssValue>
  background?: string
  style?: React.CSSProperties;
  onClick?: IO<Unit>
}

const buildBorder = (border?: BorderValue | "default") : string => 
  border === none ? 
    "" : 
    border === "default" ? 
      "1px solid lightgray" :
      `${border.width} ${border.style} ${border.color}`

export const buildStyle = (
  props: UiPrimitiveProps
): React.CSSProperties => {
      
  const margins = isCssValue(props.margin) ? 
    {
      margin: props.margin
    } : 
    props.margin !== none ?
      {
        marginTop: props.margin.top,
        marginLeft: props.margin.left,
        marginRight: props.margin.right,
        marginBottom: props.margin.bottom
      } : {}
      
      
  const paddings = isCssValue(props.padding ) ? 
    {
      padding: props.padding
    } : 
    props.padding !== none ?
      {
        paddingTop: props.padding.top,
        paddingLeft: props.padding.left,
        paddingRight: props.padding.right,
        paddingBottom: props.padding.bottom
      } :  {}
      
  const borders = props.border === "default" ?
    {
      borderTop:  buildBorder("default"),
      borderLeft: buildBorder("default"),
      borderRight: buildBorder("default"),
      borderBottom: buildBorder("default")
    } : 
    props.border !== none ?
      { 
        borderTop:  buildBorder(props.border.top),
        borderLeft: buildBorder(props.border.left),
        borderRight: buildBorder(props.border.right),
        borderBottom: buildBorder(props.border.bottom)
      } : {}
        
        
      
  const alignTop = props.alignTop ?? false
  const alignBottom = props.alignBottom ?? false
  const alignLeft = props.alignLeft ?? false
  const alignRight = props.alignRight ?? false
       
  const relativeToParent = props.relativeToParent ?? false
      
  const positioning =  
            {
              top:  alignTop ? 0 : props.positioning?.top,
              left: alignLeft ? 0 : props.positioning?.left,
              right: alignRight ? 0 : props.positioning?.right,
              bottom: alignBottom ? 0 : props.positioning?.bottom
            } 
        
  const fill = props.fill ?? false
  const fillWidth = props.fillWidth ?? false
  const fillHeight = props.fillHeight ?? false
      
  return {
    ...positioning,
    position: relativeToParent || alignTop || alignBottom || alignLeft || alignRight 
      ? "absolute" : "relative",
    ...(
      (props.centerInParent ?? false) ? centerStyle :
      (props.centerHorizontal ?? false) ? centerHorizontalStyle :
      (props.centerVertical ?? false) ? centerVerticalStyle : 
      {}
    ),
    width:  fill || fillWidth  ? "100%" : props.width,
    height: fill || fillHeight ? "100%" : props.height,
    background: props.background?.toString(),
    boxSizing: "border-box",
    MozBoxSizing: "border-box",
    WebkitBoxSizing: "border-box",
    ...margins,
    ...paddings,
    ...borders,
    ...props.style
  }
}

export const buildSxStyle = (
  props: UiPrimitiveProps
): Sx => {
      
  const margins = isCssValue(props.margin) ? 
    {
      margin: props.margin
    } : 
    props.margin !== none ?
      {
        marginTop: props.margin.top,
        marginLeft: props.margin.left,
        marginRight: props.margin.right,
        marginBottom: props.margin.bottom
      } : {}
      
      
  const paddings = isCssValue(props.padding ) ? 
    {
      padding: props.padding
    } : 
    props.padding !== none ?
      {
        paddingTop: props.padding.top,
        paddingLeft: props.padding.left,
        paddingRight: props.padding.right,
        paddingBottom: props.padding.bottom
      } :  {}
      
  const borders = props.border === "default" ?
    {
      borderTop:  buildBorder("default"),
      borderLeft: buildBorder("default"),
      borderRight: buildBorder("default"),
      borderBottom: buildBorder("default")
    } : 
    props.border !== none ?
      { 
        borderTop:  buildBorder(props.border.top),
        borderLeft: buildBorder(props.border.left),
        borderRight: buildBorder(props.border.right),
        borderBottom: buildBorder(props.border.bottom)
      } : {}
        
        
      
  const alignTop = props.alignTop ?? false
  const alignBottom = props.alignBottom ?? false
  const alignLeft = props.alignLeft ?? false
  const alignRight = props.alignRight ?? false
       
  const relativeToParent = props.relativeToParent ?? false
      
  const positioning =  
            {
              top:  alignTop ? 0 : props.positioning?.top,
              left: alignLeft ? 0 : props.positioning?.left,
              right: alignRight ? 0 : props.positioning?.right,
              bottom: alignBottom ? 0 : props.positioning?.bottom
            } 
        
  const fill = props.fill ?? false
  const fillWidth = props.fillWidth ?? false
  const fillHeight = props.fillHeight ?? false
      
  return {
    ...positioning,
    position: relativeToParent || alignTop || alignBottom || alignLeft || alignRight 
      ? "absolute" : "relative",
    ...(
      (props.centerInParent ?? false) ? centerStyle :
      (props.centerHorizontal ?? false) ? centerHorizontalStyle :
      (props.centerVertical ?? false) ? centerVerticalStyle : 
      {}
    ),
    width:  fill || fillWidth  ? "100%" : props.width,
    height: fill || fillHeight ? "100%" : props.height,
    background: props.background?.toString(),
    boxSizing: "border-box",
    MozBoxSizing: "border-box",
    WebkitBoxSizing: "border-box",
    ...margins,
    ...paddings,
    ...borders,
    ...props.style
  }
}
