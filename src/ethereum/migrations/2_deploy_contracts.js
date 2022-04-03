
//const OpinionToken = artifacts.require("OpinionToken");
const SafeMath = artifacts.require("SafeMath");
const Utils = artifacts.require("Utils");
const OpenAir = artifacts.require("OpenAir");
const SharedStructs = artifacts.require("SharedStructs");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  //deployer.link(SafeMath, OpinionToken);
  //deployer.deploy(OpinionToken);
  deployer.deploy(Utils);
  deployer.deploy(SharedStructs);
  deployer.link(Utils, OpenAir);
  deployer.link(SafeMath, OpenAir);
  deployer.link(SharedStructs, OpenAir);
  deployer.deploy(OpenAir);
};
