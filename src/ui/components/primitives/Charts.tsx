import React from "react"

import { Chart } from "react-chartjs-2"
import { List } from "@briken-io/list-utils"
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
} from "chart.js"
import { none } from "@briken-io/functional-core"
  
ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
)

const options = (graphicType: ChartType, chartTitle?: string) => ({
  indexAxis: graphicType === "bar" ? "y" as const : none,
  elements: {
    bar: {
      borderWidth: 3,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
      display: graphicType === "bar" ? false : true,
    },
    title: {
      display: true,
      text: chartTitle
    },
  }
})

// TODO: Definir mejor colores
const getColors = (quantityOfMetrics: number, alpha: number) => [
  `rgba(255, 99, 132, ${alpha})`,
  `rgba(54, 162, 235, ${alpha})`,
  `rgba(255, 206, 86, ${alpha})`,
  `rgba(75, 192, 75, ${alpha})`,
  `rgba(153, 102, 255, ${alpha})`,
  `rgba(255, 89, 40, ${alpha})`,
].slice(0, quantityOfMetrics)

const formatData = (values: List<number>, labels: List<string>) => {

  return(
    {
      labels: labels.map(it => it),
      datasets: [
        {
          label: "",
          data: values,
          borderColor: getColors(values.length, 1),
          backgroundColor: getColors(values.length, 0.2)
        },
      ]
    }
  )
}

// https://react-chartjs-2.js.org/examples

type ChartType = 
 | "line" 
 | "bar" 
 | "radar"
 | "doughnut"
 | "polarArea"
 | "bubble"
 | "pie"
 | "scatter"

export const BrikenChart = (
  props: {
    type: ChartType
    // [Xvalues, Yvalues]
    points: List<[string, number]>
    title?: string
  }
) => {
    
  return(
    <Chart
      type={props.type}
      options={options(props.type, props.title )} 
      data={formatData(props.points.map(it => it[1]), props.points.map(it => it[0]) ?? [])} 
    />
  )
}