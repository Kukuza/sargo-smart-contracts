import { expect } from "chai";
import { TestUtil } from "../testutils";

describe("Test Get Next un-paired transaction.", function () {
  it("Get unpaired transaction.", async function () {
    const testUtil = new TestUtil();
    await testUtil.intit();

    await testUtil.cUSD.approve(testUtil.wakalaEscrow.address, 10);

    expect(await testUtil.wakalaEscrow.getNextTransactionIndex()).to.equal(0);

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
        .agentAcceptWithdrawalTransaction(0, "test phone number")
    )
      .to.emit("WakalaEscrow", "AgentPairingEvent")
      .withArgs(4, testUtil.user2Address.getAddress());

    // expect(
    const tx = await testUtil.wakalaEscrow
      .connect(testUtil.user2Address)
      .getNextUnpairedTransaction(1);
    expect(tx[4] === (await testUtil.user2Address.getAddress()));
  });
});
