/* eslint react/no-string-refs: 0 */

import React from 'react';
import CONF from '../../config';
import { ActivityIndicator, View } from 'react-native';
import styled from 'styled-components';
import menuLogoHeader from '../../images/xPaylogo.png';

const Logo = styled.Image`
  width: ${284 * .5};
  height: ${112 * .5}
`;

export default class LoadingLighbox extends React.Component {
    render() {
        return(
            <View style={{flex:1, width: '100%',}}>
                <Logo source={menuLogoHeader} />
                <ActivityIndicator color={CONF.theme.primaryC} />
            </View>
        );
    }
}
