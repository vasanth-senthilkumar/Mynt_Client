import { Tooltip } from 'antd'
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, SwapLeftOutlined } from '@ant-design/icons';
import React, { createElement, useEffect, useState } from 'react'
import axios from 'axios';
import swal from 'sweetalert';

export const LikeDislike = (props) => {
    const commentId = props.commentId;
    const userId = props.userId;
    const productId = props.productId;
    const [likeAction, setLikeAction] = useState(null);
    const [disLikeAction, setDisLikeAction] = useState(null);
    const token = localStorage.getItem('token');
    const [likes, setLikes] = useState(0);
    const [disLikes, setDisLikes] = useState(0);
     const [success, setSuccess] = useState(false);
    const getLikes = async () => {     
            await axios.get(`/api/products/like-dislike/get-likes`, { params: { commentId, productId }}
               ).then(res => {
                  if(res.status === 200 ) {
                setLikes(res.data.likes.length);
                  res.data.likes.map(like => {
                      if(like.userId === userId) {
                          setLikeAction('liked');
                      }
                  })
                  }  else {
                      swal('error', 'Failed to get likes', 'error')
                  }
            });
      
    };

    const getDisLikes = async () => {     
        await axios.get(`/api/products/like-dislike/get-dislikes`, { params: { commentId, productId }}
           ).then(res => {
              if(res.status === 200 ) {
               setDisLikes(res.data.dislikes.length);

              res.data.dislikes.map(dislike => {
                  if(dislike.userId === userId) {
                      setDisLikeAction('disLiked');
                  }
              })
              }  else {
                  swal('error', 'Failed to get disLikes', 'error')
              }
        });
  
};

    const likeHandler = async () => {
          setSuccess(true);
        if (likeAction === null) {
            await axios.post(`/api/products/like-dislike/uplike`, { commentId, productId }, {headers : {
                'authorization' : 'Bearer ' + token
              }}).then(res => {
                  if(res.status === 200 ) {
                    setLikes(likes + 1);
                    setLikeAction('liked');

                    setDisLikeAction(null);
                    setDisLikes(disLikes - 1);
                    

                
                  }  else {
                      swal('error', 'Failed to Increase likes', 'error')
                  }
            });
        }

        if (likeAction === 'liked') {
            await axios.put(`/api/products/like-dislike/unlike`, { commentId, productId }, {
                headers: {
                    'authorization': 'Bearer ' + token
                }
            }).then(res => {
                 if(res.status === 200) {
                     setLikeAction(null);
                     setLikes(likes - 1);
                 }
                 else {
                     swal('error', 'Failed to decrease like.');
                 }


            })
        }

    };


    const disLikeHandler = async () => {
         setSuccess(true);
        if (disLikeAction === null) {
            await axios.post(`/api/products/like-dislike/updislike`, { commentId, productId }, {headers : {
                'authorization' : 'Bearer ' + token
              }}).then(res => {
                  if(res.status === 200 ) {
                    setDisLikes(disLikes + 1);
                    setDisLikeAction('disLiked');

                    setLikeAction(null);
                    setLikes(likes - 1);

                  }  else {
                      swal('error', 'Failed to Increase dislikes', 'error')
                  }
            });
        }

        if (disLikeAction === 'disLiked') {
            await axios.put(`/api/products/like-dislike/undislike`, { commentId, productId }, {
                headers: {
                    'authorization': 'Bearer ' + token
                }
            }).then(res => {
                 if(res.status === 200) {
                     setDisLikeAction(null);
                     setDisLikes(disLikes - 1);
                 }
                 else {
                     swal('error', 'Failed to decrease dislikes.');
                 }


            })
        }
    };


   useEffect(() => {
        getLikes();
        getDisLikes();
       return () => {
           
       }
   }, [likes, disLikes])

    return (
        <span className = 'like-dislikes'>

            <Tooltip key="comment-basic-like" title="Like">
                <span onClick={likeHandler} className = { success ? 'pr-4 active' : 'pr-4'}>
                    {likeAction === 'liked' ?  <LikeOutlined style = {{color: '#ee5f73'}}/> : <LikeOutlined/>}
                    <span className="comment-action pl-1">{likes}</span>
                </span>
            </Tooltip>


            <Tooltip key="comment-basic-dislike" title="Dislike">
                <span onClick={() => disLikeHandler()} className = { success ? 'active' : ''}>
                    {disLikeAction === 'disLiked' ? <DislikeOutlined style = {{color: '#ee5f73'}}/> : <DislikeOutlined/>}
                    <span className="comment-action pl-1">{disLikes}</span>
                </span>
            </Tooltip>

        </span>
    )
}
