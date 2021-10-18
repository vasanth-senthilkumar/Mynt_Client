import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Layout } from '../Layouts/Layout';
import swal from 'sweetalert';
import { Badge, Select, Spin } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { CreateCategory } from './CreateCategory';


const { Option } = Select;





export const GetCategory = (props) => {
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(false);
  const [editCategory, setEditCategory] = useState('');
  const [editParentCat, setEditParentCat] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubModalVisible, setIsSubModalVisible] = useState(false);
  const [editedCategory, setEditedCategory] = useState('');
  const [editCatId, setEditCatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState('');
   const [image, setImage] = useState('');
   const [token, setToken] = useState('');

  const fetchCategories = () => {
     axios.get('/api/categories').then(data => {
       if(data.status === 200) {
      setCategories(data.data);
       }
      else {
            console.log('error');
      }   

      })
        }


  useEffect(() => {
    setToken(localStorage.getItem('token'));
    return () => {
      
    }
  }, []);

  useEffect(() => {

    fetchCategories();


    return () => {

    }
  }, [success]);

  /********************************************************Editing Categories******************************/
    const getEditCatHandler = (editId) => {
      setLoading(true);
      setEditCatId(editId);
      axios.get(`/api/categories/edit/${editId}`).then(res => {
          if(res.status === 200) {
            if(res.data.parentCat){
              setEditCategory(res.data.category.name);
              setEditParentCat(res.data.parentCat.name);
              setImage(res.data.category.img);
              setLoading(false);
            } else {
              setEditCategory(res.data.category.name);
              setImage(res.data.category.img)
            }
          } else {
            console.log('error')
          }
      });
       

    }

    const editHandler = (e) => {
      e.preventDefault();
      let data = new FormData();
      data.append('cat', editCategory);
      data.append('image', image);
      data.append('file', file);

      axios.put(`/api/categories/update/${editCatId}`, data, {headers : {
        'authorization' : 'Bearer ' + token
      }}).then(res => {
            setSuccess(true);
            swal('Good Job!', res.data.successMessage, 'success');
            setSuccess(false);
          })
    }

  /********************************************************Deleting Categories******************************/

  const deleteHandler = (deleteId) => {
    axios.delete(`/api/categories/delete/${deleteId}`, {headers : {
      'authorization' : 'Bearer ' + token
    }}).then(res => {
      setSuccess(true);
      swal('Good Job!', res.data.successMessage, 'success');
      setSuccess(false);
    })
  }


    /********************************************************Editing Categories******************************/

      const handleCatChange = (e) => {
        setEditCategory(e.target.value);
    }
    const handleImageChange = (e) => {
      setFile(
        e.target.files[0]
      );
    }

    const handleRemovePresentImage = name => {
      setImage(null);
  }

  const showModal = () => {
    setIsModalVisible(true);
  };
  
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showSubModal = () => {
    setIsSubModalVisible(true);
  };
  const handleSubCancel = () => {
    setIsSubModalVisible(false);
  };



  const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;


  return (
    <Layout sidebar>
      <div className='text-center' >
        <div className = 'float-right mt-4'>
       <CreateCategory/>
       </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Main Categories</th>
              <th scope="col">Actions</th>
              <th scope="col">Sub-Categories</th>
            </tr>
          </thead>
          <tbody>

            {
              categories.map((cat, index) => {
                return (
                  <>
                  <tr key={cat._id} style={{ borderBottom: '1px solid black' }}>
                  

                    <th>{index+ 1}</th>
                    <th scope="col">{cat.name}</th>
                    <th>
                      <Link className='btn' style={{ textDecoration: 'none' }} onClick = {() => {getEditCatHandler(cat._id); showSubModal()}}><EditOutlined /></Link>
                                   {
                                     cat.children.length === 0 ?
                                     <button className='btn' onClick= {() => deleteHandler(cat._id)}><DeleteOutlined /></button>
                                          :
                                          null

                                   }
                            
                    </th>
                    <table className="table subCat-table">
                      <tbody>

                        {
                          cat.children.length > 0 ?
                            cat.children.map((subCat, index) => {
                              return (
                                  
                                <tr key={subCat._id}>
                                  <th>{index+ 1}</th>
                                  <th>{subCat.name}</th>
                                  <th>

                                    
                                    <Link className='btn' style={{ textDecoration: 'none' }} onClick = {() => {getEditCatHandler(subCat._id); showModal() }}><EditOutlined /></Link>
                                          {
                                            subCat.children.length === 0 ?
                                            <button className='btn' onClick= {() => deleteHandler(subCat._id)}><DeleteOutlined /></button>
                                                :
                                                null

                                          }

                                  </th>
                                  <table className = 'table subCat-table'>
                                    <tbody>
                                  {
                                    subCat.children.length > 0 ? 
                                    subCat.children.map((child, index) => {
                                      return(
                                         <tr key = {child._id}>
                                          <th>{index+ 1}</th>
                                           <th>{child.name}</th>
                                           <th>
                                           <button className='btn' style={{ textDecoration: 'none' }} onClick = {() => {getEditCatHandler(child._id); showModal()}}><EditOutlined /></button>
                                            <Modal footer = {false} title="Edit Categories" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>     
                                              <form  className = 'text-center' onSubmit = {editHandler}>
                                              <h4 className = 'mb-5'>Edit Your Category</h4>
                                                <input disabled value={editParentCat} style={{ width: 347 }}>
                                                  </input>
                                                  <div className="form-group mt-4" style = {{paddingLeft: '62px'}}> 
                                                      <input type="text" className="form-control mb-2 border" id = 'editedCategory' name = 'editedCategory' value = {editCategory}  onChange = {handleCatChange} />
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

                                              <Modal footer = {false} title="Edit Categories" visible={isSubModalVisible} onCancel={handleSubCancel}>     
                                              <form  className = 'text-center' onSubmit = {editHandler}>
                                              <h4 className = 'mb-5'>Edit Your Category</h4>
                                                  <div className="form-group mt-4" style = {{paddingLeft: '62px'}}> 
                                                      <input type="text" className="form-control mb-2 border" id = 'editedCategory' name = 'editedCategory' value = {editCategory}  onChange = {handleCatChange} />
                                                  </div> 
                                                  <div className = 'my-3'>
                                                  <input type="file" name = 'file' multiple onChange = {handleImageChange}/>
                                                  </div>
                                                  <div>
                                                  <Badge className = 'mt-4 mb-2' count={<a onClick={() =>handleRemovePresentImage(editCategory.img)}><DeleteOutlined style = {{marginLeft: '10px'}} /></a>}>
                                                  <img width = '100' height = '100' src = {image} alt = 'images' className="head-example" />
                                                </Badge>
                                                </div> 
                                                <button type="submit" className="btn btn-outline-danger mt-4">Submit</button>
                                              </form>
                                              </Modal>
                                        <button className='btn' onClick= {() => deleteHandler(child._id)}><DeleteOutlined /></button>
                                             
                                           </th>
                                         </tr>

                                      )

                                    }) :
                                    null
                                  }
                                  </tbody>
                                  </table>
                                  
                                </tr>
                               


                              )
                            }) : null
                        }
                      </tbody>
                      

                    </table>
                    
                  
                  
                  </tr>
                
                  </>
                  

                )
              })
            }

          </tbody>
        </table>






      </div>
    </Layout>
  )
}
