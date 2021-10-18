import React, { useEffect, useState } from 'react';
import { ProfLayout } from '../Layouts/ProfileLayout';
import { Steps } from 'antd';
import axios from 'axios';
import { CheckCircleOutlined, CheckOutlined, CheckSquareOutlined, HddOutlined, LoadingOutlined, NodeIndexOutlined, PlusSquareOutlined, RocketFilled, RocketOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';

const { Step } = Steps;


export const TrackOrders = (props) => {
    const orderId = props.match.params.id;
    const [orderStatus, setOrderStatus] = useState(null);
    const [order, setOrder] = useState({});


     const getOrderStatus = async() => {
         await axios.get(`/api/users/get/order/${orderId}`).then(res => {
             console.log(res);
             setOrderStatus(res.data.order.status);
             setOrder(res.data.order);
         })

     }
     useEffect(() => {
      getOrderStatus(); 
         
         return () => {
             
         }
     }, [orderId]);


    return (
        <ProfLayout sidebar>
        <div className = 'tracking mx-5'>
        <div style = {{position: 'absolute', right: '100px', top: '300px'}}>
               <h6>
                   Placed At: {order.placed}
               </h6>
                <h6>
                   Last Updated : {order.statusUpdateTime}
                </h6>
            </div>
             <h5 className = 'mb-4 mt-4'>Track Delivery Status</h5>
             <Steps direction="vertical" current = {orderStatus} size = 'large'>
                <Step title="Order Placed" className = 'pb-4' icon = {<PlusSquareOutlined />}/>
                <Step title="Order Confirmed" className = 'pb-4' icon = {<CheckCircleOutlined />}/>
                <Step title="Preparation" className = 'pb-4' icon = {<HddOutlined />}/>
                <Step title="Out For Delivery" className = 'pb-4' icon = {<RocketOutlined/>}/>
                <Step title="Complete" className = 'pb-4' icon = {<SmileOutlined />}/>
            </Steps>
          
            
        </div>
        </ProfLayout>
    )
}
