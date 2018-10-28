import { Navigation, ScreenVisibilityListener } from 'react-native-navigation';
import Settings from './Settings';
import LoadingLighbox from './LoadingLightbox';
import POS from './POS';
import PaymentReceived from './PaymentReceived';

export default (store, Provider) => {
  Navigation.registerComponent('PaymentReceived', () => PaymentReceived, store, Provider);
  Navigation.registerComponent('POS', () => POS, store, Provider);
  Navigation.registerComponent('LoadingLighbox', () => LoadingLighbox, store, Provider);  
  Navigation.registerComponent('Settings', () => Settings, store, Provider);
  new ScreenVisibilityListener({}).register();
};
