import { DeleteFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { message, Popconfirm, Tooltip } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { isAuthenticated } from '../auth';
import { ProfLayout } from '../Layouts/ProfileLayout'

export const Orders = () => {
    const user = isAuthenticated();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const getAllOrders = async() => {
        setLoading(true);
        await axios.get(`/api/users/get/orders/${user._id}`, {headers : {
            'authorization' : 'Bearer ' + localStorage.getItem('token')
          }}).then(res => {
            if(res.status === 200) {  
            setOrders(res.data);
            setLoading(false);
            }
            else {
                swal('Sorry', 'No orders', 'error');
            }
        })
    }

     useEffect(() => {
        getAllOrders();
         return () => {
             
         }
     }, [success]);


     const deleteHandler = async(orderId) => {
          await axios.delete(`/api/users/order/delete/${orderId}`).then(res => {
            if(res.status === 200) {
                setSuccess(true);
                message.success({
                    content : res.data.successMessage,
                    style: {
                        marginTop: '15vh',
                      },
                });
                setSuccess(false);
            }
            else {
            
                message.error({
                    content : res.data.errorMessage,
                    style: {
                        marginTop: '15vh',
                      },
                });
            } 
          })
     }


        function cancel(e) {
            message.error({
                content : 'Request Cancelled!',
                style: {
                    marginTop: '15vh',
                },
            });
        }


    return (
        <ProfLayout sidebar>
            <div className = 'orders'>
                 {
                     !orders && 
                     <div>No Orders!</div>
                 }
             <table class="table border-0">
                {
                    orders.map((order,index) => {
                        return(
                            <> 
                          <tbody className = 'mb-5'> 
                            <tr className = 'bg-secondary text-white'>
                                <th>
                             Order #{index+1}   
                              </th>
                              <th>
                                  Order Id : {order._id}
                              </th>
                              <th>
                                  Total Price : {order.totalPrice}
                              </th>
                              <th>
                            <Link className = 'text-white' to = {'/my/orders/track/' + order._id}>Track Order</Link>
                            </th>
                              <th>
                              <Popconfirm
                                    title="Are you sure to delete this order?"
                                    onConfirm={() => deleteHandler(order._id)}
                                    onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                      >
                                        <span className = 'text-white'><DeleteOutlined/></span>
                                </Popconfirm>
                             
                            </th>
                            </tr> 
                            <div className = 'text-center mb-4' style = {{width: '100%', position: 'relative'}}>
                            <th style = {{position: 'absolute', left: '100%', top: '0px', width: '400px'}}>
                               <span>Placed At: {order.placed}</span> 
                            </th>
                            </div>
                               { 
                            order.product.map(prod => {
                             return(
                            <tr key = {prod._id}>
                            <th>
                                <img src = {prod.image} height = '71' width = '64' alt = 'image'/>
                            </th>
                            <th>
                                {order._id}
                            </th>
                            <th scope="row">
                            <a>
                            {prod.name}
                            </a>
                           
                            </th>
                            <th scope="row">
                            <a>
                            Qty:{prod.qty}
                            </a>
                           
                            </th>
                            <td>Rs.{prod.price}</td>
                            </tr>
                            )
                             })
                        }
                    </tbody>
                        </>

                        )
                    })
                }
              
                </table>
                </div>
        </ProfLayout>
    )
}
