import { Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';
import { PlusOutlined  } from '@ant-design/icons';
import axios from 'axios';
import swal from 'sweetalert';


export const CreatePriceRange = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [token, setToken] = useState('');
    const [catData, setCatData] = useState({
        minPrice: '',
    });

    const { minPrice } = catData;

    const handleCatChange = (e) => {
        setCatData({
            ...catData,
            [e.target.name]: e.target.value
        });
    }

    console.log(catData);

    const showCatModal = () => {
        setIsModalVisible(true);
      };
      const handleCatOk = () => {
        setIsModalVisible(false);
      };
      const handleCatCancel = () => {
        setIsModalVisible(false);
      };

      useEffect(() => {
        setToken(localStorage.getItem('token'));
        return () => {
          
        }
      }, [])

      const submitHandler = (e) => {
        e.preventDefault();
        axios.post('/api/categories/price-range/create', {priceRange: minPrice}, {headers : {
          'authorization' : 'Bearer ' + token
        }}).then( response => {
            if(response.status === 200) {
                swal('Good Job', response.data.successMessage , 'success');
            } else if(response.status === 201) {
                swal('Sorry', response.data.errorMessage , 'error');
            }
            else {
                swal('Error','Error in Creating Main Category', 'error');
            }
        })

      }


    return (
        <div>
      <span className = 'mr-3'>
         <Button type="primary" size = 'large' icon={ <PlusOutlined />} onClick = {showCatModal} >
              <span className = 'pb-2'>Price Range</span>
            </Button>
         
          <Modal footer = {false} title="Main Category" visible={isModalVisible} onOk={handleCatOk} onCancel={handleCatCancel}>
            <form onSubmit={submitHandler} className = 'text-center'>
            <h4 className = 'mb-4'>Create Price Ranges</h4>
            <div className="form-group" style = {{paddingLeft: '62px'}}>
                    <input type="Text" className="form-control mb-2" id = 'minPrice' value = {minPrice} name = 'minPrice' placeholder="Enter Price Range" onChange = {handleCatChange} />
                </div>
        
            <button type="submit" className="btn btn-outline-danger mt-4">Submit</button>
            </form>
            </Modal>
         </span>
        </div>
    )
}
