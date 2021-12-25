const TasksContract = artifacts.require("TasksContract");

module.exports = function (deployer) {
  deployer.deploy(TasksContract);
};
