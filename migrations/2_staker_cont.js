const StakeMiner = artifacts.require("StakeMiner");

module.exports = function (deployer) {
  deployer.deploy(StakeMiner,"0x55d398326f99059fF775485246999027B3197955");
};
