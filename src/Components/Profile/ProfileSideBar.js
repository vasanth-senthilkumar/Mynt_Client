import React from 'react'
import {  NavLink } from 'react-router-dom'


export const ProfileSideBar = () => {
  
    return (
        <>
          
        <div className = 'profile-sidebar' style = {{borderRight: '1px solid #d4d5d9', paddingRight: '23px'}}>
           
            <div>
             <div className = 'prof-div' style = {{borderTop: 'none'}}>
                 <NavLink activeClassName = 'profile-sidebar-links'  to = '/my/dashboard'>Overview</NavLink>
             </div>
             <div className = 'prof-div'>
                 <p>Orders</p>
                 <NavLink activeClassName = 'profile-sidebar-links' to = '/my/orders'>Orders & Returns</NavLink>
             </div>
             <div className = 'prof-div'>
                 <p>Credits</p>
             <div>
                 <NavLink activeClassName = 'profile-sidebar-links' to = '/my/coupans'>Coupans</NavLink>
             </div>
             <div>
                 <NavLink activeClassName = 'profile-sidebar-links' to = '/my/credit'>Myntra Credit</NavLink>
             </div>
             <div>
                 <NavLink activeClassName = 'profile-sidebar-links' to = '/my/myncash'>MynCash</NavLink>
             </div>
             </div> 

             <div className = 'prof-div'>
                 <p>Profile</p>
             <div>
                 <NavLink activeClassName = 'profile-sidebar-links' to = '/my/profile'>Profile</NavLink>
             </div>
             <div>
                 <NavLink activeClassName = 'profile-sidebar-links' to = '/my/saved-cards'>Saved Cards</NavLink>
             </div>
             <div>
                 <NavLink activeClassName = 'profile-sidebar-links' to = '/my/addresses'>Addresses</NavLink>
             </div>
             <div>
                 <NavLink activeClassName = 'profile-sidebar-links' to = '/my/insider'>Myntra Insider</NavLink>
             </div>
             </div>

             <div className = 'prof-div'>
                 <p>Legal</p>
             <div>
                 <NavLink to = '/'>Terms of Service</NavLink>
             </div>
             <div>
                 <NavLink to = '/'>Privacy Policy</NavLink>
             </div>
             </div>
             </div>
            
        </div>
      </>  
    )
}
