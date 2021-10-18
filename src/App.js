import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { About } from './Components/About';
import { Home } from './Components/Home'
import { AdminPanel } from './Components/Admin/AdminPanel'
import {EditProduct} from './Components/Admin/editProduct'
import { GetBrands } from './Components/Admin/GetBrands'
import { GetCategory } from './Components/Admin/GetCategories'
import { PriceRanges } from './Components/Admin/GetPriceRanges'
import { Users } from './Components/Admin/Users' 
import { Coupans } from './Components/Admin/Coupans'
import { OrdersManagement } from './Components/Admin/OrdersManagement'
import AdminRoute from './Components/AdminRoute'
import {MobileLogin} from './Components/Authentication/MobileLogin'
import {Signup} from './Components/Authentication/Signup'
import {Wishlist} from './Components/wishlist'
import { Products } from './Components/Products'
import { Product } from './Components/Product';
import { GetProducts } from './Components/Admin/GetProducts';
import { ProductCart } from './Components/ProductCart';
import { DefaultComp } from './Components/404';
import { Address } from './Components/Address';
import { Payment } from './Components/Payment';
import { HomeSlider } from './Components/Admin/HomeSlider';
import { Overview } from './Components/Profile/Overview';
import { Orders } from './Components/Profile/Order&Returns';
import { MyntraCredit } from './Components/Profile/MyntraCredit';
import { MynCash } from './Components/Profile/MynCash';
import { MyntraInsider } from './Components/Profile/MyntraInsider';
import { Profile } from './Components/Profile/profile';
import { SavedCards } from './Components/Profile/SavedCards';
import { Addresses } from './Components/Profile/Addresses';
import { UserCoupans } from './Components/Profile/Coupans';
import { EditProfile } from './Components/Profile/EditProfile';
import { VerifyNumber } from './Components/Authentication/VerifyNumber';
import { Login } from './Components/Authentication/Login';
import { Chat } from './Components/Chat/Chat';
import { ChatBody } from './Components/Chat/ChatBody';
import { TrackOrders } from './Components/Profile/TrackOrders';
import { ResetPassword } from './Components/Authentication/ResetPassword';
import { NewPassword } from './Components/Authentication/NewPassword';

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <div style = {{marginTop: '90px'}}>
      <Switch>
      <Route exact path = '/' component = {Home}/>
      <Route exact path = '/my/dashboard' component = {Overview}/>
      <Route exact path = '/my/orders' component = {Orders}/>
      <Route exact path = '/my/orders/track/:id' component = {TrackOrders}/>
      <Route exact path = '/my/coupans' component = {UserCoupans}/>
      <Route exact path = '/my/credit' component = {MyntraCredit}/>
      <Route exact path = '/my/myncash' component = {MynCash}/>
      <Route exact path = '/my/profile' component = {Profile}/>
      <Route exact path = '/my/profile/edit/' component = {EditProfile}/>
      <Route exact path = '/my/saved-cards' component = {SavedCards}/>
      <Route exact path = '/my/addresses' component = {Addresses}/>
      <Route exact path = '/my/insider' component = {MyntraInsider}/>
      <Route exact path = '/login' component = {MobileLogin}/>
      <Route exact path = '/reset-password' component = {ResetPassword}/>
      <Route exact path = '/reset/:token' component = {NewPassword}/>
      <Route exact path = '/normal-login' component = {Login}/>
      <Route exact path = '/verify' component = {VerifyNumber}/>
      <Route exact path = '/signup' component = {Signup}/>
      <Route exact path = '/about' component = {About}/>
      <Route exact path = '/products/:id' component = {Products}/>
      <Route exact path = '/product/:id' component = {Product}/>
      <Route exact path = '/wishlist' component = {Wishlist}/>
      <Route exact path = '/cart' component = {ProductCart}/>
      <Route exact path = '/checkout/address' component = {Address}/>
      <Route exact path = '/checkout/payment' component = {Payment}/>
      <AdminRoute exact path = '/admin' component = {AdminPanel}/>
      <AdminRoute exact path = '/admin/all-categories' component = {GetCategory}/>
      <AdminRoute exact path = '/admin/all-brands' component = {GetBrands}/>
      <AdminRoute exact path = '/admin/all-price-range' component = {PriceRanges}/>
      <AdminRoute exact path = '/admin/get-products' component = {GetProducts}/>
      <AdminRoute exact path = '/admin/product/edit/:id' component = {EditProduct}/>
      <AdminRoute exact path = '/admin/users' component = {Users}/>                                                       
      <AdminRoute exact path = '/admin/slider' component = {HomeSlider}/>                                                       
      <AdminRoute exact path = '/admin/coupans' component = {Coupans}/>   
      <AdminRoute exact path = '/admin/orders' component = {OrdersManagement}/>   
      <Route exact path = '/chat' component = {Chat}/>    
      <Route exact path = '/chat/:id' component = {ChatBody}/>   
      <Route component = {DefaultComp}/>           
      </Switch>
      </div>
      </BrowserRouter>
    </div>

  )
}

export default App;