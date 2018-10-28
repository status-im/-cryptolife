const web3 = require("web3")

const ethers = require("ethers")

doSomething()

async function doSomething() {



const wallet = ethers.Wallet
const myWallet = wallet.createRandom()
const myPrivatekey = myWallet.signingKey.keyPair.privateKey
const address = myWallet.address


const MyOldWallet = wallet.createRandom()
const MyOldPrivateKey = myWallet.signingKey.keyPair.privateKey
const myOldAddress = MyOldWallet.signingKey.address


const toAddress = "0xB4874035112A4702A5C9F790D650F247345CD7F873259CF379F98AE5D537A15C";
const contractAddress = 0x0

console.log(address)

const myBalance = 10;
const toSend = 10

const arrayOfSigs = []

const values = getValues(myBalance, toSend)

// console.log("mysig is: ", mySig)
// const firstSigRSV = ethers.utils.splitSignature(await MyOldWallet.signMessage(ethers.utils.arrayify(firstHash)))
// console.log(firstSigRSV)
// mySig.r = firstSigRSV.r
// mySig.s = firstSigRSV.s
// mySig.v = firstSigRSV.v
// mySig.hash = firstHash

if(values.length == 2) {
    // 2 outputs
    const myNewBalance = values[0]
    const receiverBalance = values[1]
    const someToo = hash(toAddress)
    const meNew = hash(address)
    
    let mySig = {
        from: myOldAddress,
        to: meNew,
        value: myNewBalance,
        nonce: 0,
        reward: 1,
        contractAddress: "0xca35b7d915458ef540ade6068dfe2f44e8fa733c",
        chainId: "0x01"
    }

    let secondSig = {
        from: myOldAddress,
        to: someToo,
        value: receiverBalance,
        nonce: 1,
        reward: 1,
        contractAddress:"0xca35b7d915458ef540ade6068dfe2f44e8fa733c",
        chainId: "0x01"  
    }


    const firstHash = ethers.utils.solidityKeccak256(["address", "bytes32", "uint256","uint256","uint256","address", "string"] , [mySig.from, mySig.to, mySig.value, mySig.nonce, mySig.reward, mySig.contractAddress, mySig.chainId ])
    console.log("hash 1 ----------+--->", firstHash)
    console.log("mysig is: ", mySig)
    const firstSigRSV = ethers.utils.splitSignature(await MyOldWallet.signMessage(ethers.utils.arrayify(firstHash)))
    console.log(firstSigRSV)
    mySig.r = firstSigRSV.r
    mySig.s = firstSigRSV.s
    mySig.v = firstSigRSV.v
    mySig.hash = firstHash



    const secondHash = ethers.utils.solidityKeccak256(["address", "bytes32", "uint256","uint256","uint256","address", "string"] , [secondSig.from, secondSig.to, secondSig.value, secondSig.nonce, secondSig.reward, secondSig.contractAddress, secondSig.chainId ])
    const secondhashSigRSV = ethers.utils.splitSignature(await MyOldWallet.signMessage((ethers.utils.arrayify(secondHash))))
    console.log(secondhashSigRSV)

    secondSig.r = secondhashSigRSV.r
    secondSig.s = secondhashSigRSV.s
    secondSig.v = secondhashSigRSV.v
    secondSig.hash = secondHash

    arrayOfSigs.push(mySig)
    arrayOfSigs.push(secondSig)

  
} else {
    // single output

    
    
    let secondSig = {
        from: myOldAddress,
        to: hash(toAddress),
        value: toSend,
        nonce: 1,
        reward: 1,
        contractAddress:"0xca35b7d915458ef540ade6068dfe2f44e8fa733c",
        chainId: "0x01"  
    }


    const secondHash = ethers.utils.solidityKeccak256(["address", "bytes32", "uint256","uint256","uint256","address", "string"] , [secondSig.from, secondSig.to, secondSig.value, secondSig.nonce, secondSig.reward, secondSig.contractAddress, secondSig.chainId ])
    const secondhashSigRSV = ethers.utils.splitSignature(await MyOldWallet.signMessage((ethers.utils.arrayify(secondHash))))
    console.log(secondhashSigRSV)

    secondSig.r = secondhashSigRSV.r
    secondSig.s = secondhashSigRSV.s
    secondSig.v = secondhashSigRSV.v
    secondSig.hash = secondHash

    arrayOfSigs.push(secondSig)
    
}


makeInputs(arrayOfSigs)
}
// h = hash(address)
// create a new eth account
// hash the address of the new eth account
// store the private key // to be used next time


function makeInputs(arrayOfSigs) {
    const arrayOfRs = []
    const arrayOfSs = []
    const arrayOfVs = []
    const arrayOfHashes = []
    const tos = []
    const values = []
    const nonces = []



    for(let i = 0; i < arrayOfSigs.length; ++i ) {
        
        arrayOfRs.push(arrayOfSigs[i].r)
        arrayOfSs.push( arrayOfSigs[i].s)
        arrayOfVs.push(arrayOfSigs[i].v)
        arrayOfHashes.push(arrayOfSigs[i].hash)
        tos.push(arrayOfSigs[i].to)
        values.push(arrayOfSigs[i].value)
        nonces.push(arrayOfSigs[i].nonce)
    }

   console.log(arrayOfRs, arrayOfSs, arrayOfVs, arrayOfHashes, tos, values, nonces, arrayOfSigs[0].reward,arrayOfSigs[0].contractAddress, arrayOfSigs[0].chainId )
}

function getValues(balance, toSend) {
    // for a simple transaction
    if ((balance - toSend) == 0  ) return [toSend]  

    return [balance - toSend, toSend]

}

function hash(addr) {
    return ethers.utils.solidityKeccak256(["address"],[addr])
}

// hash the contents
// divide the utxos
// sign the messages

//forward to a server
//server makes a transaction
//relayer gets the reward

