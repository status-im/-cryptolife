import React, { Component } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import NoTransaction from '../../../../images/NoTransactions.png'
import xdaiIcon from '../../../../images/xdai_icon.png';
import CONF from '../../../../config';

const styles = StyleSheet.create({
  itemContainer: {
    borderColor: '#CECECE',
    borderBottomWidth: 0,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 25,
  },
  itemTitle: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Quicksand',
  },
  itemStatus: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },
  itemAmountContainer: {
    flexDirection: 'row',
  },
  itemAmountSymbol: {
    fontSize: 10,
    textAlign: 'right',
    fontFamily: 'OpenSans',
    fontWeight: '200',
  },
  itemAmount: {
    color: '#000000',
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'OpenSans',
  },
  itemTimestamp: {
    fontSize: 10,
    paddingTop: 5,
    textAlign: 'right',
    fontWeight: '200',
    fontFamily: 'OpenSans',
  },
  emptyListText: {
    // fontFamily: 'OpenSans',
    color: '#000000',
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 20,
  },
  receivedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderColor: '#CECECE',
    borderBottomWidth: 0.5,
    borderRadius: 25,
  },
  sentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#E34F4F',
    borderColor: '#CECECE',
    borderBottomWidth: 0.5,
    borderRadius: 25,
  },
});

export default class TransactionsList extends Component {

  openTxUrl(item) {
    this.props.navigator.showModal({
      screen: 'PaymentReceived',
      passProps: {
        tx: item
      }
    });
  }

  renderContractTx(item) {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => this.openTxUrl(item)}
      >
        <View>
          <View
            style={[
              styles.sentContainer,
              {
                backgroundColor: CONF.theme.primaryC,
                borderColor: CONF.theme.primaryC,
              },
            ]}
          >
            <Image
              source={exchangeIcon}
              style={{ height: 48 * 0.4, width: 54 * 0.4 }}
            />
          </View>
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.itemTitle}>Contract Approval</Text>
          <Text style={styles.itemStatus}>{item.to}</Text>
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            alignSelf: 'flex-start',
            right: 0,
            flex: 1,
          }}
        >
          <Text style={styles.itemTimestamp}>
            {item.timestamp
              ? moment(moment.unix(item.timestamp)).format('DD - MMM - YYYY')
              : item.blockNumber}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderTransferTx(item) {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => this.openTxUrl(item)}
      >
        <View>
            <View style={styles.receivedContainer}>
              <Image
                source={xdaiIcon}
                style={{ height: 61 * 0.6, width: 61 * 0.6}}
              />
            </View>
        </View>
        <View style={{ marginLeft: 10 , marginTop:10}}>
          <Text style={styles.itemStatus}>
            {item.from === this.props.walletAddress ? '-' : '+'}
            {` ${item.value} $`}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            alignSelf: 'flex-start',
            right: 0,
            flex: 1,
            marginTop:6
          }}
        >
          <Text style={styles.itemTimestamp}>
            {item.timestamp
              ? moment(moment.unix(item.timestamp)).format('DD - MMM - YYYY')
              : item.blockNumber}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      onRefresh,
      refreshing,
    } = this.props;

    const transactions = orderBy(
      this.props.transactions,
      ['timestamp'],
      ['desc'],
    );

    return (
      <View style={{flex:.82}}>
      <FlatList
        data={transactions}
        keyExtractor={item =>
          item.transactionHash ? item.transactionHash : item.blockNumber + item.value
        }
        ListEmptyComponent={
          <View>
            <Image
              resizeMode="contain"
              source={NoTransaction}
              style={{
                width: 540 * 0.4,
                height: 264 * 0.4,
                alignSelf: 'center',
                marginTop: 50,
                marginBottom: 20,
              }}
            />
          </View>
        }
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => {
          if (item.type === 'transfer') {
            return this.renderTransferTx(item);
          } else if (item.type === 'approve') {
            return this.renderContractTx(item);
          }
          return this.renderTransferTx(item);
        }}
      />
      </View>
    );
  }
}
