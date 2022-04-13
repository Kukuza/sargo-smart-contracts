import { expect } from "chai";
import { TestUtil } from "../testutils";

describe("Test Get Next un-paired transaction.", function () {
  it("Get unpaired transaction.", async function () {
    const testUtil = new TestUtil();
    await testUtil.intit();

    await testUtil.cUSD.approve(testUtil.wakalaEscrow.address, 10);

    expect(await testUtil.wakalaEscrow.getNextTransactionIndex()).to.equal(0);

    expect(
      await testUtil.wakalaEscrow.initializeDepositTransaction(
        5,
        "test phone number"
      )
    )
      .to.emit("WakalaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    expect(
      await testUtil.wakalaEscrow.initializeDepositTransaction(
        5,
        "test phone number"
      )
    )
      .to.emit("WakalaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    expect(
      await testUtil.wakalaEscrow.initializeDepositTransaction(
        5,
        "test phone number"
      )
    )
      .to.emit("WakalaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    expect(
      await testUtil.wakalaEscrow.initializeWithdrawalTransaction(
        5,
        "test phone number"
      )
    )
      .to.emit("WakalaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    expect(
      await testUtil.wakalaEscrow
        .connect(testUtil.user2Address)
        .agentAcceptWithdrawalTransaction(3, "test phone number")
    )
      .to.emit("WakalaEscrow", "AgentPairingEvent")
      .withArgs(4, testUtil.user2Address.getAddress());

    // Exact value.
    const tx = await testUtil.wakalaEscrow
      .connect(testUtil.user2Address)
      .getNextUnpairedTransaction(2);

    expect(tx.id).equal(2);

    // Value above next tx index
    const tx2 = await testUtil.wakalaEscrow
      .connect(testUtil.user2Address)
      .getNextUnpairedTransaction(10);

    expect(tx2.id).equal(2);
  });
});
