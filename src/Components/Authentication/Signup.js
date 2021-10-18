import React, { useState } from 'react';
import { Form, Input, Select, Checkbox, Button, DatePicker } from 'antd';
import axios from 'axios';
import swal from 'sweetalert';
import { Spin } from 'antd';
import { LoadingOutlined, LoginOutlined } from '@ant-design/icons';
import { UserLayout } from '../Layouts/UserLayout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';


const { Option } = Select;


export const Signup = (props) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [DOB, setDOB] = useState('');
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  const handleImageChange = (e) => { 
    setFile(
      e.target.files[0]

    )
  }

  function onChange(date, dateString) {
    setDOB(dateString);
  }

  const onFinish = async (values) => {
    window.scrollTo(0, 0);
    setLoading(true);
    let data = new FormData();
    data.append('firstName', values.FirstName);
    data.append('lastName', values.LastName);
    data.append('email', values.email);
    data.append('username', values.username);
    data.append('password', values.password);
    data.append('confirm', values.confirm);
    data.append('phone', values.phone);
    data.append('DOB', DOB);
    data.append('city', values.city);
    data.append('country', values.country);
    data.append('prefix', values.prefix);
    data.append('agreement', values.agreement);
    data.append('file', file);
     
     await axios.post('/api/users/signup', data).then(res => {
         setLoading(false);
         if(res.status === 200) {
         swal('Congrats!', res.data.successMessage, 'success');
         setTimeout(() => {
           props.history.push('/login')
           
         }, 2000);
         }
        else if(res.status === 201) {
          swal('Sorry!', res.data.errorMessage, 'warning');
          }
          else if(res.status === 201) {
            setPasswordMessage(res.data.errorMessage);
          }
          else {
            swal('Sorry!', res.data.errorMessage, 'warning');
          }
     })

  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="92">+92</Option>
        <Option value="1">+1</Option>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
        
      </Select>
    </Form.Item>
  );

  const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;

  return (
      loading 
      ?
      <div className = 'text-center fixed-top' style = {{marginTop: '50vh'}}>
      <Spin indicator={antIcon} />
      </div>

      :

    <UserLayout navbar>
         <Helmet>
             <title>Myntra | Signup</title>
           </Helmet>
      {
        !isAuthenticated() 
        
        ?

  
      <div style = {{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '100px'}}>
        <div>
        <h2 className = 'text-center ml-5 my-4'>Create New Account</h2>
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ['zhejiang', 'hangzhou', 'xihu'],
        prefix: '92',
      }}
      scrollToFirstError
    >
      <Form.Item
        name="FirstName"
        label="First Name"
        rules={[
          {
            required: true,
            message: 'Please input your First Name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="LastName"
        label="Last Name"
        rules={[
          {
            required: true,
            message: 'Please input your Last Name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error("The two passwords you entered don't match."));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        className = 'mt-4'
        name="nickname"
        label="Nickname"
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: 'Please input your nickname!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        className = 'mt-4'
        name="dateOfBirth"
        label="Date Of Birth"
      >
      <DatePicker style = {{width: '269px'}} onChange={onChange} />
      </Form.Item>
      <Form.Item
        className = 'mt-4'
        name="city"
        label="City"
        rules={[
          {
            required: true,
            message: 'Please input your City!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        className = 'mt-4'
        name="country"
        label="Country"
        rules={[
          {
            required: true,
            message: 'Please input your Country!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <div className="custom-file" style = {{marginLeft: '120px'}}>
      <input type="file" name = 'file' required multiple onChange = {handleImageChange}/>
      <label className="custom-file-label" for="customFile"></label>
      </div>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a href="">agreement</a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button htmlType = 'submit' className = 'btn my-2 mt-2' style = {{width: '260px', height: '41px', background: '#ff3f6c', color: 'white'}}>
             Register
          </Button>
         
      </Form.Item>


    </Form>
    </div>
    </div>  

    :

    <div className = 'text-center' style = {{marginTop: '50vh'}}>
    <h4>
    <LoginOutlined /> <br/>
      You are already Logged in!
    </h4>
      <Link to ='/' className = 'btn my-2 mt-2' style = {{width: '300px',  background: '#ff3f6c', color: 'white'}}>Go to Home</Link>
    </div>
   }
    </UserLayout>  
  );
};
