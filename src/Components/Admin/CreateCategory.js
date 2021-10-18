import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css';
import axios from 'axios';
import swal from 'sweetalert';
import { Modal, Button, Select } from 'antd';
import { PlusOutlined  } from '@ant-design/icons';
const { Option } = Select;


export const CreateCategory = () => {


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isMainCatModalVisible, setIsMainCatModalVisible] = useState(false);
    const [isModalVisibles, setIsModalVisibles] = useState(false);
    const [selectCat, setSelectCat] = useState('');
    const [selectSubCat, setSelectSubCat] = useState('');
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState('');
    const [token, setToken] = useState('');



    /*********************************************** States ******************************************/
    const [catData, setCatData] = useState({
        rootMainCategory: '',
        mainCategory: '',
        subCategory: '',
        childSubCategory: '',
        subCategoryOfChildSubCategory: '',
          });
  
    const {rootMainCategory, subCategory, childSubCategory } = catData;
   

    

    /****************************************************Get Categories *************************************/
        const fetchCategories = () => {
              axios.get('/api/categories').then(data => {
              setCategories(data.data);
                  })
           }
              
         useEffect(() => {
              
                  fetchCategories();
                  setToken(localStorage.getItem('token'));
              
              
                  return () => {
              
                  }
           }, []);

    
    
    /***********************************************  onChange Events ******************************************/
      const handleCatChange = (e) => {
            setCatData({
                ...catData,
                [e.target.name]: e.target.value
            });
        }

      function handleChange(value) {
            setSelectCat(value);
          }

      function handleChildSubCatChange(value) {
            setSelectSubCat(value);
          }   

          const handleImageChange = (e) => {
            setFile(
               e.target.files[0]
            );
           }

          
    /*********************************************** Submit Events ******************************************/
    const submitRootMainCatHandler = (e) => {
      e.preventDefault();
      axios.post('/api/categories/main-category/create', {name: rootMainCategory.toUpperCase()}, {headers : {
        'authorization' : 'Bearer ' + token
      }}).then( response => {
          if(response.status === 200) {
              swal('Good Job', response.data , 'success');
          } else if(response.status === 201) {
              swal('Sorry', response.data.errorMessage , 'error');
          }
          else {
              swal('Error','Error in Creating Main Category', 'error');
          }
      })
  }
    
    const submitSubCatHandler = (e) => {
        e.preventDefault();
        let data = new FormData();
        data.append('parentId', selectCat);
        data.append('name', subCategory.toUpperCase());
        data.append('file', file);

        const submitData = axios.post('/api/categories/sub-category/create', data, {headers : {
          'authorization' : 'Bearer ' + token
        }}).then( response => {
            if(response.status === 200) {
                swal('Good Job', response.data , 'success');
            } else if(response.status === 201) {
                swal('Sorry', response.data.errorMessage , 'error');
            }
            else {
                swal('Error','Error in Creating New Category', 'error');
            }
        })
    }



  
    const handleChildSubCatSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('parentId', selectSubCat);
        formData.append('name', childSubCategory.toUpperCase());
        formData.append('file', file);

        axios.post('/api/categories/child-sub-category/create', formData, {headers : {
          'authorization' : 'Bearer ' + token
        }}).then( response => {
            if(response.status === 200) {
                swal('Good Job', response.data.successMessage , 'success');
            } else if(response.status === 201) {
                swal('Sorry', response.data.errorMessage , 'error')
            }
             else  {
                swal('Error','error in Creating Category', 'error');
            } 
        })
    }
  

  
    /*******************************Main Category***********************************/
    const showCatModal = () => {
        setIsMainCatModalVisible(true);
      };
      const handleCatOk = () => {
        setIsMainCatModalVisible(false);
      };
      const handleCatCancel = () => {
        setIsMainCatModalVisible(false);
      };

      /*******************************Sub-Category *******************************/
    

    const showModal = () => {
        setIsModalVisible(true);
      };
      const handleOk = () => {
        setIsModalVisible(false);
      };
      const handleCancel = () => {
        setIsModalVisible(false);
      };

      /**************************************************Child Sub-Category ******************/
     
      const showModals = () => {
        setIsModalVisibles(true);
      };
     
     
      const handleOks = () => {
        setIsModalVisibles(false);
      };
    
     
      const handleCancels = () => {
        setIsModalVisibles(false);
      };
        
     
    /*********************************************** Main Forms ******************************************/
  
    return (
        <>
        <div className = 'text-center pb-2'>
        <span className = 'mr-2'>
         <Button type="primary" size = 'medium' icon={ <PlusOutlined />} onClick = {showCatModal} >
              <span className = 'pb-2'>Create a Main Category</span>
            </Button>
         
          <Modal footer = {false} title="Main Category" visible={isMainCatModalVisible} onOk={handleCatOk} onCancel={handleCatCancel}>
            <form onSubmit={submitRootMainCatHandler} className = 'text-center'>
            <h4 className = 'mb-4'>Create Main Category</h4>
            <div className="form-group" style = {{paddingLeft: '62px'}}>
                    <input type="text" className="form-control mb-2" id = 'rootMainCategory' value = {rootMainCategory} name = 'rootMainCategory' placeholder="Enter Your Main Category" onChange = {handleCatChange} />
                </div>
            <button type="submit" className="btn btn-outline-danger mt-4">Submit</button>
            </form>
            </Modal>
         </span>


         <span className = 'mr-2'>
         <Button type="primary" size = 'medium' icon={ <PlusOutlined />} onClick = {showModal} >
              <span className = 'pb-2'>Create Sub-Category</span>
            </Button>
         
          <Modal footer = {false} title="Sub-Category" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <form onSubmit={submitSubCatHandler} className = 'text-center'>
            <h4 className = 'mb-5'>Create Sub-Category</h4>
            <Select defaultValue="Please Select..." style={{ width: 347 }} onChange={handleChange}>
              {
                categories.map(cat => {
                  return(
                    <Option key = {cat._id} value={cat._id}>{cat.name}</Option>

                  )
                })
              }
                </Select>
                <div className="form-group mt-4" style = {{paddingLeft: '62px'}}>
                    <input type="text" className="form-control mb-2" id = 'SubCategory' value = {subCategory} name = 'subCategory' placeholder="Enter Your Sub-Category Name" onChange = {handleCatChange} />
                </div>
                <div className = 'my-3'>
                  <input type="file" name = 'file' multiple onChange = {handleImageChange}/>
                  </div>  
            <button type="submit" className="btn btn-outline-danger mt-4">Submit</button>
            </form>
            </Modal>
         </span>


         <span>
        
         <Button type="primary" size = 'medium' icon={ <PlusOutlined />} onClick = {showModals} >
                Create a Child Sub-Category
            </Button>
            <Modal footer = {false} title="Child Sub-Category" visible={isModalVisibles} onOk={handleOks} onCancel={handleCancels}>     
            <form onSubmit = {handleChildSubCatSubmit} className = 'text-center'>
            <h4 className = 'mb-5'>Create a Child Sub-Category</h4>
            <Select defaultValue="Please Select..." style={{ width: 347 }} onChange={handleChildSubCatChange}>
              {
                categories.map(cat => {
                  return(
                    <>
                    <Option key = {cat._id} disabled className = 'text-danger'>{cat.name}</Option>
                    {
                      cat.children.length > 0 ?
                      cat.children.map(subCat => {
                        return(
                          <Option key = {subCat._id} value={subCat._id} style = {{marginLeft: '28px'}}>{subCat.name}</Option>
                        )
                      }) 
                      :
                      null
                    }
                    </>
                  )
                })
              }
                </Select>
                <div className="form-group mt-4" style = {{paddingLeft: '62px'}}> 
                    <input type="text" className="form-control mb-2 border" id = 'childSubCategory' name = 'childSubCategory' value = {childSubCategory} placeholder="Enter Relevant Child Sub-Category" onChange = {handleCatChange} />
                </div>

                <div className = 'my-3'>
                  <input type="file" name = 'file' multiple onChange = {handleImageChange}/>
                  </div>  
            <button type="submit" className="btn btn-outline-danger mt-4">Submit</button>
            </form>
            </Modal>
           
            </span>
            </div>

        </>
    )
  }
