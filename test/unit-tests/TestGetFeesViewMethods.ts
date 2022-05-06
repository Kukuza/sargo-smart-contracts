/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { BigNumber } from "ethers";
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
    const wakalaEscrow = await WakalaEscrow.deploy(
      "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
      0,
      0,
      "0xfF096016A3B65cdDa688a8f7237Ac94f3EFBa245"
    );
    await wakalaEscrow.deployed();

    const wakalaAgentFee = await wakalaEscrow.getAgentFee();
    const wakalaFee = await wakalaEscrow.getWakalaFee();

    expect(wakalaAgentFee).to.equal(BigNumber.from("50000000000000000"));
    expect(wakalaFee).to.equal(BigNumber.from("40000000000000000"));
  });
});
