import { expect } from "chai";
import { BigNumber } from "ethers";
import { TestUtil, WakalaEscrowTransaction } from "../testutils";

describe("Withdrawal E2E", function () {
  it("Test end to end withdrawal tx", async function () {
    const testUtil = new TestUtil();
    await testUtil.intit();

    const agentSigner = testUtil.user1Address;
    const clientSigner = testUtil.user2Address;

    const agentAddress = await agentSigner.getAddress();
    const clientAddress = await clientSigner.getAddress();

    await testUtil.cUSD.approve(testUtil.wakalaEscrow.address, 10);

    console.log(testUtil.cUSD.address);
    expect(await testUtil.wakalaEscrow.getNextTransactionIndex()).to.equal(0);

    let agentBalance = await testUtil.cUSD.balanceOf(agentAddress);
    let clientBalance = await testUtil.cUSD.balanceOf(clientAddress);

    // Initialize top up transaction.
    expect(
      await testUtil.wakalaEscrow
        .connect(clientSigner)
        .initializeDepositTransaction(5, "test phone number")
    )
      .to.emit("WakalaEscrow", "TransactionInitEvent")
      .withArgs(0, testUtil.user1Address.getAddress());

    // Check balances after method call.
    agentBalance = await testUtil.cUSD.balanceOf(agentAddress);
    clientBalance = await testUtil.cUSD.balanceOf(clientAddress);
    expect(agentBalance).to.equal(BigNumber.from("100"));
    expect(clientBalance).to.equal(BigNumber.from("0"));

    // Agent accept transaction
    expect(
      await testUtil.wakalaEscrow
        .connect(agentSigner)
        .agentAcceptDepositTransaction(0, "test phone number")
    )
      .to.emit("WakalaEscrow", "AgentPairingEvent")
      .withArgs(
        0,
        testUtil.user1Address.getAddress(),
        testUtil.user2Address.getAddress()
      );

    // Check balances after method call.
    agentBalance = await testUtil.cUSD.balanceOf(agentAddress);
    clientBalance = await testUtil.cUSD.balanceOf(clientAddress);
    expect(agentBalance).to.equal(BigNumber.from("95"));
    expect(clientBalance).to.equal(BigNumber.from("0"));

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
    expect(agentBalance).to.equal(BigNumber.from("95"));
    expect(clientBalance).to.equal(BigNumber.from("0"));

    // Agent confirm transaction.
    expect(
      await testUtil.wakalaEscrow.connect(agentSigner).agentConfirmPayment(0)
    )
      .to.emit("WakalaEscrow", "TransactionCompletionEvent")
      .withArgs(
        0,
        testUtil.user1Address.getAddress(),
        testUtil.user2Address.getAddress()
      );

    // Check balances after method call.
    agentBalance = await testUtil.cUSD.balanceOf(agentAddress);
    clientBalance = await testUtil.cUSD.balanceOf(clientAddress);
    const wakalaTreasury = await testUtil.cUSD.balanceOf(
      testUtil.wakalaTreasury.address
    );
    expect(wakalaTreasury).to.equal(BigNumber.from("1"));
    expect(agentBalance).to.equal(BigNumber.from("97"));
    expect(clientBalance).to.equal(BigNumber.from("2"));

    // Value above next tx index
    const tx2: WakalaEscrowTransaction = testUtil.convertToWakalaTransactionObj(
      await testUtil.wakalaEscrow
        .connect(testUtil.user2Address)
        .getTransactionByIndex(0)
    );
    console.log(tx2);
    expect(tx2.id).equal(0);
    expect(tx2.status).equal(4);
  });
});
