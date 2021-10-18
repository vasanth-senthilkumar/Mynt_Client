import axios from 'axios';
import 'antd/dist/antd.css';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {Badge, Dropdown, Input, Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, wishlistProducts } from './Redux/Redux';
import { isAuthenticated, logout } from './auth';
import { HeartOutlined, ShoppingCartOutlined, ProfileOutlined, SearchOutlined } from '@ant-design/icons';


export const Navbar = () => {
  const node = useRef();
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const productsList = useSelector(state => state.productsList);
  const { productsInCart } = productsList;
  const wishlistReducer = useSelector(state => state.wishlistReducer);
  const { wishProducts } = wishlistReducer;
  const cart =  productsInCart && productsInCart ? productsInCart.products && productsInCart.products.length : 0;
  const wishlist = wishProducts && wishProducts ? wishProducts.products && wishProducts.products.length : 0;
  const getDATA = localStorage.getItem("product") ? JSON.parse(localStorage.getItem('product')) : [];
  const uniqueCart = Array.from(getDATA.reduce((map, obj) => map.set(obj._id, obj), new Map()).values());
  const localCartProducts = uniqueCart;
  const getWishDATA = localStorage.getItem("wishProduct") ? JSON.parse(localStorage.getItem('wishProduct')) : [];
  const uniqueWishlist = Array.from(getWishDATA.reduce((map, obj) => map.set(obj._id, obj), new Map()).values());
  const localWishProducts =  uniqueWishlist;


  const fetchCategories = () => {
    axios.get('/api/categories').then(data => {
      setCategories(data.data);
    })
  }

  const userId = isAuthenticated()._id;
  const dispatch = useDispatch();
  useEffect(() => {
    if(isAuthenticated()){
    dispatch(listProducts(userId));
    dispatch(wishlistProducts(userId));
    }
    

    return () => {

    }
  }, [userId]);

  useEffect(() => {
    fetchCategories();
    
    return () => {
    
    }
  }, []);



  const fetchProducts = async(query) => {
      await axios.post('/api/products/search', {query}).then(res => {
        setProducts(res.data);
      })

  }
   
 
  const menu = (
      <div className = 'navMenu'>
        <div className = 'mask'></div>
          {
            isAuthenticated() 
            ?
            <Menu style = {{width: '280px', paddingTop: '10px', paddingBottom: '10px'}}>
            <Menu.Item>
              <Link to="/my/profile">
              <h6>Hello {isAuthenticated().firstName}</h6> <br/> 
            </Link>
              <div style = {{borderBottom: '1px solid #eaeaec', paddingTop: '0px'}}></div>
            </Menu.Item>
            <Menu.Item>
              <Link to="/my/orders">
                Orders
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/wishlist">
                Wishlists
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/my/saved-cards">
                Gift Cards
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/contact">
                Contact Us
              </Link>
              <div style = {{borderBottom: '1px solid #eaeaec', paddingTop: '20px'}}></div>
            </Menu.Item>
            <Menu.Item>
              <Link to="/my/credit">
                Myntra Credit
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/my/coupans">
                Coupans
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/my/saved-cards">
                Saved Cards
              </Link>
             </Menu.Item> 
              <div style = {{borderBottom: '1px solid #eaeaec', paddingTop: '20px'}}></div>
              <Menu.Item>
              <Link to="/my/profile/edit">
                Edit Profile
              </Link>
            </Menu.Item>
            <Menu.Item>
              <a href = '/login' onClick = {(e) => {logout(() => {})}}>
                Logout
              </a>
            </Menu.Item>
            </Menu>

            :
          <Menu style = {{padding: '10px'}}>
          <h6>Welcome</h6>
           <p>To access account and manage orders</p>
          <Menu.Item>
            <Link to="/login" className = 'px-4 login-btn' style = {{border: '1px solid #f5f5f6', color: '#ee5f73', padding: '8px', fontWeight: '500', fontSize: '14px'}}>
            Login/Signup
          </Link>
            
            <div style = {{borderBottom: '1px solid #eaeaec', paddingTop: '20px'}}></div>
          </Menu.Item>
          <Menu.Item>
            <Link to="/login">
              Orders
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/login">
              Wishlists
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/login">
              Gift Cards
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/contact">
              Contact Us
            </Link>
            <div style = {{borderBottom: '1px solid #eaeaec', paddingTop: '20px'}}></div>
          </Menu.Item>
          <Menu.Item>
            <Link to="/login">
              Myntra Credit
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/login">
              Coupans
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/login">
              Saved Cards
            </Link>
          </Menu.Item>
          </Menu>
          }
          </div>
       );


/************************************************** Search Bar and Results ****************************************/
       useEffect(() => {
        document.addEventListener("mousedown", handleClick);
    
        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
      }, []);

     
        const handleClick = e => {
          if (node.current.contains(e.target)) {
            return;
          }
          // outside click
          setOpen(false);
        };


   return (
    <div className = 'main-nav'>

      <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white">
        <Link className="navbar-brand" to="/">M</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto list-unstyle pt-3" style = {{fontSize: '12px'}}>
                       
                        
                    {
                      categories.map(data => {
                        return (
                          <li className='nav-item'> 
                          <Link className="dropdown allCat">
                            <a className = 'nav-link' id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {data.name}
                            </a>
                           
                       <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                         
                        <div className = 'rows'  style = {{width: '73vw'}}> 
                         
                           
                        {
                          data.children.length > 0 ?
                              data.children.map(sub => {

                                return (
                                  <>
                                  <div className =  'nav-columns font-weight-bold' key={data.id} style = {{fontSize: '12px'}}>
                                  <a className="dropdown-item text-danger" style = {{fontSize: '12px'}} key={sub.id} to="/">{sub.name}</a>
                                   
                                   {
                                     sub.children.length > 0 ?
                                     sub.children.map(child => {
                                       return(
                                       <p> 
                                       <Link to = {'/products/' + child._id} className='child'>{child.name}</Link>
                                       </p>
                                          
                                         
                                       )
                                     }) :
                                     null
                                   }
                                   </div>
                                  </>
                                   
                                )
                              }) : null

                        }   
                        
                        

                          </div>  
                      </div>
                      </Link>
                      </li>
                 
                        )
                      })

                    
                    }
                
            <form className="d-flex form-search">
            <div ref={node} className="dropdown">
              <Input className="dropdown-toggler" onClick={e => setOpen(!open)}  onChange = {(e) => fetchProducts(e.target.value)} prefix = {<SearchOutlined className = 'pr-2 pl-2'/>} size = 'small' style = {{width: '380px'}} placeholder="Search for products, brands and more"/>
              {open && (
                <div className="dropdown-menu" style = {{maxHeight: '460px', overflowY: 'auto'}}>
                  {
                  products.length > 0 ? products.map(product => {
                       return(
                         <div className = 'px-2 py-2'>
                            <Link style = {{fontSize: '13px', color: '#696e79', paddingLeft: '4px'}} to = {'/product/'+ product._id}>
                              {product.title}
                            </Link>
                         </div>
                       )
                    })
                    :
                    <div className = 'px-2 py-2'>
                      No search results!
                    </div>
                    }
                </div>
              )}
            </div>
            </form>
            <li className = 'nav-item profile ml-5' style = {{fontWeight: 'normal'}}>
            <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <ProfileOutlined style={{ fontSize: '21px', paddingLeft: '10px'}}/>
            <br/>
            <span style = {{fontSize: '14px'}}>Profile</span>
            </a>
          </Dropdown>
             
            </li>
            <li className = 'ml-3'>
           <Link to = '/wishlist'>
           <Badge count={isAuthenticated() ? wishlist : localWishProducts && localWishProducts.length}>
             <HeartOutlined style={{ fontSize: '21px', paddingLeft: '12px'}}/>
             </Badge>
             <br/>
             <span style = {{fontSize: '14px'}}>Wishlist</span>
             </Link> 
            </li>
              <li className = 'ml-2'>
              <Badge count={isAuthenticated() ? cart : localCartProducts.length}>
                <Link to = '/cart'><ShoppingCartOutlined style={{ fontSize: '24px', paddingBottom: '1px'}}/><br/><span style = {{fontSize: '14px'}}>
                  Bag 
                  </span>
                  </Link>
  
                  </Badge>
               
              </li>
            
           
            </ul>
            </div>   

         
      </nav>


    </div>
  )
}
