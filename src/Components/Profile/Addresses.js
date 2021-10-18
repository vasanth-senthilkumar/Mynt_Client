import Checkbox from 'antd/lib/checkbox/Checkbox'
import Modal from 'antd/lib/modal/Modal';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Helmet } from 'react-helmet';
import { ProfLayout } from '../Layouts/ProfileLayout'
import { isAuthenticated } from '../auth';


export const Addresses = () => {
    const userId = isAuthenticated()._id;
    const [success, setSuccess] = useState(false);
    const [isConvenientModalVisible, setIsConvenientModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [home, setHome] = useState('false');
    const [work, setWork] = useState('false');
    const [sunday, setSunday] = useState(false);
    const [fetchedAddresses, setFetchedAddresses] = useState([]);
    const [editAddId, setEditAddId] = useState('');
    const [saturday, setSaturday] = useState(false);
    const [created, setCreated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sendingAddressSuccess, setSendingAddressSucess] = useState(false);
    const [sendingAddress, setSendingAddress] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState('');
    const [data, setData] = useState({
        name: '',
        mobile: '',
        address: '',
        pinCode: '',
        town: '',
        city: '',
        state: ''
    });
    console.log(sendingAddress);

    const { name, mobile, address, pinCode, town, city, state } = data;
   
    const handleAddressChange = (e) => {
        setData({
          ...data,
        [e.target.name] : e.target.value
        });
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

      const showEditModal = () => {
        setIsEditModalVisible(true);
      };
    
      const handleEditOk = () => {
        setIsEditModalVisible(false);
      };
    
      const handleEditCancel = () => {
        setIsEditModalVisible(false);
      };
    
      const handleConvenientCancel = () => {
        setIsConvenientModalVisible(false);
      };

      const onClickingSunday = (e) => {
          setSunday('true');
      }
      const onClickingSaturday = (e) => {
        setSaturday('true');
    }  

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post('/api/address/post', {name, mobile, address, pinCode, town, city, state, defaultAddress, sunday, saturday, userId, home, work}).then(res => {
              if(res.status === 200) {
                setCreated(true);
                setLoading(false);
                setCreated(false);
                setIsModalVisible(false);
                swal('success', res.data.successMessage, 'success'); 

              }
        });

    }

    useEffect(() => {
        fetchAddressesFromDb();
        return () => {
            
        }
    }, [created]);

    const fetchAddressesFromDb = async() => {
        setLoading(true);
       await axios.get(`/api/address/get/${userId}`).then(res => {
            if(res.status === 200) {
                setFetchedAddresses(res.data.length > 0 && res.data[0].allAddresses);
                setLoading(false);
            }
        })
    }


    const removeHanlder = async(addId) => {
         setLoading(true);
         await axios.delete(`/api/address/delete`, {params: {userId, addId}}).then(res => {
             if(res.status === 200) {
                setCreated(true);
                setLoading(false);
                swal('success', res.data.successMessage, 'success'); 
                setCreated(false);
             }
         })
    }

    const getAddressById = async (addId) => {
        setLoading(true);
        await axios.get('/api/address/getIndById', {params: {addId, userId}}).then(res => {
            setData(res.data[0]);
            res.data.map(c =>  setEditAddId(c.address));
            res.data[0].work === 'true' ? setSuccess(true) : setSuccess(false)
            setLoading(false);
        })

    }


    const submitEditHandler = async() => {
        setLoading(true);
        await axios.post(`/api/address/edit/${editAddId}`, {name, mobile, address, pinCode, town, city, state, defaultAddress, sunday, saturday, userId, home, work }).then(res => {
            if(res.status === 200) {
                setLoading(false);
                setIsEditModalVisible(false);
                swal('Great!', res.data.successMessage, 'success');
            }
        })

    }


     const antIcon = <LoadingOutlined style={{ fontSize: 30, color: '##ff3e6c' }} spin />;

/*************************************************************************************************************
*********************************************   Create New Address *******************************************
*************************************************************************************************************/
 const createAddress = () => {
     return(
         <>
        <div>
        <div className = 'row address'>
            <div className = 'col-md-8' style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '32px', paddingLeft: '82px'}}>
             <form className = 'border' onSubmit = {submitHandler}>
             <div className="row p-3">
                        <div className="col-xs-4 col-xs-offset-4 ">
                            <div>
                                <h6>Contact Details:</h6>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} name = 'name' type="text" id="name" className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">Name</label>
                            </div>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} name = 'mobile' type="number" id="Mobile no." className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">Mobile no.</label>
                            </div>
                            </div>

                            <div></div>
                            <h6>Address:</h6>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} name = 'pinCode' type="number" id="Pin-Code" className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">Pin Code</label>
                            </div>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} name = 'address' type="text" id="Address" className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">Address(House No, Building, Street, Area)</label>
                            </div>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} name = 'town' type="text" id="Locality" className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">Locality/Town</label>
                            </div>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} name = 'city' type="text" id="City" className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">City/District</label>
                            </div>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} name = 'state' type="text" id="State" className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">State</label>
                            </div>
                            <div>
                            <button className = {!success ? 'btn shift-btn home-btn' : 'btn shift-btn'} onClick = {(e) => {e.preventDefault(); setSuccess(false); setHome('true'); setWork('false')}}>Home</button>
                            <button className = {success ? 'btn shift-btn work-btn' : 'btn shift-btn'} onClick = {(e) => {e.preventDefault(); setSuccess(true); setWork('true'); setHome('false')}}>Work</button>
                              {
                                  success && 
                                  <div className = 'mt-4'>
                                  <Checkbox className = 'mb-3' onChange={onClickingSaturday}>Open On Saturday</Checkbox>
                                  <br/>
                                  <Checkbox value = '' onChange={onClickingSunday}>Open On Sunday</Checkbox>
                                  </div>

                              }
                            </div>
                              <div className = 'mt-4'>
                            <Checkbox onChange={() => setDefaultAddress(true)}>Make this my default address</Checkbox>
                            </div>
                        
                        </div>
                        
                    </div>
                    <div className = 'submit-btn-container'>
                     <button className = 'btn submit-btn' type = 'submit'>ADD ADDRESS</button> 
                     </div>  
              </form>
            </div>

        </div>
     
        </div>
        </>

     )
 }  
 



