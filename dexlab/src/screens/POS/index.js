import React, { Component } from 'react';
import QRCode from 'react-native-qrcode';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import { TransactionsList } from './components';
import { IF, PrimaryButton, SecondaryButton } from '../../components';
import styled from 'styled-components';
import menuIcon from './images/menu.png';
import CONF from '../../config';
import xPAY from '../../xPAY'
import VirtualKeyboard from 'react-native-virtual-keyboard';
import XDAI from '../../images/xdai_icon.png';


const XDAILogo = styled.Image`
  margin-top:30;
  margin-bottom:10;
`;

const Title = styled.Text`
  font-family: 'Quicksand';
  font-size: 20;
  font-weight: 400;
  padding-horizontal: 20;
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

const QRCodeContainer = styled.View`
  padding-horizontal: 5;
  align-items: center;
  width: 100%;
  paddingTop: 20;
`;

const TabNav = styled.View`
  flexDirection: row;
  paddingTop: 40;
  justifyContent: space-around;
  margin: 0;
  paddingBottom: 15;
  paddingLeft: 10;
  paddingRight: 10;
`;

const Column = styled.View`
  flexDirection: column;
`; 

const Container = styled.View`
  flex: 1;
  flexDirection: column;
`;

const Row = styled.View`
  flexDirection: row;
  justifyContent: space-between;
  alignItems: center;
  paddingTop: 10;
`;

const ButtonContainer = styled.View`
  paddingHorizontal: 10;
  paddingBottom: 20;
  flex: 1;
`;

const ListContainer = styled.View`
  flex: 1
`;

const TipButton = styled.View`
  border-radius: 6;
  background-color: #000;
  color: #fff;
  padding-horizontal:6;
  padding-vertical:3;
  margin-right:5;
