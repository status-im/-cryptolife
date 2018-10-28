

contract SomeToken {

    mapping(bytes32 => uint) balances;
    mapping(bytes32 => uint) nonces;
    
    function transfer (bytes32 r, bytes32 s, uint8 v, bytes32 hash, bytes32 to, uint256 value,  uint256 nonce, uint256 reward, address contractAddress, string chainId) payable public {

        address publicAddress = verifyHash(hash, v,r,s);
        require(balances[keccak256(publicAddress)] >= value);
        bytes32 h = keccak256(publicAddress, to, value, nonce, reward, contractAddress, chainId);
       
        require(hash == h, "hashes didnt match");

        ++nonces[keccak256(publicAddress)];

        // can make the transfer

        // TODO use safemath lib here
        balances[keccak256(publicAddress)] -= value;
        balances[to] += value;

    }

    function verifyHash(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public pure
                 returns (address signer) {

        bytes32 messageDigest = keccak256("\x19Ethereum Signed Message:\n32", hash);

        return ecrecover(messageDigest, v, r, s);
    }

    function nonce(bytes32 addr) public returns(uint) {
        return nonces[addr];
    }

    function balance(bytes32 addr) public returns (uint) {
        return balances[addr];
    }


    function mint(bytes32 addr) payable public {
        require(msg.value > 0, "please send some eth");
        balances[addr] += msg.value;

    }


    function transferUTXO(bytes32[] r, bytes32[] s, uint8[] v, bytes32[] hashes, bytes32[] to, uint[] values, uint[] nonces, uint reward, address contractAddress, string chainId ) public {
        require(r.length == s.length && s.length == v.length && v.length == to.length);
        require(contractAddress == address(this), "Not intended for this contract");
        require(keccak256(chainId) == keccak256("0x01"));
       
        for(uint i = 0; i < r.length; ++i) {         
            transfer(r[i], s[i],v[i],hashes[i], to[i], values[i], nonces[i], reward, contractAddress, chainId);
        }
        msg.sender.transfer(reward);

    }
}