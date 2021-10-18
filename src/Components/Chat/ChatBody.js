import { DeleteOutlined, HighlightFilled, UploadOutlined } from '@ant-design/icons';
import { Button, Comment, Dropdown, Input, Popover, Tooltip, Upload } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone} from 'react-dropzone';
import { Link } from 'react-router-dom';
import  io from "socket.io-client";
import { isAuthenticated } from '../auth';
import { ChatLayout } from '../Layouts/ChatLayout';



let socket;
export const ChatBody = (props) => {
//      const receiver = props.match.params.id;
//     const user = isAuthenticated();
//     const [chatMessage, setChatMessage] = useState('');
//     const [getMessage, setGetMessage] = useState([]);
//     const [typingMessage, setTypingMessage] = useState('');
//     const [onlineMessage, setOnlineMessage] = useState('');
//     const [receiverHeader, setReceiverHeader] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [file, setFile] = useState('');
//     const [senderId, setSenderId] = useState('')
//     let ENDPOINT;
//     if(process.env.NODE_ENV === 'production') {
//          ENDPOINT = "https://clone-of-myntra.herokuapp.com/";
//     }
//       else {
//         ENDPOINT = "http://localhost:8000";
//       }


//     const onChange = e => {
//         setChatMessage(e.target.value);
//       };


//       const getSpecificUserChat = async() => {
//           await axios.get(`/api/users/chats/ind-chat`, { params: {userId: user._id, receiverId: receiver}}).then(res => {
//               setGetMessage(res.data.result);
//           })
//       }


//       const getUserById = async() => {
//         await axios.get(`/api/users/get/${receiver}`).then(res => {
//             setReceiverHeader(res.data);
//         })
//     }


//       useEffect(() => {
//         socket = io(ENDPOINT)
//         socket.emit("join", {userId: user._id, username: user.username}, () => {

//         });
        
//         socket.emit('Get Online Status', {receiver});

//         socket.on("Outputting Online Status", online => {
//              setOnlineMessage(online);
//         });

//         socket.on("outputting typing", typing => {
//              setTypingMessage(typing);
//         });

//          socket.on("Output Chat Message", messageFromBackend => {
//                 setGetMessage(messageFromBackend)
//                 var myDiv = document.getElementById("myDiv");
//                 myDiv.scrollIntoView({behavior: 'smooth'});
//          });

//          scrolltobottom();
        
//         return () => {
//             socket.disconnect();
//         }
//     }, [ENDPOINT]);  

//     useEffect(() => {
//         getSpecificUserChat();   
//         getUserById();
//         scrolltobottom();
//         socket.emit('Get Online Status', {receiver});
//         return () => {
//             socket.disconnect();
            
//         }
//     }, [receiver]);


//     const scrolltobottom = () => {
//         var myDiv = document.getElementById("myDiv");
//         myDiv.scrollIntoView({behavior: 'smooth'});

//     }


//       const submitChatHandler = async(e) => {
//         e.preventDefault();
//         setLoading(true);
//         setTypingMessage("");
//         let type = "Text";
//         chatMessage &&
//           await socket.emit("Input Chat Message", {
//             message: chatMessage,
//             userId: user._id,
//             username: user.username,
//             receiver: receiver,
//             nowTime: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),     
//             type       
//           });
//           setChatMessage("");
//           setLoading(false);

//     }

//     setTimeout(() => {
//         setTypingMessage("");
//    }, 2000);

//       const showTypingMessage = async() => {
//              socket.emit("The user is typing....", {
//                 username: user.username,
//                 receiver: receiver
//               });       
//     }



//     const handleImageChange = (e) => { 
//         setFile(
//           e.target.files[0]

//         )
//       }
//     const UploadImage = () => {
//         setLoading(true);
//         let data = new FormData();
//             data.append('file', file);
//             let type = "VideoOrImage"
//            axios.post('/api/users/chats/upload-image', data).then(res => {
//                if(res.status === 200) {
//                 socket.emit("Input Chat Message", {
//                     message: res.data.url,
//                     cloudinary_id: res.data.id,
//                     userId: user._id,
//                     username: user.username,
//                     receiver: receiver,
//                     nowTime: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),     
//                      type      
//                   });

//                   setFile('');
//                   setLoading(false);
//                }
//            });
//     }
    
//     const deleteChatHandler = async(chatId, senderId) => {
//          socket.emit("Delete Chat", {chatId : chatId, receiverId: receiver, userId: senderId});
//     }


     
//     return (
//         <ChatLayout usersSide>
     

//         <div className = 'header-avatar px-2' style = {{background: 'whitesmoke'}}>
//              <Comment
//                         author={<h6 className = 'mt-3'>{receiverHeader.username}</h6>}
//                         avatar={
//                             <Avatar
//                             size = {64}
//                             src = {receiverHeader.userPicture}
//                             alt = {receiverHeader.username}
//                             />
//                         }
//                         content={
//                             typingMessage ? 
//                             <p>
//                                 {typingMessage}
//                             </p>
//                             :
//                             <p>
//                                 {onlineMessage}
//                             </p>
//                         }
//                         />
              
//         </div>     
//         <div style = {{height:"400px"}}>
//             <div style = {{height:"400px", overflowY:'scroll', overflowX: 'hidden'}}>  
//                {
//                   getMessage && getMessage.map(chat => {
//                        return(
//                            <>
//                         <Comment className = {chat && chat.sender._id === user._id ? 'sender-chat' : ''}
//                         author={<h6>{chat &&  chat.sender.username}</h6>}
//                         avatar={
//                             <Avatar
//                             src = {chat && chat.sender.userPicture}
//                             alt = {chat && chat.sender.username}
//                             />
//                         }
//                         content={
//                               chat.message.substring(0,6) === "http:/" ?
//                               chat.message.substring(chat.message.length - 3, chat.message.length) === "mp4" ?
//                               chat.sender._id === user._id ?
//                               <Popover content={<DeleteOutlined onClick = {() => deleteChatHandler(chat._id, chat.sender)}/>} title={false} trigger="click">
//                               <video style = {{maxWidth: '200px'}} src = {chat.message} controls alt = 'video' type = "video/mp4" />
//                               </Popover>
//                                  :
//                                <video style = {{maxWidth: '200px'}} src = {chat.message} controls alt = 'video' type = "video/mp4" />


//                               :
//                               chat.sender._id === user._id ?
//                               <Popover content={<DeleteOutlined onClick = {() => deleteChatHandler(chat._id, chat.sender)}/>} title={false} trigger="click">
//                               <img src = {chat.message} alt = 'image' style = {{maxWidth: '200px'}}/>
//                               </Popover>
//                               :
//                               <img src = {chat.message} alt = 'image' style = {{maxWidth: '200px'}}/>

//                               :
//                               chat.sender._id === user._id ?
//                                <Popover content={<DeleteOutlined onClick = {() => deleteChatHandler(chat._id, chat.sender)}/>} title={false} trigger="click">
//                                 <Link>
//                                     {chat && chat.message}
//                                 </Link>
//                             </Popover>
//                              :
//                              <p>
//                                     {chat && chat.message}
//                                 </p>                                                        
//                         }
//                         datetime={
//                             <span>
//                                 {
//                                 moment(chat && chat.timeOfSending, 'dddd, MMMM Do YYYY, h:mm:ss a').fromNow() 
//                                 }
                            
//                             </span>
//                         }

//                         />
//                         </>
//                        )
//                    })
//                }
                
//                <span id = 'myDiv' className = 'float-right clear-both'>  
//                </span> 
//                </div>
//                <div className = 'p-2' style = {{position: 'sticky', bottom: '0px', background: 'lightgray'}}>
//               <Input onKeyPress = {() => showTypingMessage()} style = {file ? {width: '73%'} : {width: '82%'}} value = {chatMessage} placeholder="Type message here..." allowClear onChange={onChange} />
//              <input id = "actual-btn" type="file" name = 'file' multiple onChange = {handleImageChange} hidden/>
//              <label for="actual-btn"  className = 'px-4'><Tooltip title = 'Choose File'><UploadOutlined style = {{fontSize: '23px', cursor: 'pointer'}}/></Tooltip></label>
//                 {
//                     file ?
//                     <Button type = 'primary' loading = {loading} onClick = {UploadImage}>{loading ? <span>Sending</span> : <span>Send File</span>}</Button>
//                        :
//                      <Button type = 'primary' loading = {loading} onClick = {submitChatHandler}>Send</Button>

//                 }
//              </div>

//         </div>
//         </ChatLayout>

    // )
}
