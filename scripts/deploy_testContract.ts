import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";
import { TestContract, USDT, TestContract__factory } from "../typechain";

const RouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const USDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const compoundAddress = "0xc3d688B66703497DAA19211EEdff47f25384cdc3";

let testContract: TestContract;
let contract: any;
let user: SignerWithAddress;
let signers: SignerWithAddress[];

async function main() {
  signers = await ethers.getSigners();
  user = signers[0];

  try {
    contract = new TestContract__factory(user);
    testContract = await contract.deploy(
      USDTAddress,
      USDCAddress,
      RouterAddress,
      compoundAddress
    );
    console.log("Test contract deployed on :", testContract.address);

    
    // contract = new USDT__factory(user);
    // usdt = await contract.attach(USDTAddress);

    // await usdt
    //   .connect(user)
    //   .approve(testContract.address, expandTo6Decimals(50));

    // let tx = await testContract.connect(user).investment(expandTo6Decimals(50));

    // console.log("Tx hash for investment : ", tx.hash);
  } catch (error) {
    console.log(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
