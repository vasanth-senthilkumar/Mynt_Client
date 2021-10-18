import { Badge, Button } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert'
import { CreateBrand } from './createBrand'
import { Layout } from '../Layouts/Layout'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';


export const GetBrands = () => {
    const [brands, setBrands] = useState([]);
    const [getBrand, setGetBrand] = useState('');
    const [editBrandId, setEditBrandId] = useState('');
    const [success, setSuccess] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [file, setFile] = useState('');
    const [image, setImage] = useState('');
    const [token, setToken] = useState('');

    
    useEffect(() => {
        fetchBrands();
        setToken(localStorage.getItem('token'));
        return () => {
            
        }
    }, [success]);


/**************************************************On Change ***********************************************/
    
  const handleBrandChange = (e) => {
        setGetBrand(
            e.target.value
        )
    }

    const handleImageChange = (e) => {
      setFile(
         e.target.files[0]
      );
     }

     const handleRemovePresentImage = name => {
      setImage(null);
  }


/**************************************************On Submit ***********************************************/
    const submitHandler = (e) => {
        e.preventDefault();
        let data = new FormData();
        data.append('name', getBrand.toUpperCase());
        data.append('file', file);
        data.append('image', image);
        axios.put(`/api/categories/brands/update/${editBrandId}`, data, {headers : {
          'authorization' : 'Bearer ' + token
        }}).then(res => {
          if(res.status === 200) {
              setSuccess(true);
          swal('Great', res.data.successMessage, 'success');
          setSuccess(false);
            }
          else if(res.status === 201) {
            swal('Duplicate Error', res.data.errorMessage, 'error');
          }
          else {
            swal('Error', 'Brand not created. Please try again', 'error');
          }
        })
      }


/************************************************** Modal ***********************************************/
      const showModal = () => {
        setIsModalVisible(true);
      };
    
      const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };

      
    /************************************************** Fetch Brands ***********************************************/
         const fetchBrands = async() => {
                await axios.get('/api/categories/brands').then(res => {
                    setBrands(res.data.brands);
                })
            }

          

  const editHandler = (brandId) => {
      setEditBrandId(brandId);
       axios.get(`/api/categories/brands/${brandId}`).then(res => {
           setSuccess(true);
           setGetBrand(res.data.brand.name);
           setImage(res.data.brand.img);
           setSuccess(false);
       })

  }
  
  const deleteHandler = async (brandId) => {
      await axios.delete(`/api/categories/brands/delete/${brandId}`, {headers : {
        'authorization' : 'Bearer ' + token
      }}).then(res => {
        if(res.status === 200) {
            setSuccess(true);
            swal('Great', res.data.successMessage, 'success');
            setSuccess(false)
         } else {
             swal('Error', 'Unable to delete brand. Please try again');
         }
      })
  }


  
    return (
        <Layout sidebar>
         <h3 className = 'text-center'>Brands</h3>
         <div className = 'float-right mb-3'>
             <CreateBrand/>
         </div>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                 {
                   brands.map((brand, index) => {
                       return(
                         <>
                        <tr key = {brand._id}>
                        <th>{index + 1}</th>    
                        <td>{brand.name}</td>
                        <button className='btn' style={{ textDecoration: 'none' }} onClick = {() => {editHandler(brand._id); showModal()}}><EditOutlined /></button>  &nbsp;
                        
                        <button className='btn'><DeleteOutlined onClick = {() => deleteHandler(brand._id)}/></button>
                        </tr>
                        </>
                       )
                   })
               }
               <Modal title="Edit Brand" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>     
                                              <form  className = 'text-center' onSubmit = {submitHandler}>
                                              <h4 className = 'mb-5'>Edit Your Brand</h4>
                                           
                                                  <div className="form-group mt-4" style = {{paddingLeft: '62px'}}> 
                                                      <input type="text" className="form-control mb-2 border" id = 'editedBrand' name = 'editedBrand' onChange = {handleBrandChange} value = {getBrand}   />
                                                  </div> 
                                                  <div className = 'my-3'>
                                                    <input type="file" name = 'file' multiple onChange = {handleImageChange}/>
                                                    </div>  
                                                    <div>
                                                    <Badge className = 'mt-4 mb-2' count={<a onClick={() =>handleRemovePresentImage(image)}><DeleteOutlined style = {{marginLeft: '10px'}} /></a>}>
                                                    <img width = '100' height = '100' src = {image} alt = 'images' className="head-example" />
                                                  </Badge>
                                                    </div>  
                                             
                                              <button type="submit" className="btn btn-outline-danger mt-4">Submit</button>
                                              </form>
                                              </Modal>
                
            </tbody>
            </table>
        </Layout>
    )
}
