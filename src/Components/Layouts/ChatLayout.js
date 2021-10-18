import { Comment } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth';
import { Navbar } from '../Navbar'

export const ChatLayout = (props) => {


    const user = isAuthenticated();
    const [chatMessage, setChatMessage] = useState('');
    const [getMessage, setGetMessage] = useState([]);
    const [users, setUsers] = useState([]);
    const [receiver, setReceiver] = useState('');
      const ENDPOINT = "http://localhost:8000";
 

    useEffect(() => {
        getAllUsers();
        return () => {
            
        }
    }, []);

   
    const getAllUsers = async() => {
        await axios.get('/api/users/get').then(res => {
            const filteringUsers = res.data.filter(filUser => filUser._id !== user._id);
            setUsers(filteringUsers);
        })
    }

    return (
        <div>
           {
               props.usersSide ? 
               <>
              
              <div>   
               <div className = 'row'>
               <div className = 'col-md-3 col-sm-1'>
                <div style = {{overflowY:'scroll', overflowX: 'hidden'}}>        
                    {
                      users.map(user => {
                          return(
                            <Link to = {'/chat/' + user._id} className = {receiver && receiver === user._id ? 'bg-secondary text-light' : '' }>
                            <Comment style = {{borderTop: '1px solid #eaeaec'}}
                            author={<h6>{user.username}</h6>}
                            avatar={
                                <Avatar
                                src = {user.userPicture}
                                alt = {user.username}
                                />
                                }
                                 />
                              </Link>

                          )
                      })
                    }
                    
                </div>
                </div>
                   <div className = 'col-md-8 col-sm-10' style = {{borderCollapse: 'collapse'}}>
                        {props.children}
                    </div>
                    </div>
                    </div>
         </>

            :
            props.children
           }
            
        </div>
    )
}
