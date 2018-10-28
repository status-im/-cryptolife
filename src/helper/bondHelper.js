import contract from 'truffle-contract'
import Bond from '../../build/contracts/Bond.json'

const BondHelper = {

  contract: null,

  instance: null,

  address: null,

  currentBlockNumber: null,

  init: function () {
    let self = this

    return new Promise(function (resolve, reject) {
      self.contract = contract(Bond)
      self.contract.setProvider(window.web3.currentProvider)

      // instantiate by address
      // var contractInstance = MyContract.at(DEPLOYED_ADDRESS)
        // Getting the accounts
      window.web3.eth.getAccounts(function (error, accounts) {
        if (error) {
          console.log(error)
        } else {
          self.address = accounts
          resolve()
        }
      })
    })
  },

  getCurrentBlockNumber: function () {
    let self = this
    return new Promise(function (resolve, reject) {
      // Getting the accounts
      window.web3.eth.getBlockNumber(function (error, number) {
        if (error) {
          // console.log(error)
          resolve(null)
        } else {
          self.currentBlockNumber = number
          resolve(number)
        }
      })
    })
  },

  initAddress: async function (address) {
    this.instance = await this.contract.at(address)
  },

  deploy: function (
    borrower,
    principal,
    bidTimeframe,
    duration,
    interestRate,
    loanRegistry,
    auditor
  ) {
    let self = this

    return new Promise(function (resolve, reject) {
      self.contract.new(
        borrower,
        principal,
        bidTimeframe,
        duration,
        interestRate,
        loanRegistry,
        auditor,
        {from: self.address[0]}
      ).then(instance => {
        self.instance = instance
      }).catch(err => {
        reject(err)
      })
    })
  },

  getBond: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.getBond.call().then((bond) => {
        resolve(bond)
      }).catch(err => {
        reject(err)
      })
    })
  },

  getBloomLender: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getLender.call().then((lender) => {
        resolve(lender.c[0])
      }).catch(err => {
        reject(err)
      })
    })
  },

  getBloomLenderAddress: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getLenderAddress.call().then((lender) => {
        resolve(lender)
      }).catch(err => {
        reject(err)
      })
    })
  },

  getBloomBorrower: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getBorrower.call().then((borrower) => {
        resolve(borrower.c[0])
      }).catch(err => {
        reject(err)
      })
    })
  },

  getBorrowerAddress: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getBorrowerAddress.call().then((borrower) => {
        resolve(borrower)
      }).catch(err => {
        reject(err)
      })
    })
  },

  getPrincipal: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getPrincipal.call().then((principal) => {
        resolve(principal.c[0])
      }).catch(err => {
        reject(err)
      })
    })
  },

  getBidTimeFrame: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.bidTimeFrame.call().then((bidTimeFrame) => {
        resolve(bidTimeFrame.c[0])
      }).catch(err => {
        reject(err)
      })
    })
  },

  getAmountRepaid: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getAmountRepaid.call().then((amountRepaid) => {
        resolve(amountRepaid.c[0])
      }).catch(err => {
        reject(err)
      })
    })
  },

  getComplete: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getComplete.call().then((complete) => {
        resolve(complete)
      }).catch(err => {
        reject(err)
      })
    })
  },

  getDefaulted: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getDefaulted.call().then((defaulted) => {
        resolve(defaulted)
      }).catch(err => {
        reject(err)
      })
    })
  },

  getCreationDate: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getCreationDate.call().then((date) => {
        resolve(date.c[0])
      }).catch(err => {
        reject(err)
      })
    })
  },

  getDuration: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getDuration.call().then((duration) => {
        resolve(duration.c[0])
      }).catch(err => {
        reject(err)
      })
    })
  },

  getInterestRate: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getInterestRate.call().then((interestRate) => {
        resolve(interestRate.c[0])
      }).catch(err => {
        reject(err)
      })
    })
  },

  getTotalToPay: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getTotalToPay.call().then((totalToPay) => {
        resolve(totalToPay.c[0])
      }).catch(err => {
        reject(err)
      })
    })
  },

  isBiddingTime: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.isBiddingTime.call().then((isBiddingTime) => {
        resolve(isBiddingTime)
      }).catch(err => {
        reject(err)
      })
    })
  },

  addBid: function (interestRate, bloomId) {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.addBid(
        interestRate,
        bloomId,
        {from: self.address[0], gas: 600000}
      ).then((winner) => {
        resolve(winner)
      }).catch(err => {
        reject(err)
      })
    })
  },
  giveLoan: function (amount) {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.giveLoan(
        {
          from: self.address[0],
          gas: 600000,
          value: amount
        }
      ).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  payCouponRate: function (amount) {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.payCouponRate(
        {
          from: self.address[0],
          gas: 600000,
          value: amount
        }
      ).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  setDefaulted: function (amount) {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.setDefaulted(
        {
          from: self.address[0],
          gas: 600000
        }
      ).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  transferBond: function (newOwner, bloomId) {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.transferBond(
        newOwner,
        bloomId,
        {
          from: self.address[0],
          gas: 600000
        }
      ).then((transfered) => {
        resolve(transfered)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default BondHelper
