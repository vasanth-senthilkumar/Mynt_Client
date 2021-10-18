import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Breadcrumb, Button, Carousel, Spin } from 'antd';
import { Link } from 'react-router-dom';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import FormList from 'antd/lib/form/FormList';
import Modal from 'antd/lib/modal/Modal';
import { UserLayout } from './Layouts/UserLayout';
import { HeartOutlined, LoadingOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { wishlistProducts } from './Redux/Redux';
import { isAuthenticated } from './auth';
import swal from 'sweetalert';
import { useDispatch } from 'react-redux';


export const Products = (props) => {
  const catId = props.match.params.id;
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [prices, setPrices] = useState([]);
  const [count, setCount] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [prodId, setProdId] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  }

  useEffect(() => {
    getProducts();
    getCategories();
    getBrands();
    fetchPriceRanges();
    return () => {
      
    }
  }, [catId]);
  
  const getProducts = async() => {
     setLoading(true);
    axios.get(`/api/products/get/${catId}`).then(res => {
      if(res.status === 200) {
      setProducts(res.data.findProducts);
      // setTitle('Myntra | ' +  res.data.findProducts[0].category.name)
      setLoading(false);
      } else {
        setProducts([]);
      }
    })

  }

 
  const getCategories = async() => {
    setLoading(true);
    axios.get(`/api/categories/`).then(res => {
      setCategories(res.data);
      setLoading(false);
    })

  }

  const getBrands = async() => {
    setLoading(true);
    axios.get(`/api/categories/brands`).then(res => {
      setBrands(res.data.brands);
      setLoading(false);
    })

  }
  
const onChangeCatBox = (catId) => {
  setLoading(true);
  axios.get(`/api/products/get/${catId}`).then(res => { 
      setProducts(res.data.findProducts);
      setLoading(false);
  });
}


  const onChangeBrandBox = (brandId) => {
    setLoading(true);
    axios.get(`/api/products/productsByBrand/get/${brandId}`).then(res => {
          setProducts(res.data.findProducts);
          setLoading(false);

    })
   
  }

  const onChangePriceRange = (priceId) => {
    setLoading(true);
    axios.get(`/api/products/productsByPriceRange/get/${priceId}`).then(res => {
      setProducts(res.data.findProducts);
      setLoading(false);
})

  } 

    
  const fetchPriceRanges = async() => {
    setLoading(true);
    await axios.get('/api/categories/price-ranges').then(res => {
        setPrices(res.data.range);
        setLoading(false);
    })
}   



/*********************************************** Wishlist ****************************************************/
const dispatch = useDispatch();
const handleWishlist = async(product) => {
  let data = new FormData();
  data.append('title', product.title);
  data.append('subTitle', product.subTitle);
  data.append('price', product.price);
  data.append('productId', product._id);
  data.append('userId', isAuthenticated()._id);
  data.append('offPrice', product.offPrice);
  data.append('priceAfterOff', product.priceAfterOff);
  data.append('coupan', product.coupan);
  data.append('coupanDiscount', product.coupanDiscount);
  data.append('coupanDiscountAmount', '');
  data.append('coupanStatus', 'false');
  data.append('offer', product.offer);
  data.append('cat', product.category.name);
  data.append('brand', product.brand.name);
  data.append('image', product.productPictures[0].img)
  data.append('sizeToShop', 'S');
  for(let sizes of product.productSizes) {
    data.append('sizes', sizes.size);
   }
  await axios.post('/api/wishlist/post', data).then(res => {
      if(res.status === 200) {
          swal('success', 'Product add to Wishlist successfully', 'success');
          dispatch(wishlistProducts(isAuthenticated()._id));
      }
      else {
      
          swal('Error', res.data.errorMessage , 'info');
      }            
  })
}


const saveProductToWishlist = (product) => {
  var allEntries = localStorage.getItem("wishProduct") && JSON.parse(localStorage.getItem("wishProduct")) || [];
  product.productPictures = product.productPictures[0].img;
  product.qty = '1';
  product.sizeToShop = 'S';
  allEntries.push(product); 
 localStorage.setItem('wishProduct', JSON.stringify(allEntries));
  swal('success', 'Product add to Wishlist successfully', 'success');
  
}



const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;
  return (
    <UserLayout navbar>
      <div className = 'products-page'>

          <Helmet>
             <title>{title}</title>
           </Helmet> 
    <div style = {{marginTop: '97px', paddingLeft: '0px'}}>
      <div className = 'ml-4'>
         <h1>Products</h1>
         {
          products.slice(0, 1).map(prod => {
            return(
              <>
              <h6>{prod.category.name} <span className = 'text-muted'>- {products.length} items</span></h6> 

              </>
            )
          })
        }
       <Breadcrumb separator=">">
        <Breadcrumb.Item href = '/'>Home</Breadcrumb.Item>
        <Breadcrumb.Item>products</Breadcrumb.Item>
      </Breadcrumb>
      </div>
       <div className = 'row' style = {{marginTop: '20px', border: '1px solid #eaeaec'}}>
       <div className = 'col-md-3 col-lg-3 pl-5 pt-4' style = {{width: '262px', borderRight: '1px solid #eaeaec'}}>
       <h4>Categories</h4>
         {
           categories.map(cat => {
               return(
                 <>
                   {
                     cat.children.slice(0, 1).map(subCat => {
                       return(
                         <>
                          {
                            subCat.children.map(childCat => {
                              return(
                                <div className = 'mb-2 pl-4'>
                                  <Checkbox onChange ={(e) => {onChangeCatBox(childCat._id)}}>{childCat.name}</Checkbox>
                                </div>

                              )
                            })
                          }
                         </>
                        

                       )
                     })
                   }
                 </>
               )
           })
         }
          <div>
          
            {
              count ? null : <Link type="primary" onClick={showModal}>
            See More +
          </Link>

            }
            
            
        
          <Modal footer = {false} width = {1000} title="Categories" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
               <div className = 'row'>
               {
           categories.map(cat => {
               return(
                 <>
                   {
                     cat.children.map(subCat => {
                       return(
                         <>
                          {
                            subCat.children.map(childCat => {
                              return(
                                <div className = 'col-md-3 mt-2'>
                                <Checkbox 
                                onChange ={(e) => {onChangeCatBox(childCat._id)}}>
                                {childCat.name} 
                                </Checkbox>
                                </div>

                              )
                            })
                          }
                         </>
                        

                       )
                     })
                   }
                 </>
               )
           })
         }
               
               </div>
          </Modal>
           
            </div> 
            
          <div>
          
            </div> 
        <p style = {{borderTop: '.1px solid #eaeaec', paddingLeft: '0px', marginLeft: '0px', marginTop: '8px'}}></p>
         <div className = 'mt-4'>
         <h4>Brands</h4>
           {
             brands.map(brand => {
               return(
                 <div className = 'mb-2 pl-4'>
                 <Checkbox onChange ={(e) => {onChangeBrandBox(brand._id)}}>{brand.name}
                  
                 </Checkbox>
                  </div>
               )
             })
           }
         </div>

         <p style = {{borderTop: '.1px solid #eaeaec', paddingLeft: '0px', marginLeft: '0px', marginTop: '8px'}}></p>
         <div className = 'mt-4'>
         <h4>Price Range</h4>
         {
             prices.map(price => {
               return(
                 <div className = 'mb-2 pl-4'>
                 <Checkbox onChange ={(e) => {onChangePriceRange(price._id)}}>
                      {price.priceRange}
                 </Checkbox>
                  </div>
               )
             })
           }
         </div>

        </div>

       <div className = 'col-md-9 col-lg-9 pt-4'>
       <div className = 'row g-5 g-2 pl-2'>
         {

      loading 
          ?
          <div className = 'text-center fixed-top' style = {{marginTop: '50vh'}}>
          <Spin indicator={antIcon} />
          </div>

          :

         products.map((product) => {
              return(
               <div className = 'col-md-4 col-lg-3' style = {{width: '254px'}}>
               <div className="card border-0"> 
                      <> 
                      <Link to = {'/product/' + product._id}>
                        {
                        prodId !== product._id
                         &&
                        <img 
                        onMouseEnter = {() => setProdId(product._id)} 
                        src = {product.productPictures[0].img} 
                        className = 'img-responsive img-fluid' 
                        style = {{height: '310px', width: '101%'}}  
                        alt = {product.title}
                        />
                        }
                        </Link>
                        {
                        prodId === product._id &&
                         <div onMouseLeave = {() => setProdId(1)}>
                           <Link to = {'/product/' + product._id}> 
                        <Carousel autoplaySpeed = {800} autoplay pauseOnHover = {false} pauseOnFocus = {false}>
                         {
                          product.productPictures.map(images => {
                            
                            return(
                              <div>
                                <img src = {images.img} className = 'img-responsive img-fluid' style = {{height: '310px', width: '101%'}}  alt = {product.title}/>
                              </div>
                            )
                          })
                        }  
                       </Carousel>
                          </Link>
                       <div style = {{paddingTop: '32px'}}>
                       <button onClick = {() => isAuthenticated() ? handleWishlist(product) : saveProductToWishlist(product)} className = 'btn' style = {{width: '100%', border: '1px solid #d0d1d8'}}><HeartOutlined style = {{fontSize: '19px'}}/>&nbsp; <span className = 'mt-4'> Add to wishlist</span></button>
                         <span className = 'pr-1'>Sizes: </span>

                         {
                           product.productSizes.map(size => {
                             return(
                               <span className = 'text-muted'>{size.size},&nbsp;</span>
                             )
                           })
                         }
                       </div>
                       </div>
                   }
                      </>           
              <Link to = {'/product/' + product._id}>
            <div className="card-body pt-2">
                  <div>
                    {
                      prodId !== product._id &&
                      <>
                      <h6 className="card-title" style = {{overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap'}}>{product.title}</h6>
                       <p className="card-title" style = {{overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap'}}>{product.subTitle}</p>
                       </>
                    }
                  
                  <h6 className="card-title">Rs. {product.price}</h6>
                  </div>
              </div>
              </Link>        
              </div>

               </div>   
             
           )
         })
       }
       </div>
       </div>
       </div>
  </div>
  </div>
  </UserLayout>
  )
}
