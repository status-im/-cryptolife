import xDAIWatchMode from '../class/xdai/xDAIWatchMode';
import EthereumWatchMode from '../class/ethereum/EthereumWatchMode';
import Web3 from 'web3';



const walletAddress = '0xc96265c36f6d77747f9c259946a1ef55fce946b7';

export default class WalletUtils {
  wallets = [];
  init() {
    //Importing wallet by passphrase
    this.ETH = new EthereumWatchMode(walletAddress);
    this.ETH.setWeb3();
    console.log('watchETH', this.ETH);

    this.XDAI = new xDAIWatchMode(walletAddress);
    this.XDAI.setWeb3()

    this.wallets.push(this.ETH);
    this.wallets.push(this.XDAI);

    this.selectedWallet = this.XDAI;
    this.syncWalletsData();

    //Polling
    setInterval(this.syncWalletsData.bind(this), 6000);
  }

  erase() {
    this.wallets = [];
    this.selectedWallet = null;
  }

  selectByWalletType() {

    let walletType = this.getWalletTypeBySelectedNetwork();
    switch (walletType) {
      
      case new xDAIWatchMode().type:
        this.selectedWallet = this.XDAI;
        break;
      case new EthereumWatchMode().type:
        this.selectedWallet = this.ETH;
        break;
      default:
        this.selectedWallet = this.ETH;
        break;
    }
    
  }

  async syncWalletsData() {
    this.wallets.forEach( async (wallet) => {
      await wallet.fetchBalance();
    });
  }

}
