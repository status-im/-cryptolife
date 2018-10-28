pragma solidity ^0.4.18;

contract DadiAuction {
    address owner;
    uint validTime;
    
    mapping(uint => address) winners;
    mapping(uint => uint) timeValidity;
    uint numberOfWinners;
    uint256 actualBid;
    
    constructor() public {
        owner = msg.sender;
        validTime = now;
    }
    
    function bid() public payable {
        if (validTime > now) { //if it's not a new auction
            if (msg.value > actualBid) //if higher bidder
            {
                winners[numberOfWinners].send(actualBid);
                winners[numberOfWinners] = msg.sender; //set the winner
                actualBid = msg.value; //set the new value to be win
            }
        }
        else
        {
            numberOfWinners ++; //increase index
            validTime = now + 15 seconds; //set 15 sec time for auction
            timeValidity[numberOfWinners] = validTime; //set it on the list
            actualBid = msg.value; //set the current winning value
            winners[numberOfWinners] = msg.sender; //set sender to winner
        }
    }
    
    function controller() public view returns (address) {
        if (timeValidity[numberOfWinners] < now){ //if the latest auction is not ongoing, return latest value
            return winners[numberOfWinners];
        }
        else 
        {
            if (numberOfWinners > 1)
            {
                return winners[numberOfWinners - 1]; //return previous winner
            }
        }
    }
    
    function total() public view returns(uint256){
         require (msg.sender == owner);
            return(address(this).balance);
    }
    
   function withdraw() public {
        require (msg.sender == owner);
            msg.sender.transfer(address(this).balance);
    }
}