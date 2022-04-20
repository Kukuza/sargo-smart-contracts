import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { ethers } from "hardhat";

export class TestUtil {
  public cUSD!: Contract;
  public wakalaEscrow!: any;
  public user1Address!: SignerWithAddress;
  public user2Address!: SignerWithAddress;

  //   constructor() {}

  async intit() {
    const [owner, address2] = await ethers.getSigners();

    const CUSD = await ethers.getContractFactory("cUSD");
    const cUSD = await CUSD.deploy(100, "cUSD", 0, "cUSD");
    await cUSD.deployed();

    this.cUSD = cUSD;

    const WakalaEscrow = await ethers.getContractFactory("WakalaEscrow");
    const wakalaEscrow = await WakalaEscrow.deploy(cUSD.address, 1);
    await wakalaEscrow.deployed();

    this.wakalaEscrow = wakalaEscrow;
    this.user1Address = owner;
    this.user2Address = address2;
  }
}
