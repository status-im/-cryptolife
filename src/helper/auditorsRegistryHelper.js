import contract from 'truffle-contract'
import AuditorsRegistryContract from '../../build/contracts/AuditorsRegistry.json'

const AuditorsRegistryHelper = {

  contract: null,

  instance: null,

  address: null,

  init: function () {
    let self = this

    return new Promise(function (resolve, reject) {
      self.contract = contract(AuditorsRegistryContract)
      self.contract.setProvider(window.web3.currentProvider)

      // instantiate by address
      // var contractInstance = MyContract.at(DEPLOYED_ADDRESS)
      self.contract.deployed().then(instance => {
        self.instance = instance

        // Getting the accounts
        window.web3.eth.getAccounts(function (error, accounts) {
          // Getting events
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

  selfRegister: function (
    name) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.selfRegister(
        name,
        {from: self.address[0], gas: 600000} // TODO: Gas forced to high #WARNING
      ).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  validateAuditor: function (
    addr) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.validateAuditor(
        addr,
        {from: self.address[0], gas: 600000} // TODO: Gas forced to high #WARNING
      ).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  getAuditor: function (addr) {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getAuditor.call(addr).then((auditor) => {
        resolve(auditor)
      }).catch(err => {
        reject(err)
      })
    })
  },

  getValidator: function (addr, index) {
    let self = this
    return new Promise((resolve, reject) => {
      self.instance.getValidator.call(addr, index).then((loans) => {
        resolve(loans)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default AuditorsRegistryHelper
