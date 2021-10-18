import { Input, Select } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert'
import { isAuthenticated } from '../auth';
import { UserLayout } from '../Layouts/UserLayout';
import { VerifyNumber } from './VerifyNumber';
const { Option } = Select;


export const MobileLogin = (props) => {
    const [number, setNumber] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setNumber(e.target.value);
    }

    const submitHandler = async() => {
         await axios.post(`/api/users/login/send/sms`, {mobileNumber: number}).then(res => {
             if(res.status === 200) {
                swal('Congrats!', res.data.successMessage, 'success');
                setSuccess(true);
             }
         })
    }
   
   useEffect(() => {
        isAuthenticated() && props.history.push('/')
       return () => {
           
       }
   }, []);
    return ( 
        <UserLayout navbar>
       { 
             
             !success &&             
            <div className = 'mobile-login'>
                <div className = 'mobile-login-inner'>
                <img src="//assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/2021/4/14/b0ced273-e0c4-4470-b0c8-aec2ecff1ca31618423390914-Banner_Login-page-500--2-.jpg" class="img-responsive preLoad loaded" alt="" title="" style={{width: "100%"}}/>
                 <div className = 'mobile-login-innermost'>
                <h4 className = 'mb-4'>Login or Signup</h4>
                <Input maxLength = {10} type = 'tel' onChange = {handleChange} placeholder="Mobile Number*" prefix={<span className = 'text-muted pr-2 mr-2' style = {{borderRight: '1px solid #94969f'}}>+91</span>} />
                <p className = 'mt-4 text-muted'>By continuing, I agree to the  
                    <Link to = '#' style = {{color: '#ff5a5a', fontWeight: '700'}}> Terms Of Use</Link> & 
                    <Link to = '#' style = {{color: '#ff5a5a', fontWeight: '700'}}> Privacy Policy</Link>
                    </p> 

                <div>
                <Link onClick = {submitHandler} className = 'btn my-2 mt-2 w-100' style = {{background: '#ff3f6c', color: 'white', borderRadius: '0px'}}>Continue</Link>     
                </div>   
                <div>
                <p className = 'mt-4'>Have trouble logging in? <Link to = '#' style = {{color: '#ff5a5a', fontWeight: '620'}}> Get Help</Link></p>    
                </div>  
                </div>
                </div>
                
            </div>
        
        }

       <div>
            {
                
               success &&   <VerifyNumber number = {number}/>

            }

       </div>
        </UserLayout>
    )
}
