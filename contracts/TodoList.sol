pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0;
    struct Task {
        uint id;
        string content;
        bool completed;
    }
    mapping (uint => Task) public tasks;
    event TaskCreated(
        uint id,
        string content,
        bool completed
    );
    event TaskCompleted(
        uint id,
        bool completed
    );
    constructor() public {
        createTask("Check out dappuniversity.com!");
        createTask("Leave a star to davinun99's repository ;)");
    }
    function createTask( string memory _content ) public{
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }
    function toggleCompleted(uint _id) public {
        if(_id <= taskCount && _id > 0){
            Task memory _task = tasks[_id];
            _task.completed = !_task.completed;
            tasks[_id] = _task;
            emit TaskCompleted(_id, _task.completed);
        }   
    }
}
