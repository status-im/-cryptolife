import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import thunk from 'redux-thunk';
import { defaultState, rootReducer } from './reducer';

const migrations = {
  0: state => ({
    ...state
  }),
};

// console.log("migrations", migrations[0]())

const storage = createSensitiveStorage({
  encrypt: true,
  keychainService: 'xPAY',
  sharedPreferencesName: 'xPAY',
});

const config = {
  key: 'xPAY_test-6',
  version: 5,
  storage,
  migrate: createMigrate(migrations, { debug: true }),
  stateReconciler: hardSet,
};

const store = createStore(
  persistReducer(config, rootReducer),
  defaultState,
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(thunk)
    : applyMiddleware(createLogger(), thunk),
);

const getPersistor = cb => persistStore(store, null, cb);

export { getPersistor, store };
