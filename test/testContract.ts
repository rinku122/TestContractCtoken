import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";
import {
  USDT,
  TestContract__factory,
  TestContract,
  USDT__factory,
} from "../typechain";

import { expandTo6Decimals } from "../utilities/utilities";

import hre from "hardhat";
import { expect } from "chai";

const holderAddress: any = "0x18709E89BD403F470088aBDAcEbE86CC60dda12e"; //ETH and  USDT holder
const RouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const USDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const compoundAddress = "0xc3d688B66703497DAA19211EEdff47f25384cdc3";

describe("TestContract", async () => {
  let user1: SignerWithAddress;

  let signers: SignerWithAddress[];
  let USDT: USDT;
  let testContract: TestContract;
  let contract: any;

  beforeEach(async () => {
    signers = await ethers.getSigners();

    //Impersonating Account
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [holderAddress],
    });

    // Personated Account
    user1 = await ethers.getSigner(holderAddress);

    // Creating instance of  contract

    contract = new TestContract__factory(user1);
    testContract = await contract.deploy(
      USDTAddress,
      USDCAddress,
      RouterAddress,
      compoundAddress
    );

    contract = new USDT__factory(user1);
    USDT = await contract.attach(USDTAddress);
  });

  describe("Compound Protocol", async () => {
    it("Supplying USDC to Compound protocol from test contract", async () => {
      //Approving USDC for test Contract
      const reciptTokensBefore = (
        await testContract.balanceOf(user1.address)
      ).toNumber();

      // User having zero recipt tokens
      expect(reciptTokensBefore).to.be.eq(0);
      let tx: any = await USDT.connect(user1).approve(
        testContract.address,
        expandTo6Decimals(50)
      );
      console.log("Tx hash of approval for investment : ", tx.hash);

      tx = await testContract.connect(user1).investment(expandTo6Decimals(50));

      console.log("Tx hash for investment : ", tx.hash);

      // User gets recipt tokens
      const reciptTokensAfter = (
        await testContract.balanceOf(user1.address)
      ).toNumber();
      expect(reciptTokensAfter).to.be.above(0);
    });
  });
});
