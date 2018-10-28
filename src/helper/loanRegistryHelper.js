import contract from 'truffle-contract'
import LoanRegistryContract from '../../build/contracts/LoanRegistry.json'

const LoanRegistry = {

  contract: null,

  instance: null,

  address: null,

  LoanCreated: null,

  init: function () {
    let self = this

    return new Promise(function (resolve, reject) {
      self.contract = contract(LoanRegistryContract)
      self.contract.setProvider(window.web3.currentProvider)

      // instantiate by address
      // var contractInstance = MyContract.at(DEPLOYED_ADDRESS)
      self.contract.deployed().then(instance => {
        self.instance = instance

        // Getting the accounts
        window.web3.eth.getAccounts(function (error, accounts) {
          // Getting events
          self.LoanCreated = self.instance.LoanCreated()
          if (error) {
            console.log(error)
          } else {
            self.address = accounts
            resolve()
          }
        })
      }).catch(err => {
        reject(err)
      })
    })
  },

  getAddress: function () {
    return this.instance.address
  },

  LoanCreatedEvent: function () {
    this.LoanCreated.watch(function (error, result) {
      if (!error) {
        console.log('Test Value: ', result)
      } else {
        console.log(error)
      }
    })
  },

  addLoan: function (
    bloomId,
    loanAddress) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.addLoan(
        bloomId,
        loanAddress,
        {from: self.address[0], gas: 600000} // TODO: Gas forced to high #WARNING
      ).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  getLoansLength: function () {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getLoansLength.call().then((loansLength) => {
        resolve(loansLength.c[0])
      }).catch(err => {
        reject(err)
      })
    })
  },

  getLoans: function (index) {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getLoans.call(index).then((loans) => {
        resolve(loans)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default LoanRegistry
