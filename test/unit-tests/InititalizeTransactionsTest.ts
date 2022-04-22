import { expect } from "chai";
import { TestUtil } from "../testutils";

describe("Test Initialize transactions.", function () {
  it("Test initialize withdrawal transactions.", async function () {
    const testUtil = new TestUtil();
    await testUtil.intit();

    await testUtil.cUSD.approve(testUtil.kukuzaEscrow.address, 10);

    expect(await testUtil.kukuzaEscrow.getNextTransactionIndex()).to.equal(0);

    expect(
      await testUtil.kukuzaEscrow.initializeWithdrawalTransaction(
        5,
        "test phone number"
      )
    )
      .to.emit("KukuzaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    expect(await testUtil.kukuzaEscrow.getNextTransactionIndex()).to.equal(1);
  });
});

describe("Test Initialize transactions.", function () {
  it("Test initialize deposit transactions.", async function () {
    const testUtil = new TestUtil();
    await testUtil.intit();
    await testUtil.cUSD.approve(testUtil.kukuzaEscrow.address, 10);

    expect(await testUtil.kukuzaEscrow.getNextTransactionIndex()).to.equal(0);

    expect(
      await testUtil.kukuzaEscrow.initializeDepositTransaction(
        5,
        "test phone number"
      )
    )
      .to.emit("KukuzaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    expect(await testUtil.kukuzaEscrow.getTransactionByIndex(0)).to.not.be.null;

    expect(await testUtil.kukuzaEscrow.getNextTransactionIndex()).to.equal(1);
  });
});
