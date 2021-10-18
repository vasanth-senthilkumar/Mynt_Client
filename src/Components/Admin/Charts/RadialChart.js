import React from 'react'
import { Legend, RadialBar, RadialBarChart, Tooltip } from 'recharts'

export const RadialChart = () => {

    const data = [
        {
          "name": "18-24",
          "uv": 31.47,
          "pv": 2400,
          "fill": "#8884d8"
        },
        {
          "name": "25-29",
          "uv": 26.69,
          "pv": 4567,
          "fill": "#83a6ed"
        },
        {
          "name": "30-34",
          "uv": -15.69,
          "pv": 1398,
          "fill": "#8dd1e1"
        },
        {
          "name": "35-39",
          "uv": 8.22,
          "pv": 9800,
          "fill": "#82ca9d"
        },
        {
          "name": "40-49",
          "uv": -8.63,
          "pv": 3908,
          "fill": "#a4de6c"
        },
        {
          "name": "50+",
          "uv": -2.63,
          "pv": 4800,
          "fill": "#d0ed57"
        },
        {
          "name": "unknow",
          "uv": 6.67,
          "pv": 4800,
          "fill": "#ffc658"
        }
      ]
    return (
        <div style = {{marginTop: '123px'}}>
             <RadialBarChart 
                width={730} 
                height={343} 
                innerRadius="10%" 
                outerRadius="80%" 
                data={data} 
                startAngle={180} 
                endAngle={0}
                >
                <RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise={true} dataKey='uv' />
                <Tooltip />
                </RadialBarChart>
            
        </div>
    )
}
