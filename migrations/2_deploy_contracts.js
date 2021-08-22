const TodoList = artifacts.require("./contracts/TodoList");

module.exports = function(deployer) {
  deployer.deploy(TodoList);
};
