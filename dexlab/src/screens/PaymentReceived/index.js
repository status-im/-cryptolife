import React, { Component } from 'react';
import {
  Text,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import { SecondaryButton } from '../../components';
import styled from 'styled-components';
import CONF from '../../config';
import moment from 'moment';
import XDAI from '../../images/xdai_icon.png';


const XDAILogo = styled.Image`
  margin-top:30;
  margin-bottom:10;
`;

const SmallText = styled.Text`
  font-family: 'OpenSans';
  font-size: 14;
  font-weight: 400;
  padding-vertical: 20;
`;

const SmallTextBold = styled.Text`
  font-family: 'OpenSans';
  font-size: 14;
  font-weight: 800;
`;


const AmountInput = styled.Text`
  font-family: 'OpenSans';
  font-size: 48;
  font-weight: 200;
`;

const Center = styled.View`
  alignItems: center;
  flex:1;
`;

const CenterAmount = styled.Text`
  font-family: 'OpenSans';
  font-size: 20;
  font-weight: 400;
  margin-top:30;
`;

const Container = styled.View`
  flex: 1;
  flexDirection: column;
`;

const Row = styled.View`
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
  paddingTop: 10;
`;

const ButtonContainer = styled.View`
  paddingHorizontal: 10;
  paddingBottom: 20;
  flex: 1;
`;

const TipButton = styled.View`
  border-radius: 6;
  background-color: #000;
  color: #fff;
  padding-horizontal:6;
  padding-vertical:3;
  margin-right:5;
`

class PaymentReceived extends Component {

  static navigatorStyle = {
    ...CONF.navigatorStyle,
    navBarHidden: true,
  };

  render() {
    const { tx } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>

          <Center>
            <CenterAmount>Payment Received!</CenterAmount>
            <XDAILogo source={XDAI}/>
            <AmountInput>$ {tx.value}</AmountInput>
            <SmallText>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </SmallText>
            <SmallText>{moment(moment.unix(tx.timestamp)).format('DD - MMM - YYYY')}</SmallText>
            <SmallTextBold>From</SmallTextBold>
            <SmallText style={{paddingTop: 5}}>{tx.from}</SmallText>

            <TouchableOpacity onPress={() => Linking.openURL(`https://blockscout.com/poa/dai/tx/${tx.transactionHash}`)}>
              <TipButton> 
                <Text style={{color:'#fff'}}>FULL TRANSACTION DETAILS</Text>
              </TipButton>
            </TouchableOpacity>
          </Center>

          <ButtonContainer style={{position: 'absolute', bottom: 0, left: 0, right:0}}>
              <SecondaryButton text="DISMISS" onPress={ () => {this.props.navigator.dismissModal() }} />
          </ButtonContainer>

        </Container>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(null, mapDispatchToProps)(PaymentReceived);
