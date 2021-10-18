import { TaobaoCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { isAuthenticated, logout } from '../auth'
import {ProfLayout } from '../Layouts/ProfileLayout' 

export const Overview = () => {
    const [image, setImage] = useState('');

    const getUser = async() => {
      await axios.get(`/api/users/get/${isAuthenticated()._id}`).then(res => {
          setImage(res.data.userPicture);
        
        })
    }

    useEffect(() => {
        getUser();
        return () => {
            
        }
    }, []);
    return (
        <ProfLayout sidebar>
            <div style = {{marginTop: '67px'}} className = 'profile-page'>
            <div className="jumbotron jumbotron-fluid bg-light p-4">
            <div className="container">
                <img src = {!image ? 'https://constant.myntassets.com/mymyntra/assets/img/default-image.png' : image} height = '130' width = '130' />
                <span className = 'float-right'><Link to = '/my/profile/edit' className = 'btn' style = {{color: '#3E4152', border: '1px solid #3E4152', borderRadius: '2px', fontSize: '12px', fontWeight: '700'}}>Edit Profile</Link></span>
            </div>
            </div>

            <div className = 'row profile-2 mt-5'>
                <div className = 'col-md-4 mr-3'>
                 <NavLink to = '/my/orders'>
                     <TaobaoCircleOutlined />  
                      <h6>Orders</h6>
                      <p>Check Your Order Status</p>
                </NavLink>
                </div>
                <div className = 'col-md-4 mr-3'>
                 <NavLink to = '/wishlist'>
                     <TaobaoCircleOutlined />  
                      <h6 className = 'pl-0 ml-0'>Collections And Wishlist</h6>
                      <p>All your curated product collections</p>
                </NavLink>
                </div>
                <div className = 'col-md-4'>
                 <NavLink to = '/my/credit'>
                     <TaobaoCircleOutlined />  
                      <h6>Myntra Credit</h6>
                      <p>Manage all your refunds & gift cards</p>
                </NavLink>
                </div>
                <div className = 'col-md-4 mr-3'>
                 <NavLink to = '/my/myncash'>
                     <TaobaoCircleOutlined />  
                      <h6>MynCash</h6>
                      <p>Earn MynCash as you shop and use them in checkout</p>
                </NavLink>
                </div>
                <div className = 'col-md-4 mr-3'>
                 <NavLink to = '/my/saved-cards'>
                     <TaobaoCircleOutlined />  
                      <h6>Saved Cards</h6>
                      <p>Save your cards for faster checkout</p>
                </NavLink>
                </div>
                <div className = 'col-md-4'>
                 <NavLink to = '/my/addresses'>
                     <TaobaoCircleOutlined />  
                      <h6>Addresses</h6>
                      <p>Save addresses for a hassle-free checkout</p>
                </NavLink>
                </div>
                <div className = 'col-md-4 mr-3'>
                 <NavLink to = '/my/coupans'>
                     <TaobaoCircleOutlined />  
                      <h6>Coupans</h6>
                      <p>Manage coupons for additional discounts</p>
                </NavLink>
                </div>
                <div className = 'col-md-4'>
                 <NavLink to = '/my/profile'>
                     <TaobaoCircleOutlined />  
                      <h6>Profile Details</h6>
                      <p>Change your profile details & password</p>
                </NavLink>
                </div>
                <div className = 'logout-btn my-4'>
                <Link className = 'text-white' to = '/login' onClick = {(e) => {logout(() => {})}}>
                    Logout
                </Link>
                </div>
               
                
               
            </div>
            
          </div>
        </ProfLayout> 
    )
}
