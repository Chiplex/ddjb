import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting deployment of Decentralized Digital Justice Platform...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // For demo purposes, we'll create a mock ERC20 token as staking token
  console.log("\n📄 Deploying Mock Staking Token...");
  
  // Deploy a simple ERC20 token for staking (in production, use existing token)
  // const MockToken = await ethers.getContractFactory("@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20");
  // Note: This is a simplified deployment. In practice, you'd create a proper ERC20 contract
  
  // For now, let's deploy the main contract with a placeholder address
  // In production, replace this with actual staking token address
  const stakingTokenAddress = "0x0000000000000000000000000000000000000001"; // Placeholder
  
  console.log("\n⚖️ Deploying DecentralizedJusticeCore...");
  const DecentralizedJusticeCore = await ethers.getContractFactory("DecentralizedJusticeCore");
  const justice = await DecentralizedJusticeCore.deploy(stakingTokenAddress);
  
  await justice.waitForDeployment();
  const justiceAddress = await justice.getAddress();
  
  console.log("✅ DecentralizedJusticeCore deployed to:", justiceAddress);
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const minimumStake = await justice.MINIMUM_STAKE();
  console.log("Minimum stake:", ethers.formatEther(minimumStake), "tokens");
  
  const withdrawalDelay = await justice.STAKE_WITHDRAWAL_DELAY();
  console.log("Withdrawal delay:", withdrawalDelay.toString(), "seconds");
  
  console.log("\n🎉 Deployment completed successfully!");
  
  // Save deployment information
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      DecentralizedJusticeCore: justiceAddress,
      stakingToken: stakingTokenAddress
    },
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };
  
  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n🔧 Next steps:");
  console.log("1. Set up a proper staking token");
  console.log("2. Deploy and configure the reputation system");
  console.log("3. Update frontend with contract addresses");
  console.log("4. Configure network settings in environment variables");
  
  return deploymentInfo;
}

// Run the deployment
main()
  .then((deploymentInfo) => {
    console.log("Deployment info:", deploymentInfo);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
