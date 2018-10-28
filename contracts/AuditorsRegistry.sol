pragma solidity ^0.4.24;

/**
 * Author: xaxa 
 */

/** @title Auditors Registry. */
/** @dev Allows to self register as an auditor, with a stake, and users to validate to consolidate your position */

contract AuditorsRegistry {
    struct Auditor {
      string name;
      address[] validations;
      bool unlisted;
      uint reputation;
    }

    mapping(address => Auditor) public auditors;

    function selfRegistration(string _name) public payable {
      //primitive barrier to entry: a stake ( disabled to facilitate testing)
      // require(msg.value == 1 ether);
      auditors[msg.sender].name= _name;
    }

    function selfUnlisting() public  {
      require(!auditors[msg.sender].unlisted );
      auditors[msg.sender].unlisted= true;
      // msg.sender.transfer(1 ether);
    }

    function getAuditor(address _addr) public view returns(string) {
        return auditors[_addr].name;
    }

    function validateAuditor(address _addr) public {
      auditors[_addr].validations.push(msg.sender);
      //if the validator is itself an auditor it adds some of its reputation
      auditors[_addr].reputation = 1 + auditors[msg.sender].reputation/2;
    }

    function getValidator(address _addr, uint _index) public view returns(address) {
        return auditors[_addr].validations[_index];
    }

}
