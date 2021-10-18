import {createStore, compose, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleWare from 'redux-thunk';
import axios from 'axios';
import Cookie from 'js-cookie';

// const cartItems = Cookie.getJSON('cartItems') || [];
const wishlistItems = Cookie.get('wishlistItems') || [];
  const initialState = {
      wishlist: {wishlistItems}
 };                  


/**************************************Constants **********************************************/
const WOMEN_CATEGORY_LIST_REQUEST = 'WOMEN_CATEGORY_LIST_REQUEST';
const WOMEN_CATEGORY_LIST_SUCCESS = 'WOMEN_CATEGORY_LIST_SUCCESS';
const WOMEN_CATEGORY_LIST_FAILURE = 'WOMEN_CATEGORY_LIST_FAILURE';
const MEN_CATEGORY_LIST_REQUEST = 'MEN_CATEGORY_LIST_REQUEST';
const MEN_CATEGORY_LIST_SUCCESS = 'MEN_CATEGORY_LIST_SUCCESS';
const MEN_CATEGORY_LIST_FAILURE = 'MEN_CATEGORY_LIST_FAILURE';
const GET_PRODUCT_SUCCESS = 'GET_PRODUCT_SUCCESS';
const GET_PRODUCT_REQUEST = 'GET_PRODUCT_REQUEST';
const GET_PRODUCT_FAIL = 'GET_PRODUCT_FAIL';
 const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
 const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
 const FETCH_PRODUCTS_FAIL = 'FETCH_PRODUCTS_FAIL';

/*********************************Category and Sub-Category Reducers********************************************************/ 


const getMenCategoryListReducer = (state =  {menCategories: []}, action) => {
    switch(action.type) {
        case MEN_CATEGORY_LIST_REQUEST:
            return{
                loading: true,
        };
        case MEN_CATEGORY_LIST_SUCCESS:
            return{
                loading: false,
                menCategories: action.payload,
                success: true
            };
        case MEN_CATEGORY_LIST_FAILURE:
            return{
                loading: false,
                error: action.payload,
            };

        default: return state;


    }
 }
 const getWomenCategoryListReducer = (state =  {womenCategories: []}, action) => {
    switch(action.type) {
        case WOMEN_CATEGORY_LIST_REQUEST:
            return{
                loading: true,
        };
        case WOMEN_CATEGORY_LIST_SUCCESS:
            return{
                loading: false,
                womenCategories: action.payload,
                success: true
            };
        case WOMEN_CATEGORY_LIST_FAILURE:
            return{
                loading: false,
                error: action.payload,
            };

        default: return state;


    }
 }

 const getProductReducer = (state = {product : {}}, action) => {
     switch (action.type) {
         case GET_PRODUCT_REQUEST:
             return{
                 loading: true
             };
         case GET_PRODUCT_SUCCESS:
                 return{
                     loading: false,
                     product: action.payload
              };
         case GET_PRODUCT_FAIL:
                return{
                    loading: false,
                    error: action.payload
                }    

             
           
     
         default: return state;
            
     }
 }

 const productsInCart = ('');
 const productsListReducer = (state = { productsInCart}, action) => {
    switch(action.type) {
        case FETCH_PRODUCTS_REQUEST: return {
            loading: true,
        };
        case FETCH_PRODUCTS_SUCCESS: return {
            loading: false,
            productsInCart: action.payload
        };
        case FETCH_PRODUCTS_FAIL: return {
            loading: false,
            error: action.payload
        };
        default: return state
    }
}

const wishProducts = ('');
const productsWishlistReducer = (state = { wishProducts}, action) => {
    switch(action.type) {
        case GET_PRODUCT_REQUEST: return {
            loading: true,
        };
        case GET_PRODUCT_SUCCESS: return {
            loading: false,
            wishProducts: action.payload
        };
        case GET_PRODUCT_FAIL: return {
            loading: false,
            error: action.payload
        };
        default: return state
    }
}




 export const getMenCategories = () => async (dispatch) => {
     try {
         dispatch({type: MEN_CATEGORY_LIST_REQUEST});
         const  {data}  = await axios.get('/api/categories/men');
         dispatch({type: MEN_CATEGORY_LIST_SUCCESS, payload: data});
     } catch(error) {
         dispatch({type: MEN_CATEGORY_LIST_FAILURE, payload: error.errorMessage});

     }
 }

 export const getWomenCategories = () => async (dispatch) => {
    try {
        dispatch({type: WOMEN_CATEGORY_LIST_REQUEST});
        const {data}   = await axios.get('/api/categories/women');
        dispatch({type: WOMEN_CATEGORY_LIST_SUCCESS, payload: data});
    } catch(error) {
        dispatch({type: WOMEN_CATEGORY_LIST_FAILURE, payload: error.errorMessage});

    }
}

export const getProductById = (productId) => async (dispatch) => {
    try {
        dispatch({type: GET_PRODUCT_REQUEST});
        const {data} = await axios.get('/api/products/' + productId);
        dispatch({type: GET_PRODUCT_SUCCESS, payload: data});
        } catch (error) {
            dispatch({type: GET_PRODUCT_FAIL, payload: error.errorMessage})
        
    }
}

export const listProducts = (userId) => async (dispatch) => {
     
    try {
       dispatch({ type: FETCH_PRODUCTS_REQUEST});
        const { data } = await axios.get(`/api/cart/get/${userId}`);
        dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: data});
        
    } catch (error) {
        dispatch({ type: FETCH_PRODUCTS_FAIL, payload: error.message});
        
    }
}

export const wishlistProducts = (userId) => async (dispatch) => {
     
    try {
       dispatch({ type: GET_PRODUCT_REQUEST});
        const { data } = await axios.get(`/api/wishlist/get/${userId}`);
        dispatch({ type: GET_PRODUCT_SUCCESS, payload: data});
        
    } catch (error) {
        dispatch({ type: GET_PRODUCT_FAIL, payload: error.message});
        
    }
}

 /*****************************************Combining Redcers******************************************/

 const reducer = combineReducers({
     men: getMenCategoryListReducer,
     women: getWomenCategoryListReducer,
     getProduct: getProductReducer,
     productsList: productsListReducer,
     wishlistReducer: productsWishlistReducer
     
 });

 const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunkMiddleWare)));
 export default store;