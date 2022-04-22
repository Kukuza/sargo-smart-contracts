import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { WakalaEscrow } from '../typechain/WakalaEscrow';

/**
 * @typedef {Object} WakalaEscrowTransaction Wakala escrow transaction object.
 * @property { number } id - the transaction id.
 * @property { TransactionType } txType - the transaction type.
 * @property { string } clientAddress - clientAddress the clients address.
 * @property { Status } status - the status of the transaction.
 * @property { number } amount - the amount of money being sent in the transaction.
 * @property { string } agentAddress - the agents address.
 * @property { number } wakalaFee - the amount of money retained by wakala DAO.
 * @property { number } grossAmount - the summation of all the money/crypto involved in the transaction.
 * @property { number } agentFee - the amount of money/crypto levied by the agent.
 * @property { boolean } agentApproval - true on agents approval.
 * @property { boolean } clientApproval - true on clients approval.
 * @property { string } clientPhoneNumber - the client`s phone number.
 * @property { string } agentPhoneNumber - the agent`s phone number.
 */
export type WakalaEscrowTransaction = {
  id: number;
  txType: number;
  clientAddress: string;
  status: number;
  netAmount: number;
  agentAddress?: string;
  wakalaFee: number;
  grossAmount: number;
  agentFee: number;
  agentApproval: string;
  clientApproval: string;
  clientPhoneNumber: string;
  agentPhoneNumber: string;
};

export class TestUtil {
  public cUSD!: Contract;
  public wakalaEscrow!: WakalaEscrow;
  public user1Address!: SignerWithAddress;
  public user2Address!: SignerWithAddress;
  public wakalaTreasury!: SignerWithAddress;
  public wakalaFees = 1;
  public agentFees = 2;

  //   constructor() {}

  async intit() {
    const [owner, address2, wakalaTreasury] = await ethers.getSigners();

    const CUSD = await ethers.getContractFactory("cUSD");
    const cUSD = await CUSD.deploy(100, "cUSD", 0, "cUSD");
    await cUSD.deployed();

    this.cUSD = cUSD;

    const WakalaEscrow = await ethers.getContractFactory("WakalaEscrow");
    const wakalaEscrow = await WakalaEscrow.deploy(
      cUSD.address,
      this.agentFees,
      this.wakalaFees,
      wakalaTreasury.address
    );
    await wakalaEscrow.deployed();

    this.wakalaEscrow = wakalaEscrow;
    this.user1Address = owner;
    this.user2Address = address2;
    this.wakalaTreasury = wakalaTreasury;
  }

  /**
   * Convert response to wakala transaction object.
   * @param tx the response object.
   * @returns the wakala transaction object.
   */
  convertToWakalaTransactionObj(tx: string[]): WakalaEscrowTransaction {
    const wakalaTx: WakalaEscrowTransaction = {
      id: parseInt(tx[0]),
      txType: parseInt(tx[1]),
      clientAddress: tx[2],
      agentAddress: tx[3],
      status: parseInt(tx[4]),
      netAmount: parseInt(tx[5]),
      agentFee: parseInt(tx[6]),
      wakalaFee: parseInt(tx[7]),
      grossAmount: parseInt(tx[8]),
      agentApproval: tx[9],
      clientApproval: tx[10],
      agentPhoneNumber: Buffer.from(tx[11], "base64").toString("ascii"),
      clientPhoneNumber: Buffer.from(tx[12], "base64").toString("ascii"),
    };

    return wakalaTx;
  }
}
