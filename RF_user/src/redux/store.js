import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

// ----------------------------------------------------------------------
const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
      compose
  )
);
const persistor = persistStore(store);

const { dispatch } = store;
const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();
export { store, persistor, dispatch, useSelector, useDispatch };
// const persistor = persistStore(store);
