var LoanRegistry = artifacts.require('./LoanRegistry.sol')
var AuditorsRegistry = artifacts.require('./AuditorsRegistry.sol')

module.exports = function (deployer) {
  deployer.deploy(LoanRegistry)
  deployer.deploy(AuditorsRegistry)
}
