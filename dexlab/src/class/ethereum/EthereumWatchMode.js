import Web3 from 'web3';
import ProviderEngine from 'web3-provider-engine';
import Web3Subprovider from 'web3-provider-engine/subproviders/web3';
import { erc20Abi } from '../../utils/constants';
import findIndex from 'lodash/findIndex';
import isUndefined from 'lodash/isUndefined';
import Token from '../Token';

export default class EthereumWatchMode {
    constructor(address=null) {
        
        this.type = 'EthereumWatchWallet';
        this.name = 'ETH Wallet';
        this.networkUrl = 'https://mainnet.infura.io/Q1GYXZMXNXfKuURbwBWB';
        this.API_URL = 'https://api.etherscan.io/';
        this.CHAIN_ID = 1;
        this.symbol = 'ETH';
        this.nonce = 0;
        this.address = address;
        this.defaulTokenGasLimitLabel = 22000;
        this.watchOnly = true;
        this.decimal = 18;
        this.totalBalance = 0;
        this.balance = 0;
        this.tokens = [];
        this.transactions = [];
        this.usedAddresses = [];
    }

    getAddress(){
        return this.address;
    }

    /**
     * This method should return a promise
     */
    async sync() {
        await this.loadTokensList();
        await this.fetchBalance();
    }

    setWeb3() {
        const engine = new ProviderEngine();

        engine.addProvider(
            new Web3Subprovider(
                new Web3.providers.HttpProvider(this.networkUrl),
            ),
        );
        engine.start();

        this.web3 = new Web3(engine);
        this.web3.eth.defaultAccount = this.getAddress();
    }

    /**
     * return BigNumber
     */
    async fetchBalance() {
        return new Promise((resolve, reject) => {
            this.web3.eth.getBalance(this.getAddress(), (error, weiBalance) => {
            if (error) {
                console.error('error', error)
                reject(error);
            }

            const balance = this.web3.fromWei(weiBalance, 'ether');
            this.balance = balance;
            
            resolve(balance);
            });
        });
    }

    /**
     * return Number
     */
    async fetchERC20Balance(contractAddress, decimals = 18) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);

        const idx = this.findTokenIdx(contractAddress);
        const tokenDecimals = this.tokens[idx].decimals;
        return new Promise((resolve, reject) => {
          this.web3.eth
            .contract(erc20Abi)
            .at(contractAddress)
            .balanceOf(this.getAddress(), (error, decimalsBalance) => {
              if (error) {
                console.error(error);
                reject(error);
              }
              const balance = decimalsBalance / Math.pow(10, tokenDecimals);
              this.tokens[idx].balance = balance;
              this.tokens[idx].balanceDecimals = decimalsBalance;

              resolve(balance);
            });
        });
    }

    getERC20Balance(contractAddress) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);

        const idx = this.findTokenIdx(contractAddress);
        return this.tokens[idx].balance;
    }

    findTokenIdx(contractAddress) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);
        let idx = findIndex(this.tokens, function(o) { 
            if(!o.isNative){
                return o.contractAddress.toString().toLowerCase().trim() == contractAddress.toString().toLowerCase().trim(); 
            }
        });
        
        if( idx < 0) {
            // Token does not exist
            this.tokens.push(
                new Token(contractAddress.toString().toLowerCase().trim())
            )
            idx = findIndex(this.tokens, function(o) { 
                if(!o.isNative){
                    return o.contractAddress.toString().toLowerCase().trim() == contractAddress.toString().toLowerCase().trim(); 
                }
            });
        }
        return idx;
    }

    async fetchTransactions() {
        await this.fetchEthTransactions();
        return this.transactions;
    }

    async fetchEthTransactions() {
        networkUrl = `${this.API_URL}api?module=account&action=txlist&address=${this.getAddress()}&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken`;
        return fetch(networkUrl)
          .then(response => response.json())
          .then(res => res.result)
          .then(transactions => {
            this._lastPolling = (new Date()).getTime();
            this.transactions = transactions.filter( o => o.value !== '0').map(t => ({
              from: t.from,
              timestamp: t.timeStamp,
              transactionHash: t.hash,
              type: t.type,
              value: parseFloat(this.web3.fromWei(t.value, 'ether')).toFixed(5),
            }));
            return this.transactions;
          }).catch(e => console.log(e));
    }

    getERC20Transactions(contractAddress) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);

        const idx = this.findTokenIdx(contractAddress);
        return this.tokens[idx].transactions;
    }

    async fetchERC20Transactions(contractAddress) {
        if( isUndefined(contractAddress) || contractAddress === '' ) throw new Error(`contractAddress: is undefined`);
        
        return fetch(`https://api.ethplorer.io/getAddressHistory/${this.getAddress()}?token=${contractAddress}&apiKey=freekey`)
          .then(response => response.json())
          .then(data => {
            const idx = findIndex(this.tokens, ['contractAddress', contractAddress]);
            this.tokens[idx]._lastPolling = (new Date()).getTime(); 
            this.tokens[idx].transactions = (data.operations || []).map(t => {
              return {
                from: t.from,
                timestamp: t.timestamp,
                transactionHash: t.transactionHash,
                symbol: t.tokenInfo.symbol,
                type: t.type,
                value: (
                  parseInt(t.value, 10) / Math.pow(10, t.tokenInfo.decimals)
                ).toFixed(2),
              };
            });
        });
    }
}