import { Input, message } from "antd";
import {Form} from "antd";
import axios from "axios";
import React, { useState } from "react";
import { UserLayout } from "../Layouts/UserLayout";

export const NewPassword = (props) => {
  const [form] = Form.useForm();
  const token = props.match.params.token;

  const submitHandler = async (values) => {
    await axios.post("/api/users/update-password", { password: values.password, confirm: values.confirm, token }).then((res) => {
      if (res.status === 200) {
        message.success({
          content: res.data.successMessage,
          style: {
            marginTop: "15vh",
          },
        });
         props.history.push('/login');
      } 
       else if(res.status === 201) {
        message.error({
          content: res.data.errorMessage,
          style: {
            marginTop: "15vh",
          },
        });
      }
      else {
        message.error({
          content: res.data.errorMessage,
          style: {
            marginTop: "15vh",
          },
        });
      }
    });
  };
  return (
    <UserLayout navbar>
      <div className="login new-password">
        <div className="login-inner text-center" style={{ paddingTop: "20vh" }}>
          <h4>Enter New Password</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="w-100"
          >
            {/* <form onSubmit={submitHandler} className = 'w-100'>
              <div className="floating-label-group">
                 <input onChange = {handleChange} name = 'email' type="text" id="email" className="form-control" autofocus required />
                     <label className="floating-label">Email or Username</label>
                     </div>
          <button type = 'submit' className = 'btn my-2 mt-2 w-50' style = {{height: '41px', background: '#ff3f6c', color: 'white'}}>
             Update 
          </button>
      </form> */}
            <Form
              form={form}
              name="register"
              onFinish={submitHandler}
              scrollToFirstError
            >
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder = 'Enter new password'/>
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder = 'Re-Enter new password'/>
              </Form.Item>
              <button type = 'submit' className = 'btn my-2 mt-2 w-50' style = {{height: '41px', background: '#ff3f6c', color: 'white'}}>
                    Update 
                </button>
            </Form>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};
