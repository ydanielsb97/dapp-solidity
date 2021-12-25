
App = {
    contracts: {},
    init: async () => {
        console.log('Loaded');
        await App.loadEthereum();
        await App.loadAccount();
        await App.loadContracts();
        await App.render();
    },
    loadEthereum: async () => {
        if (window.ethereum) {

            App.web3Provider = window.ethereum
            await App.web3Provider.request({ method: 'eth_requestAccounts' })

        } else if (window.web3) {

            App.web3 = new Web3(window.web3.currentProvider);

        } else {
            console.log('No ethereum browser is insalled, Try it installing Metamask');
        }
    },
    loadAccount: async () => {
        const accounts = await App.web3Provider.request({ method: 'eth_requestAccounts' })
        App.account = accounts[0];
    },
    loadContracts: async () => {

        const res = await fetch('TasksContract.json');
        const tasksContractJSON = await res.json();

        App.contracts.tasksContract = TruffleContract(tasksContractJSON);
        App.contracts.tasksContract.setProvider(App.web3Provider);
        App.tasksContract = await App.contracts.tasksContract.deployed();
    },
    render: async () => {
        document.getElementById('account').innerText = App.account
        App.renderTasks();
    },
    renderTasks: async () => {
        const taskCounter = (await App.tasksContract.taskCounter()).toNumber();
        let containerTasks = document.getElementById('taskList');
        let template = ``;

        for(let i = 0; i <= taskCounter; i++){
            const task = await App.tasksContract.tasks(i);
            if(task) {
                if(!task[1] && !task[2]) continue;
                const taskFormatted = {
                    id: task[0],
                    title: task[1],
                    description: task[2],
                    done:  task[3],
                    createdAt: task[4]
                };

                template += `
                    <div class="card bg-dark rounded-0 mb-2">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <span>${taskFormatted.title}</span>
                            <div class="form-check form-switch"> 
                                <input class="form-check-input cursor-pointer" type="checkbox" data-id="${taskFormatted.id}" ${taskFormatted.done && "checked"} onchange="App.toggleDone(this)"/>
                            </div>
                        </div>
                        <div class="card-body">
                            <span>${taskFormatted.description}</span>
                            <p class="text-muted">${new Date(taskFormatted.createdAt * 1000).toLocaleString()}</p>
                        </div>
                    </div>
                `
            }
        }
        containerTasks.innerHTML = template;

    },
    createTask: async (data) => {

        const { title, description } = data;

        const result = await App.tasksContract.createTask(title, description, {
            from: App.account
        });

        console.log({ result: result });

    },
    toggleDone: async (element) => {
        await App.tasksContract.toggleDone(element.dataset.id, {
            from: App.account
        });
        App.renderTasks()
    }
}

App.init();