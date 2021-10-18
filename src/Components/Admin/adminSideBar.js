import React, { useState } from 'react'
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import Sider from 'antd/lib/layout/Sider';
import { NavLink } from 'react-router-dom';
import SubMenu from 'antd/lib/menu/SubMenu';

export const AdminSideBar = () => {
      const [success, setSuccess] = useState(false);
    return (
        <div>
            <Sider
                style={{  
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0
                }}
                >
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                <Menu.Item key="11">
                    <NavLink activeClassName = 'active-side' to = '/admin'>Dashboard</NavLink>
                </Menu.Item>
                <Menu.Item key="10">
                    <NavLink activeClassName = 'active-side' to = '/admin/slider'>Homepage Slider</NavLink>
                </Menu.Item>
                <Menu.Item key="7">
                    <NavLink to = '/admin/users'>Users </NavLink>
                </Menu.Item>
                <SubMenu key="sub1" title="Categories/Sub-Categories">
                <Menu.Item key="3"><NavLink to = '/admin/all-categories'>List of Categories</NavLink></Menu.Item>
                <Menu.Item key="brand"><NavLink to = '/admin/all-brands'>List of Brands</NavLink></Menu.Item>
                <Menu.Item key="price-range"><NavLink to = '/admin/all-price-range'>Price Ranges</NavLink></Menu.Item>
                </SubMenu>
                <Menu.Item key="1">
                   <NavLink to = '/admin/get-products'>Products</NavLink>
                </Menu.Item>
                <Menu.Item key="6">
                   <NavLink to = '/admin/coupans'>Coupans</NavLink>
                </Menu.Item>
                <Menu.Item key="5">
                   <NavLink to = '/admin/orders'> Order Management</NavLink>
                </Menu.Item>
                </Menu>
                </Sider>
               
            
        </div>
    )
}
