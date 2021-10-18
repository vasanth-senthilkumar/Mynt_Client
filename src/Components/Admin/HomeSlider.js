import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Layout } from '../Layouts/Layout'
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { EditSlider } from './EditSlider';
import Modal from 'antd/lib/modal/Modal';
import { AddImage } from './AddImage';

export const HomeSlider = () => {
    const [file, setFile] = useState('');
    const [images, setImages] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    /************************************************** Modal ***********************************************/
    const showModal = () => {
        setIsModalVisible(true);
      };
    
     
      const handleCancel = () => {
        setIsModalVisible(false);
      };


    const handleImageChange = (e) => { 
        setFile([
          ...file,
          e.target.files[0]

        ])
      }

      const fetchImages = async() => {
        setLoading(true);
          await axios.get('/api/home/get').then(res => {
            if(res.status === 200) {
              setImages(res.data);
              setLoading(false);
            }
          })
      }


      useEffect(() => {
          fetchImages();
          return () => {
              
          }
      }, [success])

      const handleRemoveUploadedImage = name => {
        setFile(file => file.filter(item => item.name !== name.name))
    }


   

    const token = localStorage.getItem('token');

    const submitHandler = async() => {
        setLoading(true);
        let data = new FormData();
        for(let pic of file) {
            data.append('file', pic);
           }
        await axios.post('/api/home/slider/post', data, {headers : {
            'authorization' : 'Bearer ' + token
          }}).then(res => {
            if(res.status === 200) {
                setLoading(false);
                swal('Congrats!', res.data.successMessage, 'success')
            }
        })
    }

    const deleteHandler = async (imgId, sliderDelId, cloudId) => {
        setLoading(true);
        await axios.post(`/api/home/slider/delete`, {imgId, sliderId: sliderDelId, cloudId}, {headers : {
            'authorization' : 'Bearer ' + token
          }}).then(res => {
            if(res.status === 200 ) {
                setSuccess(true);
                setLoading(false);
                swal('Congrats!', res.data.successMessage, 'success');
                setSuccess(false);
            }
        })
    }

    console.log(images);

    const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;
    return (
        <Layout sidebar>
              { loading 
                ?
                <div className = 'text-center fixed-top' style = {{marginTop: '50vh'}}>
                <Spin indicator={antIcon} />
                </div>    
                : 
            <>
            <div className = 'float-right my-2'>
            <Button type = 'primary' onClick = {showModal}>+ Create New Slider</Button>
            </div>
            <Modal footer = {false} title="Upload Images" visible={isModalVisible} onCancel={handleCancel}>
           
            <div className = 'my-3 text-center'>
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
             <Button onClick = {submitHandler}>Submit</Button>
            </div>  
            </Modal>

            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Image</th>
                    <th scope="col">Cloudinary Id</th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>

                      {
                          images.map(i => {
                              return(
                                  <>
                              {
                              i.HomeSlider.map((image, index) => {
                                  return(
                                <tr key = {image._id}>
                                <th scope="row">{index + 1}</th>
                                <td><img src = {image.img} alt = 'image' width = '121' height = '121'/></td>
                                <td>{image.cloudinary_id}</td>
                                <td>
                                 <EditSlider sliderId = {i._id} imgId = {image._id} cloudId = {image.cloudinary_id}/>                           
                                 <Link onClick = {() => {deleteHandler(image._id, i._id, image.cloudinary_id); setSuccess(true)}}><DeleteOutlined/></Link>

                                </td>
                                </tr>
                                  )
                              })
                          }
                           
                           <div style = {{position: 'relative', top: '95%', left: '145%', marginTop: '41px'}}>
                         
                         <AddImage sliderId = {i._id}/> 
                       
                         </div>
                         
                          </>
                              )
                          })
                      }         
                </tbody>
                </table>
                </>
               
                    }

        </Layout>
    )
}
