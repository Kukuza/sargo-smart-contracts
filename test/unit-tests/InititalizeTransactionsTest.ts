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

    const kukuzaTx = testUtil.convertToKukuzaTransactionObj(
      Array.from(
        await testUtil.kukuzaEscrow.getTransactionByIndex(0),
        (x) => `${x}`
      )
    );

    expect(kukuzaTx.id).to.equal(0);
    expect(kukuzaTx.agentFee).to.equal(testUtil.agentFees);
    expect(kukuzaTx.kukuzaFee).to.equal(testUtil.kukuzaFees);
    expect(kukuzaTx.netAmount).to.equal(
      5 - (testUtil.agentFees + testUtil.kukuzaFees)
    );
    expect(kukuzaTx.grossAmount).to.equal(5);
  });

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

    const kukuzaTx = testUtil.convertToKukuzaTransactionObj(
      Array.from(
        await testUtil.kukuzaEscrow.getTransactionByIndex(0),
        (x) => `${x}`
      )
    );

    expect(kukuzaTx.id).to.equal(0);
    expect(kukuzaTx.agentFee).to.equal(testUtil.agentFees);
    expect(kukuzaTx.kukuzaFee).to.equal(testUtil.kukuzaFees);
    expect(kukuzaTx.netAmount).to.equal(
      5 - (testUtil.agentFees + testUtil.kukuzaFees)
    );
    expect(kukuzaTx.grossAmount).to.equal(5);
  });
});
