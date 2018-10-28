import { Platform } from 'react-native';

export default {
  DEV_MOVE: false,
  theme: {
    primaryC: '#FDC042',
    textC: '#000000',
  },
  navigatorStyle: {
    navBarHidden: false,
    screenBackgroundColor: '#ffffff',
    statusBarTextColorScheme: 'light',
    navBarBackgroundColor: '#ffffff',
    navBarButtonColor: '#000000',
    navBarNoBorder: true,
    statusBarColor: Platform.OS === 'ios' ? '#ffffff' : '#000000',
    navBarTextColor: '#000000',

    // Android only
    navigationBarColor: '#73B7E8',
  },
};