/*************************************************************************************************************
*********************************************   Get Saved Addresses *******************************************
*************************************************************************************************************/ 
  const getAddresses = () => {
         return(
             <div className = 'row' style = {{marginTop: '32px'}} >
                 <div className = 'col-md-8'>
               <div className="jumbotron jumbotron-fluid mt-4" style = {{float: 'left', width: '50vw'}}>
                    <div className = 'row'>
                        <div className = 'col-sm-9'><p style = {{color: '#282c3f', fontSize: '18px', fontWeight: '600'}}> Delivery Addresses</p> </div>
                        <div className = 'col-sm-3'>
                        <button 
                        style = {{fontSize: '12px', fontWeight: '700', border: '1px solid #282c3f', color: '#424553'}}
                         onClick = {showModal} className = 'mb-4 btn'>
                             Add New Address
                             </button>
                             </div>
                    </div>
                    <p style = {{fontSize: '14px', fontWeight: '600', color: '#535766'}}>DEFAULT ADDRESS</p>
                    
                </div> 
                    
                
                          {
                             fetchedAddresses && fetchedAddresses.map(add => {
                                  return(
                                    <div key = {add._id} className="jumbotron jumbotron-fluid" style = {{float: 'left', width: '50vw',boxShadow: '0 0 4px rgb(40 44 63 / 8%)', border: '1px solid #eaeaec',padding: '19px 16px 0 48px', marginBottom: '8px', verticalAlign: 'top', borderRadius: '4px'
                                }}>
                                    <div className="row address">
                                     <div className = 'col-sm-2 col-md-1'> 
                                    <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" onClick = {() => {setSendingAddress(add); setSendingAddressSucess(true)}}/>
                                    </div>  
                                    <div className = 'col-md-8'>
                                    <p style = {{fontSize: '14px', fontWeight: '600', color: '#282c3f'}}>{add.name}</p>
                                    <p>{add.address}, {add.town} <br/> {add.city}, {add.state}, {add.pinCode} </p>
                                     <p>Mobile: <span style = {{fontSize: '14px', fontWeight: '600', color: '#282c3f'}}>{add.mobile}</span></p>
                                      <li>Cash on delivery is available</li>  
                                      <div className = 'my-3'>
                                      <button onClick = {() => removeHanlder(add.address)} className = 'btn mr-3' style = {{fontSize: '12px', fontWeight: '700', border: '1px solid #282c3f', color: '#424553'}}>Remove</button>
                                      <butto  onClick = {() => {getAddressById(add.address) ;showEditModal()}}  className = 'btn' style = {{fontSize: '12px', fontWeight: '700', border: '1px solid #282c3f', color: '#424553'}}>Edit</butto>
                                      </div>
                                      </div>
                                    </div>
                                 </div>


                                  )
                              }) 
                          }

             <div className="jumbotron jumbotron-fluid">
                <div className="container" style = {{float: 'left', width: '50vw', marginLeft: '100px', padding: '23px', border: '1px dashed #d4d5d9', color: '#ff3f6c', fontWeight: '600', fontSize: '16px'}}>  
                    <a onClick = {showModal}>+ Add New Address</a>
                </div>
            </div> 
            <Modal title="Add New Address" footer = {false} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                  <div className = 'text-center' style = {{marginLeft: '60px'}}>
                      {createAddress()}
                  </div>
            </Modal>

            <Modal title="Edit Address" footer = {false} visible={isEditModalVisible} onOk={handleEditOk} onCancel={handleEditCancel}>
                  <div className = ''>
                     
                <form className = 'border text-center address' onSubmit = {submitEditHandler}>
                    <div className="row p-3" style = {{marginLeft: '10px'}}>
                        <div className="col-xs-4 col-xs-offset-4 ">
                            <div>
                                <h6>Contact Details:</h6>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange}  value = {data.name} name = 'name' type="text" id="name" className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">Name</label>
                            </div>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} value = {data.mobile} name = 'mobile' type="number" id="Mobile no." className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">Mobile no.</label>
                            </div>
                            </div>

                            <div></div>
                            <h6>Address:</h6>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} value = {data.pinCode} name = 'pinCode' type="number" id="Pin-Code" className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">Pin Code</label>
                            </div>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} value = {data.address} name = 'address' type="text" id="Address" className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">Address(House No, Building, Street, Area)</label>
                            </div>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} value = {data.town} name = 'town' type="text" id="Locality" className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">Locality/Town</label>
                            </div>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} value = {data.city} name = 'city' type="text" id="City" className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">City/District</label>
                            </div>
                            <div className="floating-label-group">
                            <input onChange = {handleAddressChange} value = {data.state} name = 'state' type="text" id="State" className="form-control" autocomplete="off" autofocus required />
                                <label className="floating-label">State</label>
                            </div>
                            <div>
                            <button className = {!success ? 'btn shift-btn home-btn' : 'btn shift-btn'} onClick = {(e) => {e.preventDefault(); setSuccess(false); setHome('true'); setWork('false')}}>Home</button>
                            <button className = {success ? 'btn shift-btn work-btn' : 'btn shift-btn'} onClick = {(e) => {e.preventDefault(); setSuccess(true); setWork('true'); setHome('false')}}>Work</button>
                                {
                             success && 
                             <div className = 'mt-4'>
                             <Checkbox className = 'mb-3' onChange={onClickingSaturday}>Open On Saturday</Checkbox>
                             <br/>
                             <Checkbox value = '' onChange={onClickingSunday}>Open On Sunday</Checkbox>
                             </div>

                         }
                       </div>
                         <div className = 'mt-4'>
                       <Checkbox onChange={() => setDefaultAddress(true)}>Make this my default address</Checkbox>
                       </div>
                   
                   </div>
                   
               </div>
               <div className = 'submit-btn-container'>
                <button className = 'btn submit-btn' type = 'submit'>ADD ADDRESS</button> 
                </div>  
         </form>
         </div>
      </Modal>
      </div>
      </div>

         )
               
            
        }

      
    return (
        <ProfLayout sidebar>
             {  loading 
                ?
                <div className = 'text-center fixed-top' style = {{marginTop: '50vh'}}>
                <Spin indicator={antIcon} />
                </div>

                :
            <div>
                <Helmet>
                    <title>Address</title>
                </Helmet>
                {fetchedAddresses.length > 0 ?  getAddresses() : createAddress()}
            </div>
            }
           
            
        </ProfLayout>
    )
}
