import React from 'react';
import { Steps } from 'antd';
import { Link } from 'react-router-dom';
import {CarryOutOutlined} from '@ant-design/icons'


export const CartLayout = (props) => {
    return (
        <div>
           {
               props.breadcrumb ?  
               <div className = 'cart-layout'>
                 <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white">
                 <Link className="navbar-brand" to="/">M</Link>
                      <ul className = 'list-group list-group-horizontal list-unstyled list-inline checkout-steps' style = {{position: 'absolute' ,left: '40%' , fontSize: '12px', fontWeight: '600', letterSpacing: '3px'}}>
                        <li className = {props.current === "1" ? 'active mx-2' : 'mx-2'}>BAG</li>
                        <span className = 'checkout-border'></span>
                        <li className = {props.current === "2" ? 'active mx-2' : 'mx-2'}>ADDRESS</li>
                        <span className = 'checkout-border'></span>
                        <li className = {props.current === "3" ? 'active mx-2' : 'mx-2'}>PAYMENT</li>
                        <li style = {{paddingLeft: '300px'}}>
                        <CarryOutOutlined style = {{color: '#20BD99', paddingRight: '10px', fontSize: '24px'}}/></li>
                        <li className = 'pt-0'>100%Secure</li>
                      
                      </ul>
                    
                     
                  </nav>


              <div>
                {props.children}
              </div>

            </div>
            :
            props.children
           }
            
        </div>
    )
}
