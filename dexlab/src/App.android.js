import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import registerScreens from './screens';
import { getPersistor, store } from './stateManagement/store';
import xPAY from './xPAY'

console.disableYellowBox = true;
console.reportErrorsAsExceptions = false;

export default class App {
  static start() {
    registerScreens(store, Provider);

    getPersistor(async () => {

      let screen = {
        screen: 'POS',
        title: 'POS',
      };

      xPAY.init();

      Navigation.startSingleScreenApp({
        screen
      });
    });
  }
}
