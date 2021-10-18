import React from 'react'
import  {SingleComment}  from './SingleComment'

export const ReplyComment = (props) => {

    return (
        <>
          { 
           props.CommentList && props.CommentList.map(com => {
            return(
                <>
                {com.responseTo === props.ParentCommentId &&
                <div style = {{marginLeft: '41px'}}>
                <SingleComment comment = {com} productId = {props.productId} refreshFunction = {props.refreshFunction}/>
                <ReplyComment CommentList = {props.CommentList} ParentCommentId = {com._id} productId = {props.productId} refreshFunction = {props.refreshFunction}/>
                </div>
                }
                </>
            )
        })
    }

     </>

    )
}
