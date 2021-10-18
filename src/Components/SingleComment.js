import { Button, Comment, Rate } from 'antd';
import React, { useEffect, useState } from 'react'
import { Tooltip, Avatar, Form } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { LikeDislike } from './LikeDislike';
import { isAuthenticated } from './auth';
import TextArea from 'antd/lib/input/TextArea';
import { Link, useLocation } from 'react-router-dom';
import Search from 'antd/lib/transfer/search';
import { DeleteColumnOutlined, DeleteFilled, DeleteOutlined } from '@ant-design/icons';
import swal from 'sweetalert';

export const SingleComment = (props) => {
    const productId = props.productId;
    const comment = props.comment;
    const user = isAuthenticated();
    const token = localStorage.getItem('token');
    const [openReply, setOpenReply] = useState(false);
    const [commentValue, setCommentValue] = useState('');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);



    const handleSingleCommentChange = (e) => {
        setCommentValue(e.target.value);
    }

    const handleSingleCommentSubmit = async() => {
        await axios.post(`/api/products/comments/post`, {productId, commentValue, responseTo: comment._id, timeOfSubmit: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")}, {headers : {
            'authorization' : 'Bearer ' + token
          }}).then(res => {
              if(res.status === 200){
            setSuccess(true);
            setCommentValue("");
            setOpenReply(!openReply);
            props.refreshFunction(res.data.result);
            setSuccess(false);
           } else {
               console.log('comments post error');
           }
          
           })
        
    }

   const commentDeleteHanlder = async () => {
       await axios.post('/api/products/comments/delete', {productId, commentId: comment._id}, {headers : {
        'authorization' : 'Bearer ' + token
      }}).then(res => {
          if(res.status === 200) {
           document.location.reload();
          } else {
              swal('error', 'Error in deleting comment', 'error');
          }
       })

   }
   const desc = ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'];

    return (
        <div className = 'single-comments'>
             <div>
                            <>
                            <Comment style = {{borderTop: '1px solid #eaeaec'}}
                            actions = {
                                [
                                    <>
                                    <span className = 'pr-5'>
                                  <LikeDislike commentId = {comment._id} productId = {productId} userId = {user._id} />
                                  </span>
                                  <span> <Link style = {{fontSize: '15px'}} onClick = {() => setOpenReply(!openReply)}>Reply</Link> </span>
                                   </>
                                ]
                            }
                            author={<h6>{comment.user.username}</h6>}
                            avatar={
                                <Avatar
                                src = {comment.user.userPicture}
                                alt = {comment.user.username}
                                />
                            }
                            content={
                                <p>
                                {comment.text}
                                </p>
                            }
                            datetime={
                                <span>
                                    {moment(comment.timeOfSubmit, 'ddd MMM DD YYYY HH:mm:ss GMT Z').fromNow()} 
                                    {!comment.responseTo && <span className = 'ml-5'><Rate style = {{fontSize: '10px'}} tooltips={desc} value = {comment.rating}/>
                                    {comment.rating ? <span className="ant-rate-text pl-2">{desc[comment.rating - 1]}</span> : ''}
                                    <span>{comment.user._id === user._id && <span style = {{paddingLeft: '100%', fontSize: '15px'}}><Link onClick = {() => commentDeleteHanlder()}><Tooltip title = "Delete"><DeleteOutlined/></Tooltip></Link></span>}</span>
                                    </span>
                                    }
                                
                                </span>
                            }
                            />

                            {
                                openReply &&
                            
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
                                name="Comment"
                                onFinish={handleSingleCommentSubmit}
                                >
                             <Form.Item onChange = {handleSingleCommentChange}>
                            <TextArea rows = {2}/>
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
                            }

                           </>            

               

                </div>
            
        </div>
    )
}
