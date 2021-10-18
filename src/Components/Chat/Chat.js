import React, { useEffect } from 'react'
import { isAuthenticated } from '../auth';
import { ChatLayout } from '../Layouts/ChatLayout';


export const Chat = (props) => {

    useEffect(() => {
        !isAuthenticated() && props.history.push('/login');
        return () => {
            
        }
    }, [])
  
    return (
        <ChatLayout usersSide>
           {/* <h1>Chats</h1> */}
           <div>
           </div>
        </ChatLayout>
    )
}
