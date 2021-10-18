import React, { useState } from 'react';
import { Form, Input, Button} from 'antd';
import axios from 'axios';
import swal from 'sweetalert';
import { Spin } from 'antd';
import { LoadingOutlined, LoginOutlined } from '@ant-design/icons';
import { isAuthenticated, setAuthentication } from '../auth';
import { getUserData } from '../localStorage';
import { Link } from 'react-router-dom';
import { UserLayout } from '../Layouts/UserLayout';
import { Helmet } from 'react-helmet';

export const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    
});

const { email, password} = userData;

const handleChange = (e) => {
  setUserData({
      ...userData,
    [e.target.name] : e.target.value
    });
  }


  const onFinish = async () => {
    window.scrollTo(0, 0);
    setLoading(true);
    let data = new FormData();
    data.append('email', email);
    data.append('password', password);
     
     await axios.post('/api/users/login', data).then(res => {
         setLoading(false);
         if(res.status === 200) {
         setAuthentication(res.data, res.data.token);    
         swal('Congrats!', res.data.successMessage, 'success');
         props.history.push('/');
         window.location.reload();
         }
        else if(res.status === 201) {
          swal('Sorry!', res.data.errorMessage, 'error');
          }
          else {
            swal('Sorry!', res.data.errorMessage, 'warning');
          }
     })

  };


  const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;

  return (
     
      <UserLayout navbar>
          <Helmet>
             <title>Myntra | Login</title>
           </Helmet>
        {
           !isAuthenticated() ?
        
      <div className = 'login'>
        <div className = 'login-inner'>
          {
             loading 
             ?
             <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '200px'}}>
             <Spin indicator={antIcon} />
             </div>
       
             :
           <>  
        <p className = 'mb-4' style = {{fontSize: '20px', fontWeight: '680', color: '#424553'}}>Login your Account</p>
    <form onSubmit={onFinish}>
              <div className="floating-label-group">
                 <input onChange = {handleChange} name = 'email' type="text" id="name" className="form-control" autofocus required />
                     <label className="floating-label">Email or Username</label>
                     </div>
                   <div className="floating-label-group">
                    <input onChange = {handleChange} name = 'password' type="password" id="password" className="form-control" autofocus required />
                     <label className="floating-label">Password</label>
                   </div>

    
      <button type = 'submit' className = 'btn my-2 mt-2 w-100' style = {{height: '41px', background: '#ff3f6c', color: 'white'}}>
             Login
          </button>
    </form>
        <div className = 'mt-4'>
            <p>
                New to Myntra? <Link to = '/signup' style = {{color: '#ff5a5a', fontWeight: '620'}}>Register</Link>
            </p>
          </div>
          <div className = 'mt-4'>
                <p>
                    Forgot your password? <Link to = '/reset-password' style = {{color: '#ff5a5a', fontWeight: '620'}}>Reset Here</Link>
                </p>
              </div>
              <div>
                <p className = 'mt-4'>Have trouble logging in? <Link to = '#' style = {{color: '#ff5a5a', fontWeight: '620'}}> Get Help</Link></p>    
                </div> 
        </>
     }        
      </div>
      </div>
      :
      <div className = 'text-center' style = {{marginTop: '50vh'}}>
      <h4>
      <LoginOutlined /> <br/>
        You are already Logged in!
      </h4>
        <Link to ='/' className = 'btn my-2 mt-2' style = {{width: '300px', background: '#ff3f6c', color: 'white'}}>Go to Home</Link>
      </div>

     }
      </UserLayout>

    );
}
