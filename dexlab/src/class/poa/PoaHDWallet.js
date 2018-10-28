import EthereumHDWallet from '../ethereum/EthereumHDWallet';
import {
    POA_NETWORK,
} from '../../utils/constants';

export default class PoaHDWallet extends EthereumHDWallet{
    /**
     * Accepts Valid bip32 passphrase
     * @param  {} secret=''
     */
    constructor(secret = null, address=null) {
        super(secret, address);
        this.type = 'PoaHDWallet';
        this.symbol = 'POA';
        this.name = 'POA Wallet';
        this.networkName = POA_NETWORK;
        this.networkUrl = 'https://core.poa.network';
        this.API_URL = 'https://blockscout.com/poa/core/';
        
        if( secret ) {
            this.setWeb3();
        }
    }

    async getGasPrice() {
        return new Promise((resolve, reject) => {
            this.gasPrice = this.web3.fromWei(1, 'gwei');
            resolve(this.gasPrice);
        });
    }

    async sendCoinTransaction(toAddress, amount) {
        return new Promise((resolve, reject) => {
            this.web3.eth.sendTransaction(
                {
                    to: toAddress,
                    value: this.web3.toWei(amount),
                    gasPrice: 1000000000
                }, 
                (error, transaction) => {
                    if (error) {
                        reject(error);
                    }

                    console.log('transaction', transaction)

                    resolve(transaction);
                },
            );
        });
    }

    async fetchEthTransactions() {
        const networkUrl = `${this.API_URL}api?module=account&action=txlist&address=${this.getAddress()}&sort=desc`;
        return fetch(networkUrl)
          .then(response => response.json())
          .then(res => res.result)
          .then(transactions => {
            this.transactions = transactions.map(t => ({
              from: t.from,
              timestamp: t.timestamp,
              transactionHash: t.hash,
              type: t.contractAddress !== '' ? 'transfer' : 'contract',
              value:  this.web3.fromWei(t.value, 'ether'),
            }));
            return this.transactions;
          });
    }

    async fetchERC20Transactions(contractAddress) {
        return null;
    }
    // TODO tests
    /**
     * Load the tokens based on network
     */
    async loadTokensList() {
        return null;
    }
}