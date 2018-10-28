pragma solidity ^0.4.24;

/**
 * Author: Carlos Gonzalez -- Github: carlosgj94
 */
/** @title Bond . */

import "./LoanRegistry.sol";


contract Bond {
    uint BLOCKSPERYEAR = 2138648;

    event BondTransfered(address newOwner, uint bloomId);

    struct BondStruct {
        uint lender;
        address lenderAddress;
        uint borrower;
        address borrowerAddress;
        uint principal;
        uint bidTimeFrame;
        uint amountRepaid;
        bool defaulted;
        uint creationDate; // in block height
        uint duration; // The amount of years
        uint interestRate;
        bool granted;
        uint grade;
        address auditor;
    }

    BondStruct public bond;
  
    constructor (
        uint _borrower,
        uint _principal,
        uint _bidTimeFrame,
        uint _duration,
        uint _interestRate,
        address _loanRegistry,
        address _auditor
    ) public {
        BondStruct memory _bond = BondStruct({
            lender: 0,
            lenderAddress: address(0),
            borrower: _borrower,
            borrowerAddress: address(0),
            principal: _principal,
            bidTimeFrame: _bidTimeFrame,
            amountRepaid: 0,
            defaulted: false,
            creationDate: block.number,
            duration: _duration,
            interestRate: _interestRate,
            granted: false,
            grade: 0,
            auditor: _auditor
        });
        bond = _bond;

        LoanRegistry _loanRegistryContract = LoanRegistry(_loanRegistry);

        require(_loanRegistryContract.addLoan(_borrower, address(this)) == true);
    }

    function getBond() 
    public view returns(
        uint,
        address,
        uint,
        address,
        uint,
        uint,
        uint,
        bool,
        bool,
        uint,
        uint,
        uint,
        uint,
        address
    ) {
        return 
        (
            bond.lender,
            bond.lenderAddress,
            bond.borrower,
            bond.borrowerAddress,
            bond.principal,
            bond.bidTimeFrame,
            bond.amountRepaid,
            bond.defaulted,
            getComplete(),
            bond.creationDate,
            bond.duration,
            bond.interestRate,
            bond.grade,
            bond.auditor
        );
    }

    function getLender() public view returns(uint) {
        return bond.lender;
    }

    function getLenderAddress() public view returns(address) {
        return bond.lenderAddress;
    }

    function getBorrower() public view returns(uint) {
        return bond.borrower;
    }

    function getBorrowerAddress() public view returns(address) {
        return bond.borrowerAddress;
    }

    function getPrincipal() public view returns(uint) {
        return bond.principal;
    }

    function bidTimeFrame() public view returns(uint) {
        return bond.bidTimeFrame;
    }

    function getAmountRepaid() public view returns(uint) {
        return bond.amountRepaid;
    }

    function getComplete() public view returns(bool) {
        if (bond.creationDate + bond.bidTimeFrame + bond.duration * 2138648 <= block.number &&
            bond.amountRepaid >= getTotalToPay()) {
            return true;
        }
    }

    function getDefaulted() public view returns(bool) {
        return bond.defaulted;
    }

    function getCreationDate() public view returns(uint) {
        return bond.creationDate;
    }

    function getDuration() public view returns(uint) {
        return bond.duration;
    }

    function getInterestRate() public view returns(uint) {
        return bond.interestRate;
    }

    function getTotalToPay() public view returns(uint) {
        require(bond.granted == true);

        return bond.principal + (((bond.interestRate*100) / bond.principal) * bond.duration);
    }

    function getRating() public view returns(uint) {
        return bond.grade;
    }

    function getAuditor() public view returns(address) {
        return bond.auditor;
    }


    function getGrade() public view returns(uint) {
        return bond.grade;
    }

    function setRating(uint rate) public {
        require(msg.sender == bond.auditor);
        require(rate < 32);

        bond.grade = rate;
    }

    function isBiddingTime() public view returns(bool) {
        if (bond.creationDate + bond.bidTimeFrame < block.number)
            return true;
        else
            return false;
    }

    function setGrade(uint _grade) public {
        require(msg.sender == bond.auditor);
        require(_grade>=0 && _grade<21);
        bond.grade=_grade;
    }

    function addBid(uint _interestRate, uint _bloomId) public returns(bool) {
        require(_interestRate < bond.interestRate);
        require(bond.creationDate + bond.bidTimeFrame > block.number);
        require(getComplete() == false);
        
        bond.borrower = _bloomId;
        bond.borrowerAddress = msg.sender;
        bond.interestRate = _interestRate;
        return true;
    }

    function giveLoan() public payable {
        require(bond.creationDate + bond.bidTimeFrame < block.number);
        require(getComplete() == false);
        // One week to give the loan timeframe
        require(bond.creationDate + bond.bidTimeFrame + 41000 > block.number);

        if (msg.value >= bond.principal || address(this).balance >= bond.principal) {
            bond.granted = true;
            bond.borrowerAddress.transfer(msg.value);
        }
    }

    function payCouponRate() public payable {
        require(getComplete() == true);
        require(bond.creationDate + bond.bidTimeFrame > block.number);
        
        bond.amountRepaid += msg.value;
        bond.borrowerAddress.transfer(msg.value);
    }

    function setDefaulted() public {
        require(getComplete() == false);
        require(isBiddingTime() == false);

        uint _yearsPassed = (block.number - bond.creationDate + bond.bidTimeFrame)/2138648;
        if (
            (_yearsPassed >= bond.duration && getComplete() == false) ||
            (bond.amountRepaid < _yearsPassed * (bond.interestRate * 100) / bond.principal)
        ) {
            bond.defaulted = true;
            // These scammers...
            // Do something in here
        }

    }

    function transferBond(address _newOwner, uint _bloomId) public {
        require(msg.sender == bond.lenderAddress);

        bond.lenderAddress = _newOwner;
        bond.lender = _bloomId;
        emit BondTransfered(_newOwner, _bloomId);
    }
}
