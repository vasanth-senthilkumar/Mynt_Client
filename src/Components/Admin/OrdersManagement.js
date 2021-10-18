import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import { Layout } from '../Layouts/Layout';
import { Button, message, Popconfirm, Select } from 'antd';
import { Link } from 'react-router-dom';
import { DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';

const { Option } = Select;

export const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
     const [user, setUser] = useState({});
     const [data, setData] = useState("null");
     const [isModalVisible, setIsModalVisible] = useState(false);
     const [orderStatus, setOrderStatus] = useState('');
     const [success, setSuccess] = useState(false);

    const getAllOrders = async() => {
        setLoading(true);
        await axios.get('/api/users/get-all-orders', {headers : {
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


     function handleChange(value) {
          setOrderStatus(value);
      }


      const orderStatusHandler = async(orderId) => {
          await axios.post("/api/users/set/order-status", {status: orderStatus, orderId: orderId, updateTime: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")}).then(res => {
            if(res.status === 200) {
                swal('Congrats!', res.data.successMessage, 'success');
                }  else {
                    swal('Sorry!', 'Failed to set Order Status.', 'error');
                }
          })
      }



/************************************************** Modal ***********************************************/   
    const showModal = () => {
        setIsModalVisible(true);
      };
    
      const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };


  
 /************************************************** Delete Orders ***********************************************/        
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
        <Layout sidebar>
            <div className = 'orders .admin-orders'>
             
                {
                    orders.map((order,index) => {
                        return(
                            <table class="table border-0 mt-5">
                             
                            <tbody>
                          <tr className = 'bg-secondary text-white'>
                              <th>
                              Order #{index+1} 

                            </th>
                            <th>
                           Order Id : {order._id}
                            </th>
                            <th>
                                  Total Price : Rs.{order.totalPrice}
                              </th>
                            <th>
                            <Link className = 'text-white' onClick = {() => {showModal(); setUser(order.user); setData(order.data)}}>Customer</Link>
                            </th>
                            <th>
                             <span>Status : </span> 
                            <Select defaultValue= {order.status} style={{ width: 143, WebkitOverflowScrolling: 'hidden'}} onChange={handleChange}>
                            <Option value="1">Placed</Option>
                            <Option value="2">Confirmed</Option>
                            <Option value="3">Prepared</Option>
                            <Option value="4">Delivered</Option>
                            <Option value="5">Complete</Option>
                            </Select>
                             <Button onClick = {() =>  orderStatusHandler(order._id)}>Set</Button>
                            </th>
                            <th>
                              <Popconfirm
                                    title="Are you sure?"
                                    onConfirm={() => deleteHandler(order._id)}
                                    onCancel={cancel}
                                    placement = 'topLeft'
                                    okText="Yes"
                                    cancelText="No"
                                      >
                                        <span className = 'text-white'><DeleteOutlined/></span>
                                </Popconfirm>
                             
                            </th>
                          </tr>  
                          <div className = 'text-center mb-4' style = {{width: '100%', position: 'relative'}}>
                            <th style = {{position: 'absolute', left: '200%', top: '0px', width: '400px'}}>
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
                            {prod.name}
                           
                            </th>
                            <th>Qty:{prod.qty}</th>
                            <th>Rs.{prod.price}</th>
                            
                            </tr>
                            )
                             })
                            }
                          </tbody>

                           </table>


                        )
                    })
                }
              
                </div>
                <Modal footer = {false} width = {800} title="User Info" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                            <div className="row">
                                <div className="col-md-12 my-4">
                                <h6>Picture:</h6>
                                    <img src = {user.image} alt = 'image' width = '200'/>
                                </div>
                                <div className="col-md-6 my-4">
                                <h6>Full Name:</h6>
                                    <b>{user.fname} {user.lname}</b>
                                </div>
                                <div className="col-md-6 my-4">
                                <h6>Email:</h6>
                                    <b>{user.email}</b>
                                </div>
                                <div className="col-md-6 my-4">
                                <h6>Phone:</h6>
                                     <b>{user.phone} </b>
                                </div>
                                <div className="col-md-6 my-4">
                                <h6>Email:</h6>
                                     <b>{user.email} </b>
                                </div>
                                <div className="col-md-6 my-4">
                                <h6>Address For Delivery:</h6>
                                     <b>{ user.address && user.address.address}, {user.address && user.address.pinCode} {user.address && user.address.work ? <span>(Work)</span> : <span>(Home)</span>} </b>
                                </div>
                            </div>
                            {
                            data &&
                            <div className="row">
                                <h2>Payment Information:</h2>
                                <div className="col-md-6 my-4">
                                <h6>Paid:</h6>
                                    <b>{data.paid ? <span>True</span> : <span>false</span>}</b>
                                </div>
                                <div className="col-md-6 my-4">
                                <h6>Cancelled:</h6>
                                    <b>{data.cancelled ? <span>True</span> : <span>false</span>}</b>
                                </div>
                                <div className="col-md-6 my-4">
                                <h6>PayerID:</h6>
                                    <b>{data.payerID}</b>
                                </div>
                                <div className="col-md-6 my-4">
                                <h6>Payment ID:</h6>
                                     <b>{data.paymentID} </b>
                                </div>
                               <div className="col-md-6 my-4">
                                <h6>Payment Token:</h6>
                                     <b>{data.paymentToken} </b>
                                </div>
                                <div className="col-md-6 my-4">
                                <h6>Email:</h6>
                                     <b>{data.email}</b>
                                </div>
                            </div>
                            // :
                            // <div>Hii</div>
                       }
                 </Modal>          
        </Layout>
    )
}
