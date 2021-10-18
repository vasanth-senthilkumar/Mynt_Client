import React, { useState } from 'react'
import { Statistic } from 'antd';
import { Link } from 'react-router-dom';

const { Countdown } = Statistic;



export const About = () => {
   const [show, setShow] = useState(false);
 
  const deadline = Date.now() + 1000 * 0 + 1000 * 10;

    function onFinish() {
        console.log('finished!');
        setShow(true);
      }

  return (


    <div>
          {
            show &&   <Link style = {{color: '#ff5a5a', fontWeight: '700'}} onClick = {() => setShow(false)}>Resend OTP</Link>   
          }
            { 
              !show &&  <Countdown title="Countdown" value={deadline} onFinish={onFinish} />

            }

    <h1>   about</h1>
    <h1>   about</h1>
    <h1>   about</h1>
    <h1>   about</h1>
    <h1>   about</h1>
    <h1>   about</h1>
    <h1>   about</h1>
    <h1>   about</h1>
    <h1>   about</h1>
    <h1>   about</h1>
    <h1>   about</h1>
    <h1>   about</h1>
    <h1>   about</h1>
    
      
    </div>
  )
}
