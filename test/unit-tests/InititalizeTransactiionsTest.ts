import { expect } from "chai";
import { TestUtil } from "../testutils";

describe("Test Initialize transactions.", function () {
  it("Test initialize withdrawal transactions.", async function () {
    const testUtil = new TestUtil();
    await testUtil.intit();

    await testUtil.cUSD.approve(testUtil.wakalaEscrow.address, 10);

    expect(await testUtil.wakalaEscrow.getNextTransactionIndex()).to.equal(0);

    expect(await testUtil.wakalaEscrow.initializeWithdrawalTransaction(5))
      .to.emit("WakalaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    expect(await testUtil.wakalaEscrow.getNextTransactionIndex()).to.equal(1);
  });
});

describe("Test Initialize transactions.", function () {
  it("Test initialize deposit transactions.", async function () {
    const testUtil = new TestUtil();
    await testUtil.intit();

    expect(await testUtil.wakalaEscrow.getNextTransactionIndex()).to.equal(0);

    expect(await testUtil.wakalaEscrow.initializeDepositTransaction(100000000))
      .to.emit("WakalaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    expect(await testUtil.wakalaEscrow.getNextTransactionIndex()).to.equal(1);
  });
});
