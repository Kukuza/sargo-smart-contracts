// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const WakalaEscrow = await ethers.getContractFactory("WakalaEscrow");
  const wakalaEscrow = await WakalaEscrow.deploy(
    "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
    0
  );

  await wakalaEscrow.deployed();

  console.log("WakalaEscrow deployed to: { ", wakalaEscrow.address, " } ");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
