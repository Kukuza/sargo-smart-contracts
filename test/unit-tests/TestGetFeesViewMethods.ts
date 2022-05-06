/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { ethers } from "hardhat";
import { TestUtil } from "../testutils";

describe("Test Get Fees View Methods [ Unit Test ] ", function () {
  it("Test constructor passed values.", async function () {
    const testUtil = new TestUtil();
    await testUtil.intit();

    const wakalaAgentFee = await testUtil.wakalaEscrow.getAgentFee();
    const wakalaFee = await testUtil.wakalaEscrow.getWakalaFee();

    expect(wakalaAgentFee).to.equal(testUtil.agentFees);
    expect(wakalaFee).to.equal(testUtil.wakalaFees);
  });

  it("Test default values.", async function () {
    const WakalaEscrow = await ethers.getContractFactory("WakalaEscrow");
    const wakalaEscrow = await WakalaEscrow.deploy("", 0, 0, "");
    await wakalaEscrow.deployed();

    const wakalaAgentFee = await wakalaEscrow.getAgentFee();
    const wakalaFee = await wakalaEscrow.getWakalaFee();

    expect(wakalaAgentFee).to.equal(50000000000000000);
    expect(wakalaFee).to.equal(40000000000000000);
  });
});
