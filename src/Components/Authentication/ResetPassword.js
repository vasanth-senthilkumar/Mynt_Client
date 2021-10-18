import { message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react'
import { UserLayout } from '../Layouts/UserLayout'

export const ResetPassword = (props) => {
    const [email, setEmail] = useState('');
    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const submitHandler = async(e) => {
        e.preventDefault();
             await axios.post('/api/users/reset-password', {email}).then(res => {
                 if(res.status === 200) {
                    message.success({
                        content : res.data.successMessage,
                        style: {
                            marginTop: '15vh',
                          },
                    });
                //  props.history.push('/login');
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
    return (
        <UserLayout navbar>
        <div className = 'login'>
        <div className = 'login-inner text-center' style = {{paddingTop: '20vh'}}>
        <h4>Enter Your Email</h4>
        <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}} className = 'w-100'>
         <form onSubmit={submitHandler} className = 'w-100'>
              <div className="floating-label-group">
                 <input onChange = {handleChange} name = 'email' type="text" id="email" className="form-control" autofocus required />
                     <label className="floating-label">Email or Username</label>
                     </div>
          <button type = 'submit' className = 'btn my-2 mt-2 w-50' style = {{height: '41px', background: '#ff3f6c', color: 'white'}}>
             Send E-mail
          </button>
      </form>
      </div>
      </div>
            
        </div>
    </UserLayout>
    )
}
