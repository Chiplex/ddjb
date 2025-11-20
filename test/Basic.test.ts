import { expect } from "chai";
import { ethers } from "hardhat";
import { DecentralizedJusticeCore } from "../typechain-types";

describe("DecentralizedJusticeCore", function () {
    let justice: DecentralizedJusticeCore;
    let owner: any;
    let otherAccount: any;
    let stakingTokenAddress: string;

    beforeEach(async function () {
        [owner, otherAccount] = await ethers.getSigners();

        // Use a dummy address for the staking token for now
        stakingTokenAddress = "0x0000000000000000000000000000000000000001";

        const DecentralizedJusticeCore = await ethers.getContractFactory("DecentralizedJusticeCore");
        justice = await DecentralizedJusticeCore.deploy(stakingTokenAddress);
        await justice.waitForDeployment();
    });

    it("Should set the right minimum stake", async function () {
        const minimumStake = await justice.MINIMUM_STAKE();
        // 1000 tokens with 18 decimals
        const expectedStake = ethers.parseEther("1000");
        expect(minimumStake).to.equal(expectedStake);
    });

    it("Should set the right withdrawal delay", async function () {
        const delay = await justice.STAKE_WITHDRAWAL_DELAY();
        // 7 days in seconds
        expect(delay).to.equal(604800);
    });
});
