import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Spin } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import {CaretDownOutlined, LoadingOutlined} from '@ant-design/icons';
import swal from 'sweetalert';
import { useDispatch } from 'react-redux';
import { listProducts, wishlistProducts } from './Redux/Redux';
import { Checkbox, Divider } from 'antd';
import Search from 'antd/lib/input/Search';
import { isAuthenticated } from './auth';
import { UserLayout } from './Layouts/UserLayout';
import { CartLayout } from './Layouts/CartLayout';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
const CheckboxGroup = Checkbox.Group;



export const ProductCart = (props) => {
  const userId = isAuthenticated()._id;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [prodId, setProdId] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isQtyModalVisible, setIsQtyModalVisible] = useState(false);
  const [isCoupanModalVisible, setIsCoupanModalVisible] = useState(false);
  const [isConvenientModalVisible, setIsConvenientModalVisible] = useState(false);
  const [fetchedProductSizes, setFetchedProductSizes] = useState([]);
  const [sizeToShop, setSizeToShop] = useState('');
  const [success, setSuccess] = useState(false);
  const [MRP, setMRP] = useState('');
  const [discountOnMRP, setDiscountOnMRP] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [qtyToShop, setQtyToShop] = useState('');
  const [quantities, setQuantities] = useState([
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
    ]);
  const getCartProducts = async () => {
    setLoading(true);
     await axios.get(`/api/cart/get/${userId}`).then(res => {
       if(res.status === 200) {
        setProducts(res.data.products);
        setLoading(false);
        setMRP(res.data.products.reduce(( a,b ) => a + b.qty*b.price.toString(), 0));
        setDiscountOnMRP(res.data.products.reduce(( a,b ) => a + b.qty*b.offPrice.toString(), 0));
        setTotalPrice(res.data.products.reduce(( a,b ) => a + b.qty*b.priceAfterOff.toString(), 0));
       }
      else if(res.status === 201) {
        setLoading(false);
          setProducts([]);
      } else {
        setLoading(false);
        swal('error', res.data.errorMessage, 'error');
      }
   })

    
  }



  const getLocalProductById = (cartId) => {
    console.log(cartId)
    const allProd = JSON.parse(localStorage.getItem('product'));
     const newArray = allProd.filter(item => item._id !== cartId);
     const newProduct = allProd.filter(item => item._id === cartId);
      setProduct(newProduct[0]);
      setFetchedProductSizes(newProduct[0].productSizes);

  }

  const getProductById = async (prId) => {
    setLoading(true);
    axios.get(`/api/cart/get-product`, {params: {userId: userId, productId: prId}}).then(res => {
      setProduct(res.data && res.data[0]);
      setFetchedProductSizes(res.data[0].sizes);
      setLoading(false);
      });
    
  }

  console.log(product);

  useEffect(() => {
    if(isAuthenticated()){
      getCartProducts();
    }
     else {
    const getDATA = localStorage.getItem("product") ? JSON.parse(localStorage.getItem('product')) : [];
    const unique = Array.from(getDATA.reduce((map, obj) => map.set(obj._id, obj), new Map()).values());
    setProducts(unique);
     setLoading(false);
        }

    return () => {
      
    }
  }, [success]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showQtyModal = () => {
    setIsQtyModalVisible(true);
  };

  const handleQtyOk = () => {
    setIsQtyModalVisible(false);
  };

  const handleQtyCancel = () => {
    setIsQtyModalVisible(false);
  };

  const showCoupanModal = () => {
    setIsCoupanModalVisible(true);
  };

  const handleCoupanCancel = () => {
    setIsCoupanModalVisible(false);
  };


  const showConvenientModal = () => {
    setIsConvenientModalVisible(true);
  };

  const handleConvenientCancel = () => {
    setIsConvenientModalVisible(false);
  };
   const dispatch = useDispatch();

   const removeById = (cartId) => {
     const allProd =  localStorage.getItem("product") && JSON.parse(localStorage.getItem('product'));
     console.log(allProd);
      const newArray = allProd.filter(item => item._id !== cartId);
      localStorage.setItem('product', JSON.stringify(newArray));
      setSuccess(true);
      swal("Great!", 'Product removed from Bag', 'success');
      
   }
  
   const removeHandler = async (cartId) => {
      axios.post(`/api/cart/remove/${cartId}`, {userId}).then(res => {
        setSuccess(true);
        swal("Great!", res.data.successMessage, 'success');
        dispatch(listProducts(userId));
        setSuccess(false);
      })

  }

  const moveHandler = async (cartId) => {
    axios.post(`/api/cart/move/${cartId}`, {userId}).then(res => {
      setSuccess(true);
      swal("Great!", res.data.successMessage, 'success');
      dispatch(listProducts(userId));
      setSuccess(false);
    })
}

  const handleWishlist = async ({prod}) => {
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
    data.append('cat', prod.category);
    data.append('brand', prod.brand);
    data.append('qty', '0');
    data.append('image', prod.image);
    data.append('sizeToShop', sizeToShop);
    for(let sizes of prod.sizes) {
      data.append('sizes', sizes);
     }
    await axios.post('/api/wishlist/post', data).then(res => {
        if(res.status === 200) {
            // swal('success', 'Product add to Wishlist successfully', 'success');
            dispatch(wishlistProducts(userId));
            dispatch(listProducts(userId));
        }
        else {
        
            swal('Error', res.data.errorMessage , 'info');
        } 

        
    })
}


    const saveQtyToLocalStorage = (cartId) => {
          product.qty = qtyToShop;
          const allProd = localStorage.getItem("product") && JSON.parse(localStorage.getItem('product'));
          const newArray = allProd.filter(item => item._id !== cartId);
          newArray.push(product);
          localStorage.setItem('product', JSON.stringify(newArray));
          
        }

    const saveSizeToLocalStorage = (cartId) => {
      product.sizeToShop = sizeToShop;
      const allProd = localStorage.getItem("product") && JSON.parse(localStorage.getItem('product'));
      const newArray = allProd.filter(item => item._id !== cartId);
      newArray.push(product);
      localStorage.setItem('product', JSON.stringify(newArray));
      
}
      

     const saveQtyToDb = async (productId) => {
        await axios.post(`/api/cart/postQty/${productId}`, {qtyToShop, userId}).then(res => {
               setSuccess(true);
               setSuccess(false);
         })
     }
     const saveSizeToDb = async (productId) => {
      await axios.post(`/api/cart/postSize/${productId}`, {sizeToShop, userId}).then(res => {
             setSuccess(true);
             setSuccess(false);
       })
   }

     const onSearch = (value) => {
      products.map(prod => {
      prodId.push(prod.productId);
      });
      let data = new FormData();
      data.append('coupanCode', value);
      data.append('userId', userId);
      for(let sendingId of prodId) {
        data.append('prodId', sendingId);
      }
      axios.post('/api/cart/coupan/apply', data).then(res => {
        if(res.status === 200) {
          setSuccess(true);
          swal('Congrats', res.data.successMessage, 'success');
          setSuccess(false);
        } else if(res.status === 201) {
          swal('Sorry', res.data.errorMessage, 'error');
        }
      })
     }


     const moveToAddress = () => {
        localStorage.setItem('MRP', MRP);
        localStorage.setItem('discountOnMRP', discountOnMRP);
        localStorage.setItem('totalPrice', totalPrice);
        localStorage.setItem('totalProducts', products.length);
        props.history.push('/checkout/address');
        
     }

     const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;
     return (
          loading 
          ?
          <div className = 'text-center fixed-top' style = {{marginTop: '50vh'}}>
          <Spin indicator={antIcon} />
          </div>

          :

        <div className = 'cart'>
          {
            products.length === 0 ? 
            <CartLayout breadcrumb current = '1'>
             <Helmet>
             <title>Myntra | Bag</title>
           </Helmet> 
            <div className = 'text-center' style = {{marginTop: '40vh'}}>
               <div className = 'text-muted'>
               <h4 className = 'mb-1' style = {{color: '#424553', fontSize: '20px'}}>Hey It feels so light!</h4>
               <p>There is nothing in your bag. Let's add some items.</p>
               </div>
               <a href = '/wishlist' className = 'btn' style = {{border: '1px solid #ff3f6c', color: '#ff3f6c', fontWeight: '682', fontSize: '14px', borderRadius: '2px', textTransform: 'uppercase', padding: '10px'}}>Add More From Wishlist</a>
              
              </div>
              </CartLayout> 
            
            :

           <CartLayout breadcrumb current = "1">
          <div className = 'row'>
          <Helmet>
             <title>Myntra | Bag</title>
           </Helmet>
            <div className = 'col-md-8 pr-4'>
              <div style = {{marginLeft: '200px', background: '#e5f6f2'}}>
              <h6 className = 'py-2 pl-2'>You have got {products.length} Item(s) for Rs.{ products.reduce(( a,b ) => a + b.qty*b.priceAfterOff.toString(),0)}</h6>
          {
            products.map(prod => {
              return(
                <div className = 'row border mb-4' style = {{padding: '10px', background: 'white', marginLeft: '10px', marginRight: '10px', marginBottom: '10px'}}>
                  <div className = 'col-md-3'>
                  <input value = {prod._id} name = {prod._id} type="checkbox" className="input"/>
                  <img src = {isAuthenticated () ? prod.image : prod.productPictures} className = 'pl-2' alt = {prod.title} width = '140' />
                  </div>
                  <div className = 'col-md-4 ml-4'>
                  <div>
                  <h4>{prod.title}</h4>
                  <p>{prod.subTitle}</p>
                  <p className = 'text-muted mt-0 pt-0'>Sold By: Saeed Ahmed</p>
                  <a onClick={() =>  {isAuthenticated() ? getProductById(prod.productId) : getLocalProductById(prod._id); showModal() }}>
                    <span className = 'font-weight-bold'>
                    Size: {prod.sizeToShop}<CaretDownOutlined />
                    </span>
                </a>

                <a onClick={() =>  {isAuthenticated() ?  getProductById(prod.productId) : getLocalProductById(prod._id); showQtyModal()}}>
                    <span className = 'font-weight-bold ml-3'>
                    Qty:{prod.qty}<CaretDownOutlined />
                    </span>
                </a>
    
                  </div>
                  </div>
                  <div className = ''>
                    <button className = 'border border-bottom w-25 mt-2' style = {{border: 'none', background: 'white', height: '40px', fontWeight: 'bolder', color: '#696b79'}} onClick = {() =>  {isAuthenticated() ? removeHandler(prod.productId) : removeById(prod._id)}}>Remove</button>
                    <button className = 'border border-bottom w-75 mt-2' style = {{border: 'none', background: 'white', height: '40px', fontWeight: 'bolder', color: '#696b79'}} onClick = {() => {handleWishlist({prod}); moveHandler(prod.productId)}} type = 'primary'>Move to Wishlist</button>

                  </div>
                </div>
              )
            })
          
          }
          <div className = 'mx-2 border' style = {{height: '49px', background: 'white', marginBottom: '1000px !important'}}>
            <div className = 'mt-3 ml-5'>
          <a href = '/wishlist' className = '' style = {{border: 'none', background: 'white', height: '60px', fontWeight: 'bolder'}}> <i className="fas fa-ribbon pr-2"></i>  Add More From Wishlist <span className = 'float-right pr-3'><svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" class="addToWishlist-base-wishlistChevron"><path fill-rule="evenodd" d="M6.797 5.529a.824.824 0 0 0-.042-.036L1.19.193a.724.724 0 0 0-.986 0 .643.643 0 0 0 0 .94L5.316 6 .203 10.868a.643.643 0 0 0 0 .938.724.724 0 0 0 .986 0l5.566-5.299a.644.644 0 0 0 .041-.978"></path></svg></span></a>           
          </div>
          </div>
           </div>
           </div>
            

           <Modal title="Select Size" footer = {false} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
           
                   <div className = 'row'>
                  <div className = 'col-md-2'>
                  <img src ={isAuthenticated () ? product.image : product.productPictures}  alt = {product.title} width = '60' />
                  </div>
                  <div className = 'col-md-9'>
                  <div>
                  <h4>{product.title}</h4>
                  <p>{product.subTitle}</p>
                  <h6>Rs.{product.price}</h6>
                  <p className = 'text-muted mt-0 pt-0'>Sold By: Saeed Ahmed</p>
                  </div>
                  </div>
                  </div>
                  <div>
                    <h4>Select Size</h4>
                      {
                        isAuthenticated() ?
                        fetchedProductSizes && fetchedProductSizes.map(size => {
                              return(
                                <button onClick = {() =>  setSizeToShop(size)} className = 'btn btn-outline-danger mx-2' style = {{borderRadius: '180px', border: '2px solid gray', width: '60px', height: '60px'}}>
                                {size}
                                </button>

                              )
                          })
                          :
                          fetchedProductSizes && fetchedProductSizes.map(size => {
                            return(
                              <button onClick = {() =>  setSizeToShop(size.size)} className = 'btn btn-outline-danger mx-2' style = {{borderRadius: '180px', border: '2px solid gray', width: '60px', height: '60px'}}>
                              {size.size}
                              </button>

                            )
                        })
                      }

                   <div className = 'text-center mt-4'>
                      <Button onClick = {() => {isAuthenticated() ? saveSizeToDb(product.productId) : saveSizeToLocalStorage(product._id)}}>Save</Button>
                      </div>
                      
                  </div>
              </Modal>

              <Modal title = 'Select Quantity' footer = {false} width = {380} visible = {isQtyModalVisible} onOk = {handleQtyOk} onCancel = {handleQtyCancel}>
                
                      <h4>Select Quantity</h4>
                      {
                        quantities.map(q => {
                            return(
                              <button onClick = {() => setQtyToShop(q)} className = 'btn btn-outline-danger mx-2 my-2' style = {{borderRadius: '180px', border: '2px solid gray', width: '47px', height: '47px'}}>
                                {q}
                                </button>
                            )
                        })
                      }
                      <div className = 'text-center mt-2'>
                      <Button onClick = {() => {isAuthenticated() ? saveQtyToDb(product.productId) : saveQtyToLocalStorage(product._id)}}>Save</Button>
                      </div>
                                                                       
               </Modal>
         
          <div className = 'col-md-4'>
             
             <div className = 'row'>
               <h6 className = 'mb-3'>Coupans</h6>
             <div className = 'col-md-1'>
             <i class="fas fa-tag"></i>
               </div>
               <div className = 'col-md-4'>
                <h6>Apply Coupans</h6> 
               </div>
               <div className = 'col-md-6'>
                <button onClick = {showCoupanModal} className = 'btn border-danger text-danger h-75 pb-3'>Apply</button>
                <Modal title = 'Coupan' visible = {isCoupanModalVisible} footer = {false} onCancel = {handleCoupanCancel}>
                <Search
                      placeholder="Enter Coupan Code"
                      allowClear
                      enterButton="Check"
                      size="large"
                      onSearch = {onSearch}
                    />
                </Modal>
               </div>
               {
                 !isAuthenticated () && 
                 <div className = 'col-md-12 ml-4 pb-3 mb-4 border-bottom' style = {{width: '315px'}}>
                  <a href = "login" style = {{color: '#ff3f6c', fontWeight: 'bolder'}}>Login</a> to see best coupans for you
                </div>
               }
               
             </div>

            <h6>Price Details ({products.length} Items)</h6>
            <div className = 'row w-100'>
            <div className = 'col-md-7 mb-2'>
              Total MRP
              </div>
              <div className = 'col-md-4 pl-3'>
              <h6>Rs. { products.reduce(( a,b ) => a + b.qty*b.price, 0)}</h6>
              </div>
              <div className = 'row'>
                <div className = 'col-md-7 mb-2 mr-3'>
              Discount on MRP
              </div>
              <div className = 'col-md-4'>
              <span style = {{color: '#03a685'}}> -Rs. { products.reduce(( a,b ) => a + b.qty*b.offPrice, 0)}</span>
              </div>
              </div>
              <div className = 'row'>
                <div className = 'col-md-7 mb-2 mr-3'>
              Coupan Discount
              </div>
              <div className = 'col-md-4'>
                  <span className = 'ml-0' style = {{color: '#03a685'}}>
                    -Rs.&nbsp;
                    {
                    products.reduce(( a,b ) => a + b.coupanDiscountAmount, 0)
                    }
                  </span>
             
              
            
              
              </div>
              </div>
              <div className = 'row'>
                <div className = 'col-md-7 mb-2'>
              Convenience Fee <span><a onClick = {showConvenientModal} style = {{color: '#ff3f6c', fontWeight: 'bolder'}}>Know More</a></span>
              </div>
              <div className = 'col-md-5' style = {{paddingLeft: '36px'}}>
               Free
              </div>
              </div>
              <div className = 'w-75 border-bottom my-2 ml-3'></div>

            </div>
            <div className = 'row'>
            <div className = 'col-md-4'>
              <h6> Total Amount </h6>
              </div>
              <div className = 'col-md-6' style = {{paddingLeft: '130px'}}>
               <h6>Rs. { products.reduce(( a,b ) => a + b.qty*b.priceAfterOff.toString(), 0)}</h6>                
              </div>
              <div className = 'col-md-8'>
                <Link onClick = {() => isAuthenticated() ? totalPrice > 0 ? moveToAddress() : swal('error', 'Please add qty of products', 'error') : props.history.push('/login')} className = 'btn my-2' style = {{width: '345px', background: '#ff3f6c', color: 'white'}}>Place Order</Link>
              </div>
            </div>
          </div>
          <Modal footer = {false} width = {340} title="Convenience Fee" visible={isConvenientModalVisible} onCancel = {handleConvenientCancel}>
             <div style = {{background: '#f5f5f6', padding: '20px'}}>
               <h6>What is Convenience Fee?</h6>
               <p className = 'text-center'>Convenience Fee" is a service charge levied by Myntra Designs Pvt. Ltd. on low value orders on the Myntra Platform.</p>
               <p className = 'border-bottom pb-2'>Have a question? Refer <a href = '#' style = {{color: '#ff3f6c'}}>FAQ’s</a></p>
               <p>For further information, refer to our <a href = '#' style = {{color: '#ff3f6c'}}>Terms and Service</a></p>
             </div>
         </Modal>

            
        </div>
        </CartLayout>  
           }
        

        </div>
    )
}
