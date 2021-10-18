import { Button, Carousel, Image, Input, Spin } from 'antd';
import Search from 'antd/lib/transfer/search';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import { listProducts, wishlistProducts } from './Redux/Redux';
import { HeartOutlined, ShoppingCartOutlined, LoadingOutlined, SearchOutlined} from '@ant-design/icons';
import { isAuthenticated } from './auth';
import { UserLayout } from './Layouts/UserLayout';
import { Helmet } from 'react-helmet';
import { Comments } from './Comments';
import { Link } from 'react-router-dom';

export const Product = (props) => {
    const productId = props.match.params.id;
    let userId = isAuthenticated()._id;
    const [product, setProduct] = useState({});
    const [productSizes, setProductSizes] = useState([]);
    const [sizeToShop, setSizeToShop] = useState('');
    const [pic, setPic] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [productPictures, setProductPictures] = useState([]);
    const [token, setToken] = useState('');
    const [commentsList, setCommentsList] = useState([]);
    const [category, setCategory] = useState('');
    const [products, setProducts] = useState([]);
  
    const getProduct = async() => {    
        setLoading(true);    
        await axios.get(`/api/products/product/${productId}`).then(res => {
            setProduct(res.data);
            setProductSizes(res.data.productSizes);
            setProductPictures(res.data.productPictures);
            getRelatedProducts(res.data.category);
            setPic(res.data.productPictures[0].img);
            setCategory(res.data.category);
            setTitle('Myntra | ' + res.data.title);
            setLoading(false);
        });

    }

   

   
    useEffect(() => {
         
        getProduct();
        getComment();
        setToken(localStorage.getItem('token'));
       
        return () => {
            
        }
    }, [productId, userId]);

    const getRelatedProducts = (category) => {
           axios.get(`/api/products/get/related/${category._id}`).then(res => {
               const getAll = res.data.products.filter(prod => prod._id !== productId);
               setProducts(getAll);

           })
    }

    const dispatch = useDispatch();
    const handleCart = async () => {
        setLoading(true)
        let data = new FormData();
        data.append('title', product.title);
        data.append('subTitle', product.subTitle);
        data.append('price', product.price);
        data.append('productId', productId);
        data.append('userId', userId);
        data.append('offer', product.offer);
        data.append('offPrice', product.offPrice);
        data.append('priceAfterOff', product.priceAfterOff);
        data.append('coupan', product.coupan);
        data.append('coupanDiscount', product.coupanDiscount);
        data.append('coupanDiscountAmount', '0');
        data.append('qty', '1');
        data.append('coupanStatus', 'false');
        data.append('cat', product.category.name);
        data.append('brand', product.brand.name);
        data.append('image', product.productPictures[0].img)
        data.append('sizeToShop', sizeToShop);
        for(let sizes of productSizes) {
          data.append('sizes', sizes.size);
         }
        
        await axios.post('/api/cart/post', data).then(res => {
            if(res.status === 200) {
                swal('success', 'Product add to Bag successfully', 'success');
                dispatch(listProducts(userId));
                setLoading(false);
            
            }
            else {
            
                swal('Error', res.data.errorMessage , 'info');
            } 
            
            
        }) 

       
    }

    const handleWishlist = async() => {
        setLoading(true);
        let data = new FormData();
        data.append('title', product.title);
        data.append('subTitle', product.subTitle);
        data.append('price', product.price);
        data.append('productId', productId);
        data.append('userId', userId);
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
        data.append('sizeToShop', sizeToShop);
        for(let sizes of productSizes) {
          data.append('sizes', sizes.size);
         }
        await axios.post('/api/wishlist/post', data).then(res => {
            if(res.status === 200) {
                swal('success', 'Product add to Wishlist successfully', 'success');
                dispatch(wishlistProducts(userId));
                setLoading(false);
            }
            else {
            
                swal('Error', res.data.errorMessage , 'info');
            }            
        })
    }
    

    const saveProductToCart = () => {
        setLoading(true);
        var allEntries = localStorage.getItem("product") && JSON.parse(localStorage.getItem("product")) || [];
        product.productPictures = pic;
        product.qty = '1';
        product.sizeToShop = sizeToShop;
        allEntries.push(product); 
       setLoading(false);
       localStorage.setItem('product', JSON.stringify(allEntries));
       swal('success', 'Product add to Bag successfully', 'success');
    }

    const saveProductToWishlist = () => {
        setLoading(true);
        var allEntries = localStorage.getItem("wishProduct") && JSON.parse(localStorage.getItem("wishProduct")) || [];
        product.productPictures = pic;
        product.qty = '1';
        product.sizeToShop = sizeToShop;
        allEntries.push(product); 
       setLoading(false);
       localStorage.setItem('wishProduct', JSON.stringify(allEntries));
        swal('success', 'Product add to Wishlist successfully', 'success');
        
    }




/********************************************** Comments ******************************************************/
    const getComment = async () => {
        setLoading(true);
        await axios.get(`/api/products/comments/getComments/${productId}`).then(res => {
            setCommentsList(res.data.result);
        })
      }
    

    const updateComponent = (newComment) => {
        setCommentsList(commentsList.concat(newComment));
    }




 /********************************************** Related Products ******************************************************/
 

    const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;
    return (
        <UserLayout navbar>
            {
             loading 
                ?
                <div className = 'text-center fixed-top' style = {{marginTop: '50vh'}}>
                <Spin indicator={antIcon} />
                </div>

                :

             <>   
            <div className = 'row'>
                 <Helmet>
                     <title>{title}</title>
                 </Helmet>
             <div className = 'col-md-7'>
             <div className = 'row'>
             {
                     productPictures.map(pic => {
                         return(
                             <div  key = {pic._id} className = 'col-md-6 mb-4 pl-4'>
                             <Image.PreviewGroup>
                                    <Image
                                    height = {560}
                                    width = {380}
                                     src={pic.img}
                                        />
                                        
                               </Image.PreviewGroup>   
                             </div>
                          
                         )
                     })
                 }
                 
                 </div>
                 <div className = 'ml-5 mt-5'>
                     <h6 className = 'text-center'>Product Reviews ({commentsList.length} Reviews)</h6>
                 <Comments CommentList = {commentsList} productId = {productId} refreshFunction = {updateComponent}/>     
                 </div>
             </div>
             <div className="col-md-5 mt-2 pl-4">
             <div className = 'ml-3'>
                <h4>
                    {product.title}
                </h4>
                <h5 className = 'text-muted'>
                    {product.subTitle}
                </h5>
                <h5 className = 'mt-2'>
                    Rs. {product.price}  ({product.offer}% Off)
                </h5>
                <h6 style = {{color: '#03a685'}} className = 'font-weight-bold'>
                    Inclusive of all taxes
                </h6>
                
                <div className = 'mt-4'>
                    <h5>Select Size</h5>
                    {
                        productSizes.map(size => {
                            return(
                                <button onClick = {() => setSizeToShop(size.size)} className = 'btn btn-outline-danger mx-2 mb-1' style = {{borderRadius: '180px', border: '2px solid gray', width: '60px', height: '60px'}}>
                                {size.size}
                                </button>
                            )
                        })
                    }
                    
                </div>
                <div className = 'product-btn mt-4'>
                    <Button onClick = {() => {isAuthenticated () ? sizeToShop ? handleCart() : swal('Note', 'Please Select Size first', 'info') : saveProductToCart()}} size = 'large' icon = {<ShoppingCartOutlined style={{ fontSize: '26px'}} />}>
                        Add to Bag
                    </Button>
                    <Button onClick = {() => {isAuthenticated () ? handleWishlist() : saveProductToWishlist()}} className = 'product-btn-wishlist ml-2' icon = {<HeartOutlined style={{ fontSize: '21px'}}/>}>
                        Add to Wishlist
                    </Button>
                </div>
                <div className = 'delivery'>
                    <h4>Delivery Options <i className="fas fa-truck ml-1"></i></h4>
                    <Input prefix = {<SearchOutlined/>} size = 'medium' className = 'w-75' placeholder="Enter Your Area Code"  style={{ width: 200 }} />
                    <p className = 'mt-4'>100% Original Products</p>
                    <p>Free Delivery on order above Rs. 799</p>
                    <p>Pay on delivery might be available</p>
                    <p>Easy 30 days returns and exchanges</p>
                    <p>Try & Buy might be available</p>
                </div>
                <div>
                    <p>
                        <div dangerouslySetInnerHTML = {{__html: product.description}}></div>
                    </p>
                </div>             
                </div>         
          </div>
        </div>

          <div className = 'row mt-2 pt-4' style = {{borderTop: '1px solid #d4d5d9', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <h5 className = 'mb-4 text-center'>Similar Products</h5>
              
        { products.map(product => {
              return(
                <div className = 'col-md-3 col-lg-2 mt-2 mx-2' style = {{width: '254px'}}>
               <Link to = {'/product/' + product._id}>
               <div className="card border-0">
                      <div>
                        <img src = {product.productPictures[0].img} className = 'img-responsive img-fluid mb-2' style = {{height: '310px', width: '101%'}}   alt = {product.title}/>
                      </div>
            <div class="card-body pt-0">
                  <div>
                  <h6 className="card-title" style = {{overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap'}}>{product.title}</h6>
                    <p className="card-title" style = {{overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap'}}>{product.subTitle}</p>
                  <h6 class="card-title">Rs. {product.price}</h6>
                  </div>
              </div>
              </div>
              </Link>

               </div>           
             
           )
         })
        }
    </div>
      </>
     }
             
            
        </UserLayout>
    )
}
