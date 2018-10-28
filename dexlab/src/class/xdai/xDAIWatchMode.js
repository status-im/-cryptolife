import EthereumWatchMode from '../ethereum/EthereumWatchMode';

export default class xDAIWatchMode extends EthereumWatchMode{
    /**
     * Accepts Valid bip32 passphrase
     * @param  {} secret=''
     */
    constructor(address=null) {
        super(address);
        this.type = 'xDAIWatchMode';
        this.name = 'xDAI Wallet';
        this.symbol = 'xDAI';
        this.networkUrl = 'https://dai.poa.network/';
        this.API_URL = 'https://blockscout.com/poa/dai/';
    }

    async getGasPrice() {
        return new Promise((resolve, reject) => {
            this.gasPrice = this.web3.fromWei(1, 'gwei');
            resolve(this.gasPrice);
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
              timestamp: t.timeStamp,
              transactionHash: t.hash,
              type: t.contractAddress !== '' ? 'transfer' : 'contract',
              value:  this.web3.fromWei(t.value, 'ether'),
              valueWei: t.value,
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