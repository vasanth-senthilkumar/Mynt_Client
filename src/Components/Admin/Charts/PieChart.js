import React from 'react';
import { PieChart, Pie, Tooltip} from 'recharts';

export const Charts = () => {
    
    const data = [
        {
            "name": "Group A",
            "value": 2400
          },
          {
            "name": "Group B",
            "value": 4567
          },
          {
            "name": "Group C",
            "value": 1398
          },
          {
            "name": "Group D",
            "value": 9800
          },
          {
            "name": "Group E",
            "value": 3908
          },
          {
            "name": "Group F",
            "value": 480
          }
    ];

  

    return (
        <div>
              <PieChart width={730} height={250}>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#ee5f73"/>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" label labelLine/>
                 <Tooltip/>
                </PieChart>             
            
        </div>
    )
}
