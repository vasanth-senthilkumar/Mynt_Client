import Modal from 'antd/lib/modal/Modal'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert'
import { CreatePriceRange } from './CreatePriceRange'
import { Layout } from '../Layouts/Layout'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';



export const PriceRanges = () => {
    const [prices, setPrices] = useState([]);
    const [priceRange, setPriceRange] = useState('');
    const [editedPriceId, setEditedPriceId] = useState('');
    const [success, setSuccess] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [token, setToken] = useState('');

    
    useEffect(() => {
      setToken(localStorage.getItem('token'));
        fetchPriceRanges();
        return () => {
            
        }
    }, [success]);


/**************************************************On Change ***********************************************/
    
  const handleMinPriceChange = (e) => {
        setPriceRange(
            e.target.value
        )
    }

/**************************************************On Submit ***********************************************/
    const submitHandler = (e) => {
        e.preventDefault();
        axios.put(`/api/categories/price-range/update/${editedPriceId}`, {priceRange}, {headers : {
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
          else  {
            swal('Error', 'Request Failed', 'error');
          }
        })
      }


/************************************************** Modal ***********************************************/
      const showModal = () => {
        setIsModalVisible(true);
      };
  
      const handleCancel = () => {
        setIsModalVisible(false);
      };

      
    /************************************************** Fetch Brands ***********************************************/
         const fetchPriceRanges = async() => {
                await axios.get('/api/categories/price-ranges').then(res => {
                  console.log(res.data)
                    setPrices(res.data.range);
                })
            }

          

  const editHandler = (priceId) => {
       setEditedPriceId(priceId);
       axios.get(`/api/categories/price-range/${priceId}`).then(res => {
           setSuccess(true);
           setPriceRange(res.data.findPrice.priceRange);
           setSuccess(false);
       })

  }
  
  const deleteHandler = async (priceId) => {
      await axios.delete(`/api/categories/price-range/delete/${priceId}`, {headers : {
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
         <h3 className = 'text-center'>Price Ranges</h3>
         <div className = 'float-right mb-3'>
           <CreatePriceRange/>
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
                   prices.map((pri, index) => {
                       return(
                           
                        <tr key = {pri._id}>
                          <th>{index + 1}</th>
                        <td>{pri.priceRange}</td>
                        <button className='btn' style={{ textDecoration: 'none' }} onClick = {() => {editHandler(pri._id); showModal()}}><EditOutlined /></button>  &nbsp;
                        <button className='btn'><DeleteOutlined onClick = {() => deleteHandler(pri._id)}/></button>
                        </tr>
                       )
                   })
               }
               <Modal title="Edit Price Range" visible={isModalVisible} onCancel = {handleCancel} footer = {false}>     
                                              <form  className = 'text-center' onSubmit = {submitHandler}>
                                              <h4 className = 'mb-5'>Edit Your Price Range</h4>
                                           
                                                  <div className="form-group mt-4" style = {{paddingLeft: '62px'}}> 
                                                      <input type="text" className="form-control mb-2 border" id = 'editedMin' name = 'editedMin' onChange = {handleMinPriceChange} value = {priceRange}   />
                                                  </div> 
                                             
                                              <button type="submit" className="btn btn-outline-danger mt-4">Submit</button>
                                              </form>
                                              </Modal>
                
            </tbody>
            </table>
        </Layout>
    )
}
