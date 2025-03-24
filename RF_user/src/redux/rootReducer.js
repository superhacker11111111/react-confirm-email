import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import usersReducer from './reducers/userReducer';
import userReducer from './slices/user';
import errorReducer from './reducers/errorReducer';
import authReducer from './reducers/authReducer';
import productReducer from './slices/product';
// slices
import priceReducer from './slices/price';
import categoryReducer from './slices/category';
import mediaReducer from './slices/media';
import tagsReducer from './slices/tags';
import qaReducer from './slices/qa';
import edReducer from './slices/ed';
import blogReducer from './slices/blog';
import mediatutorialReducer from './slices/mediatutorial';
import subscriptionReducer from './slices/subscription';
import fenceReducer from './slices/fence';
import billingReducer from './slices/billing';
import affiliateReducer from './slices/affiliate';

// ----------------------------------------------------------------------
export const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: [
    'favorite_list',
    'request_list',
    'selected_list',
    'selectedFences',
    'removed_list',
    'new_favorite_list',
    'new_request_list',
    'new_selected_list',
  ],
};

export const authPersistConfig = {
  key: 'auth',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['user'],
};

export const subscriptionPersistConfig = {
  key: 'subscription',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['subscription'],
};

export const userPersistConfig = {
  key: 'user',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['updatePaymentInfo'],
};

const rootReducer = combineReducers({
  price: priceReducer,
  media: mediaReducer,
  product: persistReducer(productPersistConfig, productReducer),
  auth: persistReducer(authPersistConfig, authReducer),
  user: usersReducer,
  users: persistReducer(userPersistConfig, userReducer),
  error: errorReducer,
  category: categoryReducer,
  tag: tagsReducer,
  qa: qaReducer,
  ed: edReducer,
  blog: blogReducer,
  mediatutorial: mediatutorialReducer,
  subscription: persistReducer(subscriptionPersistConfig, subscriptionReducer),
  fence: fenceReducer,
  billing: billingReducer,
  affiliate: affiliateReducer,
});

export default rootReducer;
