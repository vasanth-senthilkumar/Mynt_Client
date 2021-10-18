import React from 'react'
import 'antd/dist/antd.css';
import { Layout } from '../Layouts/Layout';
import { BranchesOutlined, DashboardOutlined, DollarOutlined, GroupOutlined, SlidersOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import {Charts} from './Charts/PieChart';
import { BarChart, BarChartComp } from './Charts/BarChart';
import { RadialChart } from './Charts/RadialChart';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

 
export const AdminPanel = (props) => {
  return (
    <div>
            <Helmet>
             <title>Admin Panel</title>
           </Helmet>
          <Layout sidebar>

              <div className = 'admin-panel-dash'>
               <div className = 'row'>
                  <div className = 'col-md-4 middle No-2'>
                     <div className = 'row' style = {{marginLeft: '50px'}}>
                       <div className = 'col-md-12 pl-5 ml-3'>
                       <SlidersOutlined />
                       </div>
                     <div className = 'col-md-12'> 
                     <Link to = '/admin/slider'>Homepage</Link>
                     </div> 
                     </div>
                  </div>
                  <div className = 'col-md-4 middle No-2'>
                     <div className = 'row' style = {{marginLeft: '60px'}}>
                       <div className = 'col-md-12' style = {{paddingLeft: '36px'}}>
                       <UsergroupAddOutlined />
                       </div>
                     <div className = 'col-md-12 pl-3'> 
                     <Link to = '/admin/users'>Users</Link>
                     </div> 
                     </div>
                  </div>
                  <div className = 'col-md-4 middle No-2'>
                     <div className = 'row' style = {{marginLeft: '60px'}}>
                       <div className = 'col-md-12 pl-5'>
                       <DashboardOutlined />
                       </div>
                     <div className = 'col-md-12'> 
                     <Link to = '/admin/get-products'>Products</Link>
                     </div> 
                     </div>
                  </div>
                  <div className = 'col-md-4 middle No-2'>
                     <div className = 'row' style = {{marginLeft: '47px'}}>
                       <div className = 'col-md-12 pl-5 ml-3'>
                       <BranchesOutlined />
                       </div>
                     <div className = 'col-md-12'> 
                     <Link to = '/admin/all-categories'>Categories</Link>
                     </div> 
                     </div>
                  </div>
                  <div className = 'col-md-4 middle No-2'>
                     <div className = 'row' style = {{marginLeft: '71px'}}>
                       <div className = 'col-md-12 pl-5'>
                       <GroupOutlined />
                       </div>
                     <div className = 'col-md-12 ml-2'> 
                     <Link to = '/admin/all-brands'>Brands</Link>
                     </div> 
                     </div>
                  </div>
                  <div className = 'col-md-4 middle No-2'>
                     <div className = 'row' style = {{marginLeft: '60px'}}> 
                       <div className = 'col-md-12 pl-5'>
                       <DollarOutlined />
                       </div>
                     <div className = 'col-md-12'> 
                     <Link to = '/admin/coupans'>Coupans</Link>
                     </div> 
                     </div>
                  </div>
                  <div className = 'col-md-5 piechart mr-5'>
                  <Charts/>
                  </div>
                  <div className = 'col-md-5 radialchart'>
                  <RadialChart/>
                  </div>
                  <div className = 'col-md-12'>
                  <BarChartComp/>
                  </div>
               </div>
              </div>
                 
            
          </Layout>
      
    </div>
  )
}


 

