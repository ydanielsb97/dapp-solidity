const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", () => {


    before(async () => {
        this.tasksContract = await TasksContract.deployed()
    })

    it("migrate deployed successfully", async () => {

        const address = await this.tasksContract.address;
        
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    })

    it("get Tasks List", async () => {
        const counter = await this.tasksContract.taskCounter();
        const task = await this.tasksContract.tasks(counter)
 
        assert.equal(counter, 1);
        assert.equal(task.id.toNumber(), counter);
        assert.equal(task.title, "My first task");
        assert.equal(task.description, "I have to do something");
        assert.equal(task.done, false);
    });

    it("create a Task", async () => {
        const result = await this.tasksContract.createTask("Test", "Description test");
        const counter = await this.tasksContract.taskCounter();
        const taskEvent = result.logs[0].args;

        assert.equal(taskEvent.id.toNumber(), counter.toNumber());

    });

    it("toggle done Task", async () => {
        
        const counter = await this.tasksContract.taskCounter();
        const task = await this.tasksContract.tasks(counter);
        const result = await this.tasksContract.toggleDone(counter);
        const { done } = result.logs[0].args;

        assert.notEqual(task.done, done);
    })
})