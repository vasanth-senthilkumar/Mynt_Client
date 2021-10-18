import React from 'react'
import { Navbar } from '../Navbar'
import { AdminSideBar } from '../Admin/adminSideBar'
import { Link } from 'react-router-dom'
import { CarryOutOutlined } from '@ant-design/icons';

export const Layout = (props) => {
    return (
        <div>
           {
               props.sidebar ? 
               <div className = 'row'>
                <div className = 'admin-layout'>
                <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white">
                 <Link className="navbar-brand" to="/">M</Link>
                      <ul className = 'list-group list-group-horizontal list-unstyled list-inline' style = {{position: 'absolute' ,left: '40%' , fontSize: '12px', fontWeight: '600', letterSpacing: '3px'}}>
                        <li className = 'admin-tag'>ADMIN PANEL</li>
                        <li style = {{paddingLeft: '300px', paddingTop: '20px'}}>
                        <CarryOutOutlined style = {{color: '#20BD99', paddingRight: '10px', fontSize: '24px'}}/></li>
                        <li className = 'pt-4'>100%Secure</li>
                      
                      </ul>
                    
                     
                  </nav>
                </div>
              <div className = 'col-md-3'>
                <AdminSideBar/>
              </div>
              <div className = 'col-md-9 bg-light pr-5 mt-4'>
                {props.children}
              </div>

            </div>
            :
            props.children
           }
            
        </div>
    )
}
