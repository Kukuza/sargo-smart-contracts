import { expect } from "chai";
import { TestUtil } from "../testutils";

describe("Test Get Next un-paired transaction.", function () {
  it("Get unpaired transaction.", async function () {
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

    expect(
      await testUtil.kukuzaEscrow.initializeDepositTransaction(
        5,
        "test phone number"
      )
    )
      .to.emit("KukuzaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    expect(
      await testUtil.kukuzaEscrow.initializeDepositTransaction(
        5,
        "test phone number"
      )
    )
      .to.emit("KukuzaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    expect(
      await testUtil.kukuzaEscrow.initializeWithdrawalTransaction(
        5,
        "test phone number"
      )
    )
      .to.emit("KukuzaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    expect(
      await testUtil.kukuzaEscrow
        .connect(testUtil.user2Address)
        .agentAcceptWithdrawalTransaction(3, "test phone number")
    )
      .to.emit("KukuzaEscrow", "AgentPairingEvent")
      .withArgs(4, testUtil.user2Address.getAddress());

    // Exact value.
    const tx = await testUtil.kukuzaEscrow
      .connect(testUtil.user2Address)
      .getNextUnpairedTransaction(2);

    expect(tx.id).equal(2);

    // Value above next tx index
    const tx2 = await testUtil.kukuzaEscrow
      .connect(testUtil.user2Address)
      .getNextUnpairedTransaction(10);

    expect(tx2.id).equal(2);
  });
});
