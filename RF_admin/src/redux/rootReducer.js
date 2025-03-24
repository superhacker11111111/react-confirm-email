import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import userReducer from './slices/user';
import serviceReducer from './slices/service';
import priceReducer from './slices/price';
import categoryReducer from './slices/category';
import mediaReducer from './slices/media';
import tagReducer from './slices/tag';
import edReducer from './slices/ed';
import qaReducer from './slices/qa';
import affiliateReducer from './slices/affiliate';
import qacategoryReducer from './slices/qacategory';
import blogReducer from './slices/blog';
import adminReducer from './slices/admin';
import subscriptionReducer from './slices/subscription';
import billingReducer from './slices/billing';
import authReducer from './reducers/authReducer';

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

export const userPersistConfig = {
  key: 'user',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['updatePaymentInfo'],
};

export const categoryPersistConfig = {
  key: 'category',
  storage,
  keyPrefix: 'redux-',
  whitelist: [
    'category',
    'categoryTitle',
    'categoryImage',
    'categories',
    'subCategoryList',
    'styleList',
    'colorList',
  ],
};

const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  price: priceReducer,
  media: mediaReducer,
  service: serviceReducer,
  tag: tagReducer,
  ed: edReducer,
  qa: qaReducer,
  qacategory: qacategoryReducer,
  blog: blogReducer,
  subscription: subscriptionReducer,
  billing: billingReducer,
  product: persistReducer(productPersistConfig, productReducer),
  user: persistReducer(userPersistConfig, userReducer),
  category: persistReducer(categoryPersistConfig, categoryReducer),
  affiliate: affiliateReducer,
});

export default rootReducer;
