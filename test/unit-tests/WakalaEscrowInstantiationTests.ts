import { expect } from "chai";
import { TestUtil } from "../testutils";

describe("Test instantiation values.", function () {
  it("Test", async function () {
    const testUtil = new TestUtil();
    await testUtil.intit();

    expect(await testUtil.wakalaEscrow.countSuccessfulTransactions()).to.equal(0);
    expect(await testUtil.wakalaEscrow.getNextTransactionIndex()).to.equal(0);
  });
});