`

const styles = StyleSheet.create({
  menuIcon: {
    height: 39 * 0.4,
    marginLeft: 20,
    marginTop: 1,
    width: 63 * 0.4,
  },
});

class POS extends Component {

  static defaultProps = {
    walletAddress: '',
  };

  static navigatorStyle = {
    ...CONF.navigatorStyle,
    navBarHidden: true,
  };

  state = {
    lastTx: '',
    balance: 0,
    amount: '0',
    amountWithTip: '0',
    dustWei: 1,
    tip: 0,
    usdValue: 1,
    waitStarts: null,
    waitDefault: 5000,
    refreshingTransactions: false,
    transactions: [],
    activeTab: 0,
    interactionsComplete: false,
  };

  async componentDidMount() {
    console.log('POSOSOSSOSO', xPAY)
    this.W = xPAY.selectedWallet;

    InteractionManager.runAfterInteractions(() => {
      this.setState({interactionsComplete: true});
    });
    
    
      this.props.navigator.showLightBox({
        screen: 'LoadingLighbox',
        style: {
          backgroundBlur: 'light',
          backgroundColor: '#ffffff01',
          tapBackgroundToDismiss: true
        }
      });
      await this.onRefresh(false);
      this.listenForIncomingTx();
    
    this.props.navigator = this.throttleNav(this.props.navigator);
  }

  componentWillReceiveProps(newProps) {
    if ( newProps.selectedNetwork  ) {
      this.props.navigator.showLightBox({
        screen: 'LoadingLighbox',
        style: {
          backgroundBlur: 'light',
          backgroundColor: '#ffffff01',
          tapBackgroundToDismiss: true
        }
      });
      
      //xPAY.selectByWalletType();
      this.W = xPAY.selectedWallet;
      console.log('xPAY', xPAY)
      this.setState(
        {
          activeTab:1,
          currentBalance: 0,
          transactions: [],
        },
        () => {
          this.onRefresh(false);
        },
      );
    }
  }

  onRefresh = async (hardRefresh) => {
    const balance = await this.W.fetchBalance()
    await this.fetchTransactions(hardRefresh);
    console.log('balance', balance)
    this.setState({lastTx: this.W.transactions[0].transactionHash, balance: balance.toFixed(2)});
    this.props.navigator.dismissLightBox();
  };

  throttleNav(nav = this.props.navigator) {
    nav._navigated = null;
    nav.setOnNavigatorEvent(event => {
      if (event.id === 'didDisappear') {
        nav._navigated = null;
      }
    });

    nav.navigateTo = screenOptions => {
      if (!nav._navigated) {
        nav.push(screenOptions);
      }
      nav._navigated = true;

      setTimeout(() => {
        nav._navigated = null;
      }, 400);
    };

    return nav;
  }

  fetchTransactions = async (force) => {
    this.setState({
      refreshingTransactions: true,
      transactions:[]
    });

    await this.W.fetchTransactions();
    this.setState({
      refreshingTransactions: false,
      transactions: this.W.transactions,
    });
  };

  renderQrcode() {
    //const url = `${this.props.walletAddress}?value=${this.state.amountWithTip}e`;
    const url = `${this.props.walletAddress}`;
    console.log('URL', url);
    return(
      <QRCodeContainer>
        <IF what={this.state.interactionsComplete}>
          <QRCode value={url} size={200} />
        </IF>
        <IF what={!this.state.interactionsComplete}>
          <ActivityIndicator color={CONF.theme.primaryC} />
        </IF>
      </QRCodeContainer>
    )
  }

  async listenForIncomingTx() {
    console.log('Checking...')
    await this.W.fetchTransactions();
    const last = this.W.transactions[0];

    if( last && this.state.lastTx &&
      last.transactionHash !== this.state.lastTx && !this.state.waitStarts
    ) {
      this.props.navigator.showModal({
        screen: 'PaymentReceived',
        passProps: {
          tx: last
        }
      });

      setTimeout(this.props.navigator.dismissModal, 5000)
      this.setState({lastTx: last.transactionHash})
    }

    if( this.state.waitStarts ) {
      const wei = this.W.web3.toWei(this.state.amount);
      if( 
        last && last.valueWei === wei.toString() &&
        parseInt(last.timestamp) > this.state.waitStarts
      ) {
        this.setState({waitStarts: null})
        this.props.navigator.showModal({
          screen: 'PaymentReceived',
          passProps: {
            tx: last
          }
        });
      } 
    }

    setTimeout( this.listenForIncomingTx.bind(this), 3000)
  }

  addTip(howMuch) {
    const am = parseFloat(this.state.amount);
    const amWithTip = am + ((am/100) * howMuch);
    this.setState({amountWithTip: amWithTip.toFixed(2)})
  }

  render() {

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Column>
            <Row>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigator.navigateTo({
                    screen: 'Settings',
                    animationType: 'fade',
                  });
                }}
              >
                <Image source={menuIcon} style={styles.menuIcon} />
              </TouchableOpacity>

            </Row>
            
          </Column>
          

          <IF what={this.state.activeTab === 0}>
            <Title style={{marginTop:10}}>Your Balance</Title>
            <AmountInput style={{marginLeft:25}}>$ {this.state.balance}</AmountInput>
            <Title style={{marginVertical:10, fontSize:12, marginTop:20}}>Recent Payments</Title>
            <TransactionsList
              usdValue={1}
              network={this.props.selectedNetwork}
              selectedToken={this.props.selectedToken}
              pendingTx={this.props.localPendingtransactions}
              transactions={this.state.transactions}
              walletAddress={this.props.walletAddress}
              onRefresh={this.onRefresh}
              refreshing={this.state.refreshingTransactions}
              navigator={this.props.navigator}
            />
            <ButtonContainer style={{position: 'absolute', bottom: 0, left: 0, right:0}}>
              <PrimaryButton text="NEW PAYMENTS" onPress={ () => {
                this.setState({activeTab:1})
              }} />
            </ButtonContainer>
          </IF>

          <IF what={this.state.activeTab === 1}  style={{flex:1}}>
              <Center>
                <CenterAmount>Choose Amount</CenterAmount>
                <XDAILogo source={XDAI}/>
                <AmountInput>$ {this.state.amount}</AmountInput>
                <VirtualKeyboard color={'#000'} applyBackspaceTint={true} decimal={true} pressMode='string' onPress={(val) => {
                  this.setState({amount: val[0] === '.' ? `0${val}` : val })}
                } />
              </Center>

              <ButtonContainer style={{position: 'absolute', bottom: 0, left: 0, right:0}}>
                  <PrimaryButton text="CONTINUE" onPress={ () => {this.setState({activeTab:3, amountWithTip: this.state.amount}) }} />
                  <SecondaryButton text="CANCEL" onPress={ () => {this.setState({activeTab:0, amount: 0}) }} />
              </ButtonContainer>
          </IF>

          <IF what={this.state.activeTab === 3}>
              <Center>
                <CenterAmount>Scan QR Code to Pay</CenterAmount>
                <XDAILogo source={XDAI} style={{ width: 61 * 0.7, height: 61*.7}}/>
                <AmountInput style={{fontSize:20}}>$ {this.state.amountWithTip}</AmountInput>
                <Row>
                  <Text style={{marginRight:20}}>Add tip?</Text>

                <TouchableOpacity onPress={() => this.addTip(0)}>
                  <TipButton> 
                    <Text style={{color:'#fff'}}>0%</Text>
                  </TipButton>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.addTip(10)}>
                  <TipButton> 
                    <Text style={{color:'#fff'}}>10%</Text>
                  </TipButton>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.addTip(15)}>
                  <TipButton> 
                    <Text style={{color:'#fff'}}>15%</Text>
                  </TipButton>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.addTip(20)}>
                  <TipButton> 
                    <Text style={{color:'#fff'}}>20%</Text>
                  </TipButton>
                </TouchableOpacity>
                  
                </Row>
                {this.renderQrcode()}
              </Center>

              <ButtonContainer style={{position: 'absolute', bottom: 0, left: 0, right:0}}>
                  <SecondaryButton text="CANCEL" onPress={ () => {this.setState({activeTab:0, amount: 0}) }} />
              </ButtonContainer>
          </IF>
          

        </Container>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  session: state.session,
  walletAddress: '0xc96265c36f6d77747f9c259946a1ef55fce946b7',
  selectedToken: state.appReducer.selectedToken,
  selectedNetwork: state.appReducer.selectedNetwork,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(POS);
