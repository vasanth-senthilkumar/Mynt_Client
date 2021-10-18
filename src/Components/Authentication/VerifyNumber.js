import React, { useEffect, useState } from 'react'
import { UserLayout } from '../Layouts/UserLayout'
import OtpInput from 'react-otp-input';
import { Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import { setAuthentication } from '../auth';
import Countdown from 'antd/lib/statistic/Countdown';


export const VerifyNumber = (props) => {
    console.log(props.number);
    const [otp, setOtp] = useState('');
    const [number, setNumber] = useState('');
    const [show, setShow] = useState(false);

    const history = useHistory();


    const handleChange = (value) => {
        setOtp(value);
    }

    useEffect(() => {
        setNumber(props.number);
        return () => {
            
        }
    }, []);

    const deadline = Date.now() + 1000 * 0 + 1000 * 120;
  
    function onFinish() {
        setShow(true);
      } 
    const submitHandler = async () => {
        await axios.post("/api/users/login/verify/code", {mobileNumber: props.number, otp: otp}).then(res => {
            if(res.status === 200) {
                setAuthentication(res.data, res.data.token);    
                swal('Congrats!', res.data.successMessage, 'success');
                history.push('/');
             } 
              else if(res.status === 201) {
                swal('Sorry!', res.data.errorMessage, 'error');
              }
             
             else if (res.status === 202) {
                history.push('/signup');
             } else {
                swal('Sorry!', 'Invalid Code', 'error');
             }
        })

    }

    const submitResendHandler = async() => {
         setShow(false);
        await axios.post(`/api/users/login/send/sms`, {mobileNumber: props.number}).then(res => {
            if(res.status === 200) {
               swal('Congrats!', res.data.successMessage, 'success');
            }
        })
   }

    

    return (
        <UserLayout navbar>
        <div className = 'verify'> 
        <div className = 'verify-inner'>
          <img src = '//constant.myntassets.com/pwa/assets/img/3a438cb4-c9bf-4316-b60c-c63e40a1a96d1548071106233-mobile-verification.jpg' width = '100' height = '100'/> 
         <h3 style = {{fontWeight: '500', fontSize: '20px'}}>Verify with OTP</h3>
         <p className = 'text-muted mb-5'>Sent to +92{props.number}</p>
        <OtpInput
        value = {otp}
        className = 'verify-inputs mb-2'
        onChange={handleChange}
        numInputs={6}
        separator={<span>&nbsp; &nbsp;</span>}
      />
       {
            show &&   <Link style = {{color: '#ff5a5a', fontWeight: '700'}} onClick = {submitResendHandler}>Resend OTP</Link>   
          }
            { 
              !show &&  <Countdown title="Countdown" value={deadline} onFinish={onFinish} />

            }
             <br/>   
      <button className = 'btn' style = {{marginLeft: '95px', marginTop: '20px', background: '#ff5a5a', color: 'white'}} onClick = {submitHandler}>Confirm</button>     
      <br/>
      <p className = 'mt-2'>Login in using <Link to = '/normal-login' style = {{color: '#ff5a5a'}}>Password</Link> </p>
      <p>Having trouble logging in? <Link to = '#' style = {{color: '#ff5a5a'}}>Get Help</Link> </p>
      </div>
        </div>
        </UserLayout>
    )
}
