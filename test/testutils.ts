import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { ethers } from "hardhat";

export class TestUtil {
  public cUSD!: Contract;
  public kukuzaEscrow!: any;
  public user1Address!: SignerWithAddress;
  public user2Address!: SignerWithAddress;
  public kukuzaTreasury!: SignerWithAddress;
  public kukuzaFees = 1;
  public agentFees = 2;

  //   constructor() {}

  async intit() {
    const [owner, address2, kukuzaTreasury] = await ethers.getSigners();

    const CUSD = await ethers.getContractFactory("cUSD");
    const cUSD = await CUSD.deploy(100, "cUSD", 0, "cUSD");
    await cUSD.deployed();

    this.cUSD = cUSD;

    const KukuzaEscrow = await ethers.getContractFactory("KukuzaEscrow");
    const kukuzaEscrow = await KukuzaEscrow.deploy(
      cUSD.address,
      this.agentFees,
      this.kukuzaFees,
      kukuzaTreasury.address
    );
    await kukuzaEscrow.deployed();

    this.kukuzaEscrow = kukuzaEscrow;
    this.user1Address = owner;
    this.user2Address = address2;
    this.kukuzaTreasury = kukuzaTreasury;
  }
}
