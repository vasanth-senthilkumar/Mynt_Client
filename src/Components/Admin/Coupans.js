import { Button, Input, TreeSelect } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import { Layout } from '../Layouts/Layout'
import {EditOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';


const { TreeNode } = TreeSelect;




export const Coupans = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
    const [coupanCode, setCoupanCode] = useState('');
    const [coupans, setCoupans] = useState([]);
    const [catId, setCatId] = useState('');
    const [coupan, setCoupan] = useState({});
    const [categories, setCategories] = useState([]);
    const [coupanId, setCoupanId] = useState('');
    const [coupanDiscount, setCoupanDiscount] = useState('');
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState('');



     useEffect(() => {

          getCoupans();
          fetchCategories();
          setToken(localStorage.getItem('token'));

       return () => {
         
       }
     }, [success]);

      

        
       
/************************************************************************************************************* 
                                             Fetch Requests 
*************************************************************************************************************/
        const getCoupans = async () => {
              await axios.get('/api/coupan/get').then(res => {
                setCoupans(res.data);
              })
                }

        const getCoupanById = async (id) => {
                setCoupanId(id);
                await axios.get(`/api/coupan/get/${id}`).then(res => {
                setCoupan(res.data);
                setCoupanCode(res.data.coupan);
                setCoupanDiscount(res.data.coupanDiscount);
              })
              }

        const fetchCategories = () => {
                 axios.get('/api/categories').then(data => {
                  setCategories(data.data);
                })
                  }


/************************************************************************************************************* 
                                             Creating Coupans 
*************************************************************************************************************/
                  const showModal = () => {
                    setIsModalVisible(true);
                    // products.map(prod => {
                    //   prodIds.push(prod._id);
                    // })
                  };

                  const handleOk = () => {
                    setIsModalVisible(false);
                  };

                  const handleCancel = () => {
                    setIsModalVisible(false);
                  };        


                  const submitHandler = async (e) => {
                            e.preventDefault();
                            let data = new FormData();
                            data.append('coupan', coupanCode);
                            data.append('coupanDiscount', coupanDiscount);
                            await axios.post('/api/coupan/post', data, {headers : {
                              'authorization' : 'Bearer ' + token
                            }}).then(res => {
                              if(res.status === 200) {
                                setSuccess(true);
                                swal('Great!', res.data.successMessage, 'success');
                                setSuccess(false);
                              } else {
                                swal('Sorry!', 'Coupan could not be added. Please Try Again', 'error');
                              }
                            })

                      }


 
                      

/************************************************************************************************************* 
                                             Editing Coupans 
*************************************************************************************************************/         
                  const showEditModal = () => {
                    setIsEditModalVisible(true);
                  };

                  const handleEditCancel = () => {
                    setIsEditModalVisible(false);
                  };                        

                  const submitEditHandler = async (e) => {
                        e.preventDefault();
                        let data = new FormData();
                        data.append('coupan', coupanCode);
                        data.append('coupanDiscount', coupanDiscount);
                        data.append('coupanId', coupan._id);
                        await axios.post('/api/coupan/update', data, {headers : {
                          'authorization' : 'Bearer ' + token
                        }}).then(res => {
                          if(res.status === 200) {
                            setSuccess(true);
                            swal('Great!', res.data.successMessage, 'success');
                            setSuccess(false);
                          } else {
                            swal('Sorry!', 'Coupan could not be added. Please Try Again', 'error');
                          }
                        })

                  }        

/************************************************************************************************************* 
                                             Applying Coupans 
*************************************************************************************************************/
            const handleCatChange = (value) => {
                setCatId(value);
              }

            const showApplyModal = () => {
              setIsApplyModalVisible(true);
            };

            const handleApplyOk = () => {
              setIsApplyModalVisible(false);
            };

            const handleApplyCancel = () => {
              setIsApplyModalVisible(false);
            };

            const handleApplyingCoupan = async () => {
                let data = new FormData();
                data.append('coupanCode', coupanCode);
                data.append('coupanDiscount', coupanDiscount);
                data.append('coupanId', coupanId);
                await axios.post(`/api/coupan/apply/${catId}`, data,  {headers : {
                  'authorization' : 'Bearer ' + token
                }}).then(res => {
                  if(res.status === 200) {
                  swal('Great!', res.data.successMessage, 'success');
                  } else {
                  swal('Sorry!', 'Coupan could not be added. Please Try Again', 'error');
                  }
                })

             }


/************************************************************************************************************* 
                                             Deleting Coupans 
*************************************************************************************************************/
         const deleteHandler = async(delId) => {
           console.log(delId);
              let data = new FormData();
              data.append('catId', catId);
              await axios.put(`/api/coupan/delete/${delId}`, data, {headers : {
                'authorization' : 'Bearer ' + token
              }}).then(res => {
                if(res.status === 200) {
                  setSuccess(true);
                  swal('Great!', res.data.successMessage, 'success');
                  setSuccess(false);
                  } else {
                  swal('Sorry!', 'Coupan could not be deleted. Please Try Again', 'error');
                  }
              })
         }

  return (
    <Layout sidebar>
      <div className = 'float-right mb-2'>
      <Button icon = {<PlusOutlined/>} type="primary" onClick={showModal}>
        Create a Coupan
      </Button>
      </div>
      <Modal footer = {false} title="Create a Coupan" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
           <form onSubmit = {submitHandler}>
             <Input name = 'coupanCode' onChange = {(e) => setCoupanCode(e.target.value)} placeholder = 'Enter Coupan Code'></Input>
             <Input className = 'mt-2' name = 'coupanDiscount' onChange = {(e) => setCoupanDiscount(e.target.value)} placeholder = 'Enter Discount in %'></Input>
             <div className = 'text-center'>
             <button className = 'btn btn-outline-secondary mt-4' type = 'submit'>Submit</button>
             </div>
           </form>
      </Modal>


{/************************************************************************************************************* 
                                             Displaying Coupans 
*************************************************************************************************************/}                                                                                                       
           <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Coupan</th>
                <th scope="col">Discount</th>
                <th scope="col">Applied On</th>
                <th scope="col">Apply</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                     coupans.map((coup, index) => {
                         return(
                            <tr>
                            <th className = 'pt-4' scope="row">{index + 1}</th>
                            <td className = 'pt-4'>{coup.coupan}</td>
                            <td className = 'pt-4'>{coup.coupanDiscount}%</td>
                            <td className = 'pt-4'>{coup.category && coup.category.name}</td>
                            <td className = 'pt-3'>
                            <Button type = 'primary' onClick = {() => {getCoupanById(coup._id);showApplyModal()}}>Apply</Button>
                            </td>
                            <td className = 'pt-4'>
                              <a className = 'ml-3 pr-3' onClick = {() => {getCoupanById(coup._id); showEditModal()}}><EditOutlined /></a>
                              <DeleteOutlined onClick = {() => {deleteHandler(coup._id); handleCatChange(coup.category)}}/>
                            </td>
                            </tr>
                         )
                     })
                }
                
            </tbody>
            </table>

            <Modal footer = {false} title="Edit Coupan" visible={isEditModalVisible} onCancel={handleEditCancel}>
           <form onSubmit = {submitEditHandler}>
             <Input value = {coupanCode} name = 'coupanCode' onChange = {(e) => setCoupanCode(e.target.value)} placeholder = 'Enter Coupan Code'></Input>
             <Input value = {coupanDiscount} className = 'mt-2' name = 'coupanDiscount' onChange = {(e) => setCoupanDiscount(e.target.value)} placeholder = 'Enter Discount in %'></Input>
             <div className = 'text-center'>
             <button className = 'btn btn-outline-secondary mt-4' type = 'submit'>Submit</button>
             </div>
           </form>
      </Modal>



{/************************************************************************************************************* 
                                             Applying Coupans 
*************************************************************************************************************/}            <Modal title="Apply Coupan to Categories" visible={isApplyModalVisible} onOk={handleApplyOk} onCancel={handleApplyCancel}>
             <div className = 'text-center'>
            <TreeSelect
                      showSearch
                      style={{ width: 200 }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="Please select"
                      allowClear
                      treeDefaultExpandAll
                      onChange={handleCatChange}
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
              <div>
              <Button className = 'mt-4' type = 'primary' onClick = {() => handleApplyingCoupan()}>Apply</Button>
              </div>
              </div>
            </Modal>

{/************************************************************************************************************* 
                                             Editing Coupans 
*************************************************************************************************************/}
     
      </Layout>
    )
}
