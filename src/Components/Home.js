import React, { useEffect, useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { UserLayout } from './Layouts/UserLayout';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { Carousel, Drawer } from 'antd';
import { CaretDownOutlined, CaretUpOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const Home = (props) => {
  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

    const fetchBrands = async() => {
      await axios.get('/api/categories/brands').then(res => {
          setBrands(res.data.brands);
      })
  }

  const onClose = () => {
    setVisible(false);
  }

  const fetchImages = async() => {
      await axios.get('/api/home/get').then(res => {
        if(res.status === 200) {
          setImages(res.data);
        }
      })
  }

  const fetchCategories = () => {
    axios.get('/api/categories').then(data => {
      setCategories(data.data);
    })
  }


  useEffect(() => {
    fetchImages();
    fetchCategories();
    fetchBrands();
    return () => {
      
    }
  }, [])
  return ( 
    <UserLayout navbar>
        <Helmet>
             <title>Myntra | Home</title>
           </Helmet>
       <div className = 'homepage'> 
      <header>
      <Carousel autoplaySpeed = {2000} autoplay>
           {
             images.map( i => {
               return(
                 i.HomeSlider.map(image => {
                   return(
                    <div>
                    <img alt = 'img' src={image.img} style = {{height: '62vh', width: '100vw', marginTop: '36px'}} />
                  </div>
                   )
                 })
               )
             })
           }
        </Carousel>
      </header>
        <div>
          <div className="site-drawer-render-in-current-wrapper fixed-top">
            <Drawer
              placement="right"
              closable={false}
              className = {!visible && 'hide'}
              onClose={onClose}
              visible={visible}
              width = {600}
              getContainer={false}
              style = {{height: '288px',position: 'absolute', top: '35vh', right: '40px'}}
            >
               <button type="primary" id = 'rotate' onClick={() => setVisible(!visible)}>
               FLAT Rs.500 OFF &nbsp; &nbsp; {visible ? <CaretDownOutlined style = {{fontSize: '36px'}}/> : <CaretUpOutlined style = {{fontSize: '36px'}}/>}
              </button>
              <div className = 'drawer-text' style = {{color: '#3e4152'}}>
                 <div className = 'row'>
                    <div className = 'col-md-8' style = {{textAlign: 'justify', marginLeft: '36px', letterSpacing: '0'}}>
                        <p>AVAIL FLAT</p>
                        <p style = {{fontSize: '32px', fontWeight: '700'}}>
                        ₹500 OFF
                         <p> + FREE DELIVERY </p>
                        </p>
                        <div>
                          <span style = {{fontSize: '15px', fontWeight: '500'}}>Coupan Code:</span> &nbsp;&nbsp;
                          <span style = {{fontSize: '18px', fontWeight: '700'}}>MYNTRA50</span>
                          <button onClick = {() => props.history.push('/signup')} className = 'home-drawer-btn'>Sign Up Now <RightOutlined /> </button>
                          <p className = 'text-muted' style = {{fontSize: '10px', fontFamily: 'Whitney', fontWeight: '100'}}>Applicable on your first order</p>
                        </div>
                    </div>
                    <div className = 'col-md-2'>
                    <img width = '150' height = '120' class="FreeShippingBanner-imageContent" src="https://assets.myntassets.com/assets/images/2021/4/14/48698ccb-859e-45d9-88ee-7138fb2fb2a51618423390943-Desktop-Sidebar-Coupon.png" alt=""/>
                    </div>
                 </div>
              </div>
            </Drawer>
          </div>
        </div>

      <div style = {{marginTop: '197px'}}>
      <p className = 'mb-1 ml-3 text-center' style = {{color: 'orangered', fontFamily: 'Newsreader , serif'}}>Most Loved Brands</p>  
        <div className = 'row mx-4'>
          {
            brands && brands.map(brand => {
              return(
                brand.img !==  "null" ?
                <div className = 'col-md-3 mt-4'>
                <Link to = {'/products/' + brand._id} className='child'>
                <img alt = 'img' src = {brand.img} className = 'w-100'/>
                </Link>
               </div>

                  :

                  null
              )
            })
          }
        </div>
      </div>

      
      <div>
        <p className = 'mb-1 ml-3 mt-5 text-center' style = {{color: 'orangered', fontFamily: 'Newsreader , serif'}}>Shop By Category</p>  
            <div className = 'row mx-4 mt-0 pt-0'>
            {
                      categories.map(data => {
                        return (                                     
                            data.children.map(sub => {
                              console.log(sub.children[0]);
                                return (
                                  <> 
                                 {
                                   sub.children.length > 0 && sub.children[0].img !==  "null" ?
                                   <div className = 'col-md-3'> 
                                   <Link to = {'/products/' + sub.children[0]._id} className='child'>
                                     <img src = {sub.children[0].img} alt = 'img' className = 'w-100 h-100'></img>
                                   </Link>                                          
                                   </div>   
                                     :
                                   null
                                 }  
                                </>
                                   
                                )
                              })
                 
                        )
                      })

                    
                    }
            </div>
        </div>
       </div>   
    </UserLayout>
  )
}

