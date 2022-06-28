/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { BigNumber } from "ethers";
import { TestUtil, WakalaEscrowTransaction } from "../testutils";

describe("Withdrawal E2E", function () {
  it("Test end to end withdrawal tx", async function () {
    const testUtil = new TestUtil();
    await testUtil.intit();

    const agentSigner = testUtil.user2Address;
    const clientSigner = testUtil.user1Address;

    const agentAddress = await agentSigner.getAddress();
    const clientAddress = await clientSigner.getAddress();

    await testUtil.cUSD.approve(testUtil.wakalaEscrow.address, 10);

    expect(await testUtil.wakalaEscrow.getNextTransactionIndex()).to.equal(0);

    let agentBalance = await testUtil.cUSD.balanceOf(agentAddress);
    let clientBalance = await testUtil.cUSD.balanceOf(clientAddress);

    // Initialize withdraw transaction.
    expect(
      await testUtil.wakalaEscrow
        .connect(clientSigner)
        .initializeWithdrawalTransaction(5, "KES", "116")
    )
      .to.emit("WakalaEscrow", "TransactionInitEvent")
      .withArgs(0, clientAddress);

    // Check balances after method call.
    agentBalance = await testUtil.cUSD.balanceOf(agentAddress);
    clientBalance = await testUtil.cUSD.balanceOf(clientAddress);
    expect(agentBalance).to.equal(BigNumber.from("0"));
    expect(clientBalance).to.equal(BigNumber.from("92"));

    // Agent accept transaction
    expect(
      await testUtil.wakalaEscrow
        .connect(agentSigner)
        .agentAcceptWithdrawalTransaction(0, "test phone number")
    )
      .to.emit("WakalaEscrow", "AgentPairingEvent")
      .withArgs(0, clientAddress, agentAddress);

    // Check balances after method call.
    agentBalance = await testUtil.cUSD.balanceOf(agentAddress);
    clientBalance = await testUtil.cUSD.balanceOf(clientAddress);
    expect(agentBalance).to.equal(BigNumber.from("0"));
    expect(clientBalance).to.equal(BigNumber.from("92"));

    // Client confirm transaction.
    expect(
      await testUtil.wakalaEscrow.connect(clientSigner).clientConfirmPayment(0)
    )
      .to.emit("WakalaEscrow", "ConfirmationCompletedEvent")
      .withArgs(
        0,
        testUtil.user1Address.getAddress(),
        testUtil.user2Address.getAddress()
      );

    // Check balances after method call.
    agentBalance = await testUtil.cUSD.balanceOf(agentAddress);
    clientBalance = await testUtil.cUSD.balanceOf(clientAddress);
    expect(agentBalance).to.equal(BigNumber.from("0"));
    expect(clientBalance).to.equal(BigNumber.from("92"));

    // Agent confirm transaction.
    expect(
      await testUtil.wakalaEscrow.connect(agentSigner).agentConfirmPayment(0)
    )
      .to.emit("WakalaEscrow", "TransactionCompletionEvent")
      .withArgs(0, agentAddress, clientAddress);

    // Check balances after method call.
    agentBalance = await testUtil.cUSD.balanceOf(agentAddress);
    clientBalance = await testUtil.cUSD.balanceOf(clientAddress);
    const wakalaTreasury = await testUtil.cUSD.balanceOf(
      testUtil.wakalaTreasury.address
    );
    expect(wakalaTreasury).to.equal(BigNumber.from("1"));
    expect(agentBalance).to.equal(BigNumber.from("7"));
    expect(clientBalance).to.equal(BigNumber.from("92"));

    // Value above next tx index
    const tx2: WakalaEscrowTransaction = testUtil.convertToWakalaTransactionObj(
      await testUtil.wakalaEscrow
        .connect(testUtil.user2Address)
        .getTransactionByIndex(0)
    );

    expect(tx2.id).equal(0);
    expect(tx2.status).equal(4);
  });
});
