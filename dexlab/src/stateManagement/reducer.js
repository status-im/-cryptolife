import { combineReducers } from 'redux';
import {
  LOGOUT,
  SET_WALLET_ADDRESS,
} from './actionTypes';

const defaultState = {
  appReducer: {
    localPendingtransactions: [],
    selectedLanguage: 'en-US',
  },
};

const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_WALLET_ADDRESS:
      return {
        ...state,
        walletAddress: action.walletAddress,
      };
    default:
      return state;
  }
};

const t = combineReducers({
  appReducer
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    // eslint-disable-next-line
    state = defaultState;
  }

  return t(state, action);
};

export { defaultState, rootReducer };
