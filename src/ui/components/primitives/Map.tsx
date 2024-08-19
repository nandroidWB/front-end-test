import React, { ComponentProps, JSXElementConstructor } from "react"
import { Col } from "../layout/Stack"
import GoogleMapReact from "google-map-react"
import { config } from "../../../configuration/BrikenConfig"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { useUiPalette } from "src/client//hooks/theme"

type MapProps = { lat: number, lng: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithMapProps<C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = 
  (props: React.ComponentProps<C> & MapProps) => JSX.Element

const LocationOnIconWithMapProps = LocationOnIcon as WithMapProps<typeof LocationOnIcon>

export const BrikenMap = (
  props: {
    lat: number,
    long: number
    // Entre 10 y 20 suele ser adecuado
    zoom?: number
    width?: number | string
    height?: number | string 
    draggable?: boolean
  }
) => {
  const palette = useUiPalette()

  return (
    // Important! Always set the container height explicitly
    <Col sx={{ height: props.height ?? "458px", width: props.width ?? "442px" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: config.services.googleApiKey }}
        defaultCenter={({ lat: props.lat, lng: props.long })}
        defaultZoom={props.zoom ?? 12}
        resetBoundsOnResize={true}
        draggable={props.draggable ?? false}
      >
        <LocationOnIconWithMapProps
          lat={props.lat}
          lng={props.long}
          sx={{ color: palette.negative, position: "absolute" }}
        />
      </GoogleMapReact>
    </Col>
  )
}
