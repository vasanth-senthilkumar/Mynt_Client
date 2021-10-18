import { Button, Comment, Rate } from 'antd';
import React, { useEffect, useState } from 'react'
import { Tooltip, Avatar, Form } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { LikeDislike } from './LikeDislike';
import { isAuthenticated } from './auth';
import TextArea from 'antd/lib/input/TextArea';
import { SingleComment } from './SingleComment';
import { Link } from 'react-router-dom';
import { ReplyComment } from './ReplyComment';

export const Comments = (props) => {
    const productId = props.productId;
    const user = isAuthenticated();
    const token = localStorage.getItem('token');
    const [commentValue, setCommentValue] = useState('');
    const [form] = Form.useForm();
    const [success, setSuccess] = useState(true);
    const [rating, setRating] = useState(1);




    const handleCommentChange = (e) => {
        setCommentValue(e.target.value);
    }

   

    const handleCommentSubmit = async() => {
       await axios.post(`/api/products/comments/post`, {productId, commentValue, timeOfSubmit: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"), rating}, {headers : {
           'authorization' : 'Bearer ' + token
         }}).then(res => {
             if(res.status === 200){
           props.refreshFunction(res.data.result);
           setCommentValue("");
          } else {
              console.log('comments post error');
          }
         
          })
       
   }

   useEffect(() => {
       
       return () => {
           
       }
   }, [props.refreshFunction]);
   
   const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];
   const handleRateChange = (value) => {
        setRating(value);

   }


    return (
        <div className = 'single-comments'>
              <div>
                <div className = 'text-center mt-4'>
                    <Rate style = {{fontSize: '28px'}} tooltips={desc} onChange={handleRateChange} value = {rating}/>
                    {rating ? <h4 className="ant-rate-text pl-2">{desc[rating - 1]}</h4> : ''}
                </div>
                
                <Comment
                        avatar={
                            <Avatar
                            src={user.userPicture}
                            alt={user.username}
                            />
                        }
                        content={
                            <>
                            <Form
                             form={form}
                             name="login"
                             onFinish={handleCommentSubmit}
                            >
                            <Form.Item onChange = {handleCommentChange}>
                            <TextArea rows={4} value = {commentValue}/>
                          </Form.Item>
                          <Form.Item>
                            <Button htmlType="submit">
                              Submit
                            </Button>
                          </Form.Item>
                          </Form>
                          </>
                        }
                        />
                    
                </div>
                <div>
                    {
                       props.CommentList && props.CommentList.map(com => {
                            return(
                                !com.responseTo &&
                                <>
                                <SingleComment comment = {com} productId = {productId} refreshFunction = {props.refreshFunction}/>
                                <ReplyComment CommentList = {props.CommentList} ParentCommentId = {com._id} productId = {productId} refreshFunction = {props.refreshFunction}/>
                                </>
                            )
                        })
                    }
                </div>
                <div>

            
                </div>
            
        </div>
    )
}
