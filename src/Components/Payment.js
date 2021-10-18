import React, { useEffect, useState } from 'react'
import { CartLayout } from './Layouts/CartLayout'
import { BorderVerticleOutlined, DownOutlined, UpOutlined, DollarOutlined, WalletOutlined, TransactionOutlined, QrcodeOutlined, PoundOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Spin, Tabs } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { Helmet } from 'react-helmet';
import { Paypal } from './Payments/Paypal';
import axios from 'axios';
import swal from 'sweetalert';
import { isAuthenticated } from './auth';
import moment from 'moment';
const { TabPane } = Tabs;

export const Payment = () => {
    const [success, setSuccess] = useState(false);
     const user = isAuthenticated();
     const addressData = JSON.parse(localStorage.getItem('addressInfo'));
     const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(false);
     const [totalPrice, setTotalPrice] = useState('');
     const [isConvenientModalVisible, setIsConvenientModalVisible] = useState(false);

     const getCartProducts = async () => {
         await axios.get(`/api/cart/get/${user._id}`).then(res => {
          setProducts(res.data.products);
          setTotalPrice(res.data.products.reduce(( a,b ) => a + b.qty*b.priceAfterOff.toString(), 0));
        })
    
        
      }
   
   
     useEffect(() => {
        getCartProducts();
         return () => {
             
         }
     }, []);
     
     const showConvenientModal = () => {
        setIsConvenientModalVisible(true);
      };
    
      const handleConvenientCancel = () => {
        setIsConvenientModalVisible(false);
      };

    const address = JSON.parse(localStorage.getItem('addressInfo'));

      const cashOnDeliveryHandler = async() => {
          setLoading(true);
          await axios.post('/api/users/payment/cash-on-delivery', {placed: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"), totalPrice: totalPrice, image: user.userPicture, phone: user.phone, fname : user.firstName, lname: user.lastName, email: user.email , cartProducts:  products, address: address}
          , {headers : {
            'authorization' : 'Bearer ' + localStorage.getItem('token')
          }
          }
          )
          .then(res => {
              console.log(res);
              if(res.status === 200) {
                setLoading(false);
                  swal('Congrats!', res.data.successMessage, 'success');
              } else {
                swal('Sorry!', res.data.errorMessage, 'error');
              }
          })
          
      }
      const transactionSuccess = async(data) => {
          await axios.post('/api/users/payment/successBuy', {placed: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"), totalPrice: totalPrice, image: user.userPicture, phone: user.phone, fname : user.firstName, lname: user.lastName, email: user.email , cartProducts:  products, address: address, paymentData: data}
          , {headers : {
            'authorization' : 'Bearer ' + localStorage.getItem('token')
          }
          }
          )
          .then(res => {
              console.log(res);
              if(res.status === 200) {
                  swal('Congrats!', res.data.successMessage, 'success');
              } else {
                swal('Sorry!', res.data.errorMessage, 'error');
              }
          })
          
      }
      const transactionError = () => {

      }
      const transactionCanceled = () => {

      }



    const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;   
    return (
        <div>
            <CartLayout breadcrumb current = '3'>
            <Helmet>
             <title>Myntra | Payment</title>
           </Helmet>
               <div className = 'row payment' style = {{ marginLeft: '100px'}}>
                   <div className = 'col-md-8 pr-4'>
                    <div className="jumbotron jumbotron-fluid mt-4 border p-4" style = {{width: '100%'}}>
                    <span className = 'float-left pr-3'><BorderVerticleOutlined style = {{fontSize: '19px'}}/></span> <span><h6 className = 'pt-1'>Bank Offer</h6></span>
                    <ul>
                    <li>5% Unlimited Cashback on Flipkart Axis Bank Credit Card. TCA</li>
                    {
                        !success &&  <Link style = {{fontSize: '14px', fontWeight: '600', color: '#ff3e6c'}} onClick = {() => setSuccess(true)}>Show More <DownOutlined style = {{fontSize: '10px'}}/></Link>
                      }

                      {
                            success &&
                            <>
                            <li>10% Cashback upto Rs 500 on AU Bank Debit Cards. Min spend Rs 1,500.  TCA</li>
                            <li>10% Cashback upto Rs 250 on a minimum spend of Rs 1,000 with PayZapp. TCA</li>
                            <li>Upto Rs 500 Cashback on Mobikwik wallet transaction of min Rs 999.Use Code MBK500 on Mobikwik.TCA</li>
                            <Link style = {{fontSize: '14px', fontWeight: '600', color: '#ff3e6c'}} onClick = {() => setSuccess(false)}>Show Less <UpOutlined style = {{fontSize: '10px'}}/></Link> 
                            </>

                      }
                       </ul>
                    </div> 
                 <div style = {{width: '100%'}}>
                 <p className = 'mt-5 ml-3' style = {{fontSize: '16px', fontWeight: '600', color: '#424553'}}>Choose Payment Mode</p> 
                 <div className = 'jumbotron jumbotron-fluid mt-4 border payment'>
                 <Tabs tabPosition= 'left'>
                    <TabPane tab={<span><WalletOutlined />CASH ON DELIVERY</span> } key="1">
                    <div className = 'mt-5 pt-5 text-center'>
                    {  
                       loading 
                            ?
                            <div>
                            <Spin indicator={antIcon} />
                            </div>

                            :
                              <>
                            <h4 className = ''>Get Product & Then Pay</h4>     
                            <Link onClick = {cashOnDeliveryHandler} className = 'btn my-2 p-2' style = {{width: '345px', background: '#ff3f6c', color: 'white', borderRadius: '23px', height: '45px'}}>Place Order</Link>
                             </>
                       }
                   
                     </div>
                    </TabPane>
                    <TabPane tab= {<span><DollarOutlined />CREDIT/DEBIT CARD</span>} key="2">
                        <div className = 'mt-5 text-center'>
                            <h4 className = 'pt-5 mb-4'>Pay with Paypal</h4>
                            <Paypal  
                                toPay = {localStorage.getItem('totalPrice')}
                                onSuccess = {transactionSuccess}
                                transactionError = {transactionError}
                                transactionCanceled = {transactionCanceled}
                                />
                           </div>     
                    </TabPane>
                    <TabPane tab={<span><TransactionOutlined />PHONEPE/GOOGLE PAY/BHIM</span>} key="3">
                    PHONEPE/GOOGLE PAY/BHIM
                    </TabPane>
                    <TabPane tab={<span><PoundOutlined /> PAYTM/PAYZAPP/WALLETS</span>} key="4">
                    PAYTM/PAYZAPP/WALLETS
                    </TabPane>
                    <TabPane tab={<span><QrcodeOutlined />NET BANKING</span>} key="5">
                    NET BANKING
                    </TabPane>
                </Tabs>
                </div>  
                </div>

                <div className = 'my-3 border'>
                <div className = 'mx-2' style = {{height: '36px', background: 'white', marginBottom: '1000px !important'}}>
              <div className = 'mt-3 pb-5 ml-5'>
                <a  className = '' style = {{border: 'none', background: 'white', height: '60px', fontWeight: 'bolder'}}> <i className="fas fa-ribbon pr-2"></i>  Have a Gift Card? <span className = 'float-right pr-3' style = {{color: '#ff3e6c'}}>Apply Gift Card</span></a>           
                </div>
                </div>

                </div>

                </div>

                    <div className = 'col-md-4 mt-2 pl-4' style = {{borderLeft: '1px solid #dddde6'}}>
                    <h6 className = 'text-muted'>PRICE DETAILS ({localStorage.getItem('totalProducts')} Items)</h6>
                    <div className = 'row w-100'>
                    <div className = 'col-md-7 mb-2'>
                    Total MRP
                    </div>
                    <div className = 'col-md-4'>
                    <h6>Rs. { localStorage.getItem('MRP') }</h6>
                    </div>
                    <div className = 'row'>
                    <div className = 'col-md-7 mb-2 mr-3'>
                    Discount on MRP
                    </div>
                    <div className = 'col-md-4'>
                    <span style = {{color: '#03a685'}}> -Rs. { localStorage.getItem('discountOnMRP') }</span>
                    </div>
                    </div>
                    <div className = 'row'>
                    <div className = 'col-md-7 mb-2'>
                        Convenience Fee <span><a onClick = {showConvenientModal} style = {{color: '#ff3f6c', fontWeight: 'bolder'}}>Know More</a></span>
                    </div>
                    <div className = 'col-md-5' style = {{paddingLeft: '36px'}}>
                    Free
                    </div>
                    </div>
                    <div className = 'w-75 border-bottom my-2 ml-3'></div>

                    </div>
                 <div className = 'row'>
                    <div className = 'col-md-4 my-2'>
                    <h6> Total Amount </h6>
                    </div>
                    <div className = 'col-md-6 mt-2' style = {{paddingLeft: '102px'}}>
                    <h6>Rs. {localStorage.getItem('totalPrice') }</h6>                
                    </div>   
             
                        </div>
                    </div>  
                    <Modal footer = {false} width = {340} title="Convenience Fee" visible={isConvenientModalVisible} onCancel = {handleConvenientCancel}>
                        <div style = {{background: '#f5f5f6', padding: '20px'}}>
                        <h6>What is Convenience Fee?</h6>
                        <p className = 'text-center'>Convenience Fee" is a service charge levied by Myntra Designs Pvt. Ltd. on low value orders on the Myntra Platform.</p>
                        <p className = 'border-bottom pb-2'>Have a question? Refer <a href = '#' style = {{color: '#ff3f6c'}}>FAQ’s</a></p>
                        <p>For further information, refer to our <a href = '#' style = {{color: '#ff3f6c'}}>Terms and Service</a></p>
                        </div>
                    </Modal>
                                
             
              </div>
            </CartLayout>
            
        </div>
    )
}
