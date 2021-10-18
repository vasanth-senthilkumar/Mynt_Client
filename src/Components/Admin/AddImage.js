import Modal from 'antd/lib/modal/Modal'
import {EditOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import React, {useState } from 'react'
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { Button, Spin } from 'antd';

export const AddImage = (props) => {
    const [file, setFile] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleImageChange = (e) => {
        setFile(
           e.target.files[0]
        );
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


      const token = localStorage.getItem('token');
      const submitHandler = async (e) => {
          e.preventDefault();
          setLoading(true);
          let data = new FormData();
          data.append('file', file);
          data.append('sliderId', props.sliderId);
        await axios.post('/api/home/slider/add-image', data, {headers : {
            'authorization' : 'Bearer ' + token
          }}).then(res => {
            if(res.status === 200) {
                setLoading(false);
                swal('Congrats!', res.data.successMessage, 'success')
            }
        })

      }
      console.log(props);


      const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;
    return (
        <span>

           <Button type = 'primary' onClick = {showModal} style={{ textDecoration: 'none' }}>+ Add Image</Button>  &nbsp;

              <Modal footer = {false} title="Upload Image" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}> 
                { loading 
                        ?
                        <div className = 'text-center fixed-top' style = {{marginTop: '50vh'}}>
                        <Spin indicator={antIcon} />
                        </div>    
                        :          
                     <form  className = 'text-center' onSubmit = {submitHandler}>
                          <h4 className = 'mb-5'>Upload Image</h4>                                                  <div className = 'my-3'>
                          <input type="file" name = 'file' multiple onChange = {handleImageChange}/>
                            </div>  
                            <button type="submit" className="btn btn-outline-danger mt-4">Submit</button>
                    </form>

                }
                 </Modal>
                  
                   
            
        </span>
    )
}
