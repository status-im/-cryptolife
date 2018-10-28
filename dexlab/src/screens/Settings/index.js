import React, { Component } from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import { SettingsMenu } from '../../components';
import {
  LOGOUT,
} from '../../stateManagement/actionTypes';
import { getPersistor } from '../../stateManagement/store';
import closeIcon from '../../images/close.png';
import menuLogoHeader from '../../images/xPaylogo.png';
import CONF from '../../config';
import styled from 'styled-components';
import xPAY from '../../xPAY';

const Center = styled.View`
  alignItems: center;
  justify-content: space-between;
  flexDirection: row;
  paddingHorizontal: 10;
  marginVertical:20;
`;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flex: 1,
    marginTop: 0,
    paddingBottom: 15,
  },
});

class Settings extends Component {

  static navigatorStyle = {
    ...CONF.navigatorStyle,
    navBarHidden: true,
  };

  menuOptions = [
    {
      title: 'Privacy Policy',
      onPress: () => {
        Sentry.captureMessage('User Tap on TOS in Fullscreen Menu', {
          level: 'info',
        });
        Linking.openURL('https://www.xPAY.io/privacy-policy/');
      },
    },
    {
      title: 'Terms & Conditions',
      onPress: () => {
        Sentry.captureMessage('User Tap on TOS in Fullscreen Menu', {
          level: 'info',
        });
        Linking.openURL('https://www.xPAY.io/terms-and-conditions/');
      },
    },
    {
      title: 'Logout',
      onPress: () => {
        Alert.alert(
          'Logout',
          'This will erase your database',
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                await this.props.logout();
                xPAY.erase();

                this.props.navigator.resetTo({
                  screen: 'Home',
                });
              },
            },
          ],
          { cancelable: false },
        );
      },
    },
  ];

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Center>
            <Image source={menuLogoHeader} style={{ width: 284 * .4, height: 112 * .4, marginLeft:10 }} />
            <TouchableOpacity onPress={() => this.props.navigator.pop({ animated: false })} style={{ alignItems: 'flex-end' }}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 10,
                  paddingHorizontal: 15,
                  paddingBottom: 15,
                }}
              >
                <Image source={closeIcon} style={{ height: 22, width: 24 }} />
              </View>
            </TouchableOpacity>
          </Center>
          
          <SettingsMenu options={this.menuOptions} style={{marginTop:30}}/>
        </View>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: async () => {
    dispatch({ type: LOGOUT });
    await getPersistor(null).flush();
  },
  dispatch,
});

export default connect(null, mapDispatchToProps)(Settings);
