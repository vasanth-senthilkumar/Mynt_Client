import axios from 'axios';
 import React, { useEffect, useState} from 'react';
 import ReactQuill from 'react-quill';
 import { Layout } from '../Layouts/Layout';
 import '../../index.css'
 import { Input, Select, Spin, TreeSelect } from 'antd';
 import { Badge } from 'antd';
import { DeleteOutlined,  LoadingOutlined } from '@ant-design/icons';
import swal from 'sweetalert';
import Form from 'antd/lib/form/Form';



const { Option } = Select;
const { TreeNode } = TreeSelect;


 export const EditProduct = (props) => {

    const productId = props.match.params.id;
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [color, setColor] = useState([]);
    const [file, setFile] = useState([]);
    const [image, setImage] = useState([]);
    const [categories, setCategories] = useState([]);
    const [token, setToken] = useState('');
    const [brands, setBrands] = useState([]);
    const [productSizes, setProductSizes] = useState([]);
    const [brandId, setBrandId] = useState('');
    const [cat, setCat] = useState('');
    const [success, setSuccess] = useState(false);
    const [priceId, setPriceId] = useState('');
    const [prices, setPrices] = useState([]);
    const [priceRange, setPriceRange] = useState('');
    const [visible, setVisible] = useState(false);
    const [product, setProduct] = useState({
      title: '',
      subTitle: '',
      price: '',
      offer: '',
    });


    const { title, subTitle, price, offer} = product;
    
 /********************************************* Modal *******************************************************/    
  
              const handleEditProductChange = (e) => {
                setProduct({
                    ...product,
                    [e.target.name] : e.target.value
                });
              }


/********************************************* OnChange *******************************************************/    
                const quillChange = (value) => {
                  setDescription(value);
                }
                

                const onCatChange = value => {
                    setCategoryId(value);
                };

                const handleSizeChange = (value) => {
                  setSizes(value);        
                }
                const handleColorChange = (value) => {
                  setColors(value);        
                }
          
                const handleBrandChange = (value) => {
                    setBrandId(
                       value

                    );
                }

                const handlePriceRangeChange = (value) => {
                  setPriceId(
                    value
          
                  );
                 }


/************************************************** Image Change ***********************************************/   
              const handleImageChange = (e) => { 
                  setFile([
                    ...file,
                    e.target.files[0]
          
                  ])
                }

              const handleRemovePresentImage = name => {
                  setImage(image => image.filter(item => item.img !== name.img));
              }
    
              const handleRemoveUploadedImage = name => {
                setFile(file => file.filter(item => item.name !== name.name))
            }

        
 /************************************************** Get Product ***********************************************/   
            const editHandler = () => {
                axios.get(`/api/products/${productId}`).then(res => {
                setProduct(res.data.findProduct);
                setDescription(res.data.findProduct.description);
                setBrand(res.data.findProduct.brand.name);
                setBrandId(res.data.findProduct.brand._id)
                setPriceRange(res.data.findProduct.priceRange.priceRange)
                setPriceId(res.data.findProduct.priceRange._id)
                setCategory(res.data.findProduct.category.name)
                setCategoryId(res.data.findProduct.category._id)
                setImage(res.data.findProduct.productPictures)
                setProductSizes(res.data.findProduct.productSizes)
                setSizes(res.data.findProduct.productSizes.map( size =>  size.size))
                setColors(res.data.findProduct.productColors.map( color =>  color.color)
                 )
                });

            }     


/****************************************** Get Categories & Brands *******************************************/    
            const fetchCategories =  () => {
                axios.get('/api/categories').then(data => {
                setCategories(data.data);
            })
            }

            const fetchBrands = () => {
                axios.get('/api/categories/brands').then(data => {
                setBrands(data.data.brands);
            })
            }

            const fetchPriceRanges = async() => {
              await axios.get('/api/categories/price-ranges').then(res => {
                  setPrices(res.data.range);
              })
          }
   
        


    
  /***************************************************** useEffect **********************************************/           
            useEffect(() => {
                setToken(localStorage.getItem('token'));
                fetchBrands();
                fetchCategories();
                fetchPriceRanges();
                editHandler();
                
       
       
              return () => {
               
              }
            }, [success]);

            console.log(token);
       


/***************************************************** Submit Event **********************************************/           
     const submitHandler = (e) => {
         e.preventDefault();
         setLoading(true);
         let data = new FormData();
         data.append('title', product.title);
         data.append('subTitle', product.subTitle);
         data.append('description', product.description);
         data.append('price', product.price);
         data.append('offer', product.offer);
         data.append('category', categoryId);
         data.append('brandId', brandId);
         data.append('priceId', priceId);
         for(let size of sizes) {
           data.append('sizes', size);
          }
          for(let col of colors) {
           data.append('colors', col);
          }

          // for(let i = 0; i < image.length; i++) {
          
          //  data.append("images", image[i].img);
          // }
          for(let img of image){
            data.append("images", img.img);
          }
        
            for(let pic of file) {
          data.append('file', pic);
         }
         axios.put(`/api/products/update/${productId}`, data, {headers : {
           'authorization' : 'Bearer ' + token
         }}).then(res => {
             if (res.status === 200) {
              setLoading(false);
             swal('Great!', res.data.successMessage, 'success');
             props.history.push('/admin/get-products');
             }
              else if(res.status === 201) {
                swal('Error', res.data.errorMessage, 'error');
              }
             else {
               swal('Error', res.data.errorMessage, 'error');
             }
           })

     }    
    
     const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;
/***************************************************** Form *******************************************************/              
        return ( 
            <>
             <Layout sidebar>
               {
                   loading 
                   ?
                   <div className = 'text-center fixed-top' style = {{marginTop: '50vh'}}>
                   <Spin indicator={antIcon} />
                   </div>
             
                   :
            
                <div className = ' edit-form' style = {{paddingLeft: '100px'}}>

                <Form>
                    <h1 className = 'font-weight-bold'>Edit Product</h1><br/>
                   
                    <div>
                        <Input className="form-control" id = 'title' name ='title' value ={product.title} onChange = {handleEditProductChange}></Input><br/><br/>
                    </div>
                    
                    <div>
                     </div>   
                        <Input className="form-control" id = 'subTitle' name ='subTitle' value ={product.subTitle} onChange = {handleEditProductChange}></Input><br/><br/>
                    <div>
                        <Input className="form-control" id = 'price' value ={product.price} name ='price' onChange = {handleEditProductChange}></Input><br/><br/>
                      </div>
                      <div>
                        <Input className="form-control" id = 'offer' value ={product.offer} name ='offer' onChange = {handleEditProductChange}></Input><br/><br/>
                      </div>  
                   
                   <div>
                   
                   <Select 
                   mode = 'tags'
                   style={{ width: '70%', marginTop: '16px', marginBottom: '16px' }}
                   placeholder="Select Size" 
                   onChange={handleSizeChange}
                   value = { 
                      sizes.map(size => size)
                    
                   }
                   >
                    <Option key = 'Baby'>Baby</Option>
                    <Option key = 'XS'>XS</Option>
                    <Option key = 'S'>S</Option>
                    <Option key = 'M'>M</Option>
                    <Option key = 'L'>L</Option>
                    <Option key = 'XL'>XL</Option>
                    <Option key = 'XXL'>XXL</Option>
                   
                  </Select>

                   </div>

                   <div>
                   
                   <Select 
                   mode = 'tags'
                   style={{ width: '70%', marginTop: '16px', marginBottom: '16px' }}
                   placeholder="Select Color" 
                   onChange={handleColorChange}
                   value = { 
                      colors.map(col => col)
                    
                   }
                   >
                    <Option key = 'White'>White</Option>
                    <Option key = 'Black'>Black</Option>
                    <Option key = 'Brown'>Brown</Option>
                    <Option key = 'Red'>Red</Option>
                    <Option key = 'Green'>Green</Option>
                    <Option key = 'Gray'>Gray</Option>
                    <Option key = 'Blue'>Blue</Option>
                  </Select>

                   </div>

                     
                    <Select
                      placeholder="Select Price Change.."
                      onChange={handlePriceRangeChange}
                      value = {priceRange}
                      style={{ width: '70%', marginTop: '16px', marginBottom: '16px' }}
                    > 
                    {
                      prices.map(pri => {
                        return(
                          <Option key = {pri._id}>{pri.priceRange}</Option>

                        )
                      })
                    }
                      
                </Select>
                     
                    <Select
                            className = 'mb-3'
                            style={{ width: '70%', marginTop: '16px', marginBottom: '16px' }}
                            placeholder="Select a Brand"
                            value = {brandId}
                            onChange={handleBrandChange}
                           >
                        {
                          brands.map(bran => {
                            return(
                              <Option key = {bran._id}>{bran.name}</Option>

                            )
                          })
                           
                        }
                          
                    </Select>

                    <TreeSelect
                    className = 'my-4'
                      showSearch
                      style={{ width: '70%', marginTop: '16px', marginBottom: '16px' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      value = {categoryId}
                      allowClear                      
                      treeDefaultExpandAll
                      onChange={onCatChange}
                    >
                     {
                       categories.map(mainCat => {
                         return(
                          <TreeNode value={mainCat._id} title={mainCat.name}>
                            {
                              mainCat.children.map(subCat => {
                                return(
                                  <TreeNode value={subCat._id} title={subCat.name}>
                                    {
                                      subCat.children.map(childCat => {
                                        return(
                                          <TreeNode value={childCat._id} title={childCat.name} />

                                        )
                                      })
                                    }
                                  </TreeNode>
                                )

                              })
                            }
                          </TreeNode>
                         )
                       })
                     }
                     

                    </TreeSelect>
                    
                    <div className = 'my-4'>
                      <ReactQuill 
                      placeholder = "Product Description" 
                      theme="snow" 
                      value= {description} 
                      onChange={quillChange}
                      style={{ width: '70%', marginTop: '16px', marginBottom: '16px', height: '30vh'}}
                      />

                     </div>

                    
                    
                    <div className = 'files' style={{ width: '70%', marginTop: '106px', marginBottom: '16px', padding: '32px'}}>
                        <div>
                    <input type="file" name = 'file' multiple onChange = {handleImageChange}/>
                     <ul className = 'list-unstyled'>
                     {
                       file.length > 0 ?
                       file.map(pic => {
                         return(
                           <li key = {pic.name}>
                             {pic.name}
                             <a onClick={() =>handleRemoveUploadedImage(pic)}><DeleteOutlined style = {{marginLeft: '10px', color: 'black'}} /> </a>
                           </li>

                         )
                       })
                       :
                       null
                     }
                     </ul>

                        {
                           image.map(pic => {
                             return(
                              <span className = 'mr-4'>
                                <Badge className = 'mt-4 mb-2' count={<a onClick={() =>handleRemovePresentImage(pic)}><DeleteOutlined style = {{marginLeft: '10px'}} /></a>}>
                                <img width = '100' height = '100' src = {pic.img} alt = 'images' className="head-example" />
                              </Badge>
                                </span>
                               
                             )
                           })
                         }
                       
                        </div>
                    </div>
                    <div>
                    <button style={{ width: '70%', marginTop: '16px', marginBottom: '16px' }} onClick = {submitHandler} className = 'btn btn-outline-danger mt-3'> { productId? 'Update': 'Create'}</button> <br/> <br/>
                    </div>
                  

                </Form>             
            </div>  
            
            }

            </Layout>
           
            </>
          
        )
                  
  }
