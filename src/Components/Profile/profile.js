import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth'
import { ProfLayout } from '../Layouts/ProfileLayout'

export const Profile = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
     
    const getUser = async() => {
        setLoading(true);
      await axios.get(`/api/users/get/${isAuthenticated()._id}`).then(res => {
          setUser(res.data);
          setLoading(false);
      })
    }

    useEffect(() => {
        getUser();
        return () => {
            
        }
    }, []);

    console.log(user);
    return (
        <ProfLayout sidebar>
             <div className = 'profile'>
                <div className = 'inner' style = {{marginTop: '10px', paddingTop: '47px', border: '1px solid #d4d5d9'}}>
                    <span className = 'user-prof'>Profile Details</span>
                 <div className = 'row mx-5 text-center mt-4 pb-5' style = {{borderTop: '1px solid #d4d5d9'}}>
                     
                     <div className = 'col-md-5 col-sm-6 mt-4'>
                           <p> Full Name</p>
                     </div>
                     <div className = 'col-md-5 col-sm-6 mt-4'>
                         <p>{user.firstName} {user.lastName}</p>
                    </div>

                    <div className = 'col-md-5 col-sm-6 mt-4'>
                           <p> Mobile Number</p>
                     </div>
                     <div className = 'col-md-5 col-sm-6 mt-4'>
                         <p>{user.phone}</p>
                    </div>

                    <div className = 'col-md-5 col-sm-6 mt-4'>
                           <p>Email ID</p>
                     </div>
                     <div className = 'col-md-5 col-sm-6 mt-4'>
                         <p>{user.email}</p>
                    </div>

                    <div className = 'col-md-5 col-sm-6 mt-4'>
                           <p>Gender</p>
                     </div>
                     <div className = 'col-md-5 col-sm-6 mt-4'>
                         <p>{user.firstName}</p>
                    </div>

                    <div className = 'col-md-5 col-sm-6 mt-4'>
                           <p>Date Of Birth</p>
                     </div>
                     <div className = 'col-md-5 col-sm-6 mt-4'>
                         <p>{user.DOB}</p>
                    </div>

                    <div className = 'col-md-5 col-sm-6 mt-4'>
                           <p>Location</p>
                     </div>
                     <div className = 'col-md-5 col-sm-6 mt-4'>
                         <p>{user.city} {user.country}</p>
                    </div>
                    <div className = 'col-md-10 col-sm-10 mt-5 profile-btn'>
                         <Link to = '/my/profile/edit' className = 'btn'>Edit</Link>
                    </div>
                 </div>
                 </div>
             </div>
            
        </ProfLayout>
    )
}
