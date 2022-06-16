/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { TestUtil } from "../testutils";

describe("Test Initialize transactions.", function () {
  it("Test initialize withdrawal transactions.", async function () {
    const testUtil = new TestUtil();
    await testUtil.intit();

    await testUtil.cUSD.approve(testUtil.wakalaEscrow.address, 10);

    expect(await testUtil.wakalaEscrow.getNextTransactionIndex()).to.equal(0);

    expect(
      await testUtil.wakalaEscrow.initializeWithdrawalTransaction(
        5,
        "KES",
        "116"
      )
    )
      .to.emit("WakalaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    const wakalaTx = testUtil.convertToWakalaTransactionObj(
      Array.from(
        await testUtil.wakalaEscrow.getTransactionByIndex(0),
        (x) => `${x}`
      )
    );

    expect(wakalaTx.id).to.equal(0);
    expect(wakalaTx.agentFee).to.equal(testUtil.agentFees);
    expect(wakalaTx.wakalaFee).to.equal(testUtil.wakalaFees);
    expect(wakalaTx.netAmount).to.equal(5);
    expect(wakalaTx.grossAmount).to.equal(
      5 + (testUtil.agentFees + testUtil.wakalaFees)
    );
  });

  it("Test initialize deposit transactions.", async function () {
    const testUtil = new TestUtil();
    await testUtil.intit();

    await testUtil.cUSD.approve(testUtil.wakalaEscrow.address, 10);

    expect(await testUtil.wakalaEscrow.getNextTransactionIndex()).to.equal(0);

    expect(
      await testUtil.wakalaEscrow.initializeDepositTransaction(5, "KES", "116")
    )
      .to.emit("WakalaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    const wakalaTx = testUtil.convertToWakalaTransactionObj(
      Array.from(
        await testUtil.wakalaEscrow.getTransactionByIndex(0),
        (x) => `${x}`
      )
    );

    expect(wakalaTx.id).to.equal(0);
    expect(wakalaTx.agentFee).to.equal(testUtil.agentFees);
    expect(wakalaTx.wakalaFee).to.equal(testUtil.wakalaFees);
    expect(wakalaTx.netAmount).to.equal(5);
    expect(wakalaTx.grossAmount).to.equal(
      5 + (testUtil.agentFees + testUtil.wakalaFees)
    );
  });
});
