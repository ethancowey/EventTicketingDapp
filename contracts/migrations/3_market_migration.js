const TicketMarket = artifacts.require("TicketMarket");

module.exports = function (deployer) {
  deployer.deploy(TicketMarket);
};
