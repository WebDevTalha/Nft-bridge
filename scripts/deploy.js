const hre = require("hardhat");

async function main() {
  console.log("Deploying contrct...");
  const Nft = await hre.ethers.deployContract("Nft");

  await Nft.waitForDeployment();

  console.log(Nft);

  console.log(`Nft Contract deployed to: ${Nft.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
