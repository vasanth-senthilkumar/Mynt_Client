import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {CloseCircleOutlined, LoadingOutlined} from '@ant-design/icons';
import swal from 'sweetalert';
import { listProducts, wishlistProducts } from './Redux/Redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import { isAuthenticated } from './auth';
import { UserLayout } from './Layouts/UserLayout';
import { Helmet } from 'react-helmet';

export const Wishlist = (props) => {
  const userId = isAuthenticated()._id;
  const [products, setProducts] = useState([]);
  const [sizeToShop, setSizeToShop] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const getWishlistProducts = async () => {
    setLoading(true);
     await axios.get(`/api/wishlist/get/${userId}`).then(res => {
       if(res.status === 200) {
       setLoading(false);
       setProducts(res.data.products);
       } else if(res.status === 201) {
         setLoading(false);
         setProducts([]);
       } else {
         console.log('error');
       }
    });
  }

  useEffect(() => {
    !isAuthenticated() && props.history.push('/login');

    isAuthenticated() && getWishlistProducts();
    return () => {
      
    }
  }, [success]);

  const dispatch = useDispatch();
  const removeHandler = async (cartId) => {
      axios.post(`/api/wishlist/remove/${cartId}`, {userId}).then(res => {
        setSuccess(true);
        swal("Great!", res.data.successMessage, 'success');
        dispatch(wishlistProducts(userId));
        setSuccess(false);
      })
  }


  const moveHandler = async (wishlistId) => {
    axios.post(`/api/wishlist/move/${wishlistId}`, {userId}).then(res => {
      setSuccess(true);
      swal("Great!", res.data.successMessage, 'success');
      dispatch(wishlistProducts(userId));
      setSuccess(false);
    })
}

const handleCart = async ({prod}) => {
    let data = new FormData();
    data.append('title', prod.title);
    data.append('subTitle', prod.subTitle);
    data.append('price', prod.price);
    data.append('productId', prod.productId);
    data.append('userId', prod.userId);
    data.append('offer', prod.offer);
    data.append('offPrice', prod.offPrice);
    data.append('priceAfterOff', prod.priceAfterOff);
    data.append('coupan', prod.coupan);
    data.append('coupanDiscount', prod.coupanDiscount);
    data.append('coupanDiscountAmount', '0');
    data.append('coupanStatus', 'false');
    data.append('cat', prod.category);
    data.append('qty', '1');
    data.append('brand', prod.brand);
    data.append('image', prod.image)
    data.append('sizeToShop', sizeToShop);
    for(let sizes of prod.sizes) {
      data.append('sizes', sizes);
     }
    await axios.post('/api/cart/post', data).then(res => {
        console.log(res);
        if(res.status === 200) {
            // swal('success', 'Product added to Cart successfully', 'success');
            dispatch(wishlistProducts(userId));
            dispatch(listProducts(userId));

        }
        else {
        
            swal('Error', res.data.errorMessage , 'info');
        } 
        
    })
}


const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;
    return (
      <>
       <Helmet>
                <title>Myntra | Wishlist</title>
              </Helmet>
    {
      loading 
      ?
      <div className = 'text-center fixed-top' style = {{marginTop: '50vh'}}>
      <Spin indicator={antIcon} />
      </div>
       :
        <div>
          {
            products.length === 0 ? 
              <UserLayout navbar>
              <div className = 'text-center' style = {{marginTop: '40vh'}}>
               <div className = 'text-muted'>
               <h4 className = 'mb-4' style = {{color: '#282c3f', fontSize: '20px', fontWeight: '600'}}>YOUR WISHLIST IS EMPTY</h4>
               <p style = {{fontSize: '18px', color: '#94989f'}}>Add items that you like to your wishlist. Review <br/>them anytime and easily move them to the bag.</p>
               </div>
               <a href = '/' className = 'btn mt-5' style = {{border: '1px solid #3466e8', color: '#3466e8', fontWeight: '600', fontSize: '18px', borderRadius: '2px', textTransform: 'uppercase', padding: '14.5px 51px'}}>Continue Shopping</a>
              
              </div>
              </UserLayout>
            
            :
           
          <UserLayout navbar> 
          <div className = 'row' style = {{marginTop: '140px', marginLeft: '80px'}}>
           <p className = 'h5'>My Wishlist <span className = 'text-muted'>({products.length}) items </span></p>
          
          {
            products.map(prod => {
              return(
              <div className = 'col-md-3 mr-2 pt-2'>
               <div className="card border-0" style = {{height: '200px', width: '220px'}}>
               <Link to = {'/product/' + prod.productId}>
                      <div className = 'card-image'>
                        <img src = {prod.image} className = 'img-responsive img-fluid' alt = {prod.title} style = {{height: '300px', width: '300px'}}/>
                      </div>
                </Link>      
                <div className = 'card-img-overlay'>
                <CloseCircleOutlined style = {{ fontSize: '23px', background: 'hsla(0,0%,100%,.6)', border: '0px solid #d4d5d9', borderRadius: '36px', float: 'right'}} onClick = {() => removeHandler(prod.productId)}/>
                  </div>     
              <div class="card-body pt-1 border">
              <Link to = {'/product/' + prod.productId}>
                  <div>
                  <h6 class="card-title">{prod.title}</h6>
                  <p class="card-title">
                    <span style = {{fontWeight: 'bolder'}}>Rs. {prod.priceAfterOff}</span>
                    <span className = 'text-muted pl-2'><s>Rs.{prod.price}</s></span>
                    <span className = 'text-muted pl-2'><b style = {{color: '#ff905a'}}>{prod.offer}%Off</b></span>
                  </p>
                  </div> 
                  </Link>                 
                  </div>
                  <div style = {{paddingBottom: '0', marginBottom: '0'}}>
                    <button className = 'border border-top-0 w-100 pt-1' style = {{border: 'none', background: 'white', height: '40px', fontWeight: 'bolder', color: '#696b79'}} onClick = {() => {handleCart({prod}); moveHandler(prod.productId)}}>Move to Bag</button>
                  </div>
                </div>
                </div>



              )
            })
          }
          </div>
          </UserLayout> 
               }

            
        </div>
 }
        </>

    )
}
