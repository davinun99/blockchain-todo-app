App = {
    contracts: {},
    isLoading: false,
    load: async() => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */})
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },
    loadAccount: async () => {
        App.account = web3.eth.accounts[0];
        web3.eth.defaultAccount = web3.eth.accounts[0];
    },
    loadContract: async () => {
        const todoList = await $.getJSON('TodoList.json');
        App.contracts.TodoList = TruffleContract(todoList);
        App.contracts.TodoList.setProvider(App.web3Provider);
        App.todoList = await App.contracts.TodoList.deployed();
    },
    render: async () => {
        if(App.isLoading){
            return
        }
        App.setLoading(true);
        $('#account').html(App.account);
        App.renderTasks();
        App.setLoading(false);
    },
    setLoading: ( loadingState ) => {
        App.isLoading = loadingState;
        const loader = $('#loader');
        const content = $('#content');
        if(loadingState){
            loader.show();
            content.hide();
        }else{
            loader.hide();
            content.show()
        }
    },
    renderTasks: async () => {
        const taskCount = await App.todoList.taskCount();
        const $taskTemplate = $('.taskTemplate');
        for (let i = 1; i <= taskCount; i++) {
            const task = await App.todoList.tasks(i);
            const taskId = task[0].toNumber();
            const taskContent = task[1];
            const taskStatus =  task[2];
            const $newTaskTemplate = $taskTemplate.clone();
            $newTaskTemplate.find('.content').html(taskContent);
            $newTaskTemplate.find('input')
                .prop('name', taskId)
                .prop('checked', taskStatus)
                .on('click', App.toggleCompleted);
            if(taskStatus){
                $('#completedTaskList').append($newTaskTemplate);
            }else{
                $('#taskList').append($newTaskTemplate);
            }
            $newTaskTemplate.show();
        }
    },
    toggleCompleted: () => {

    },
    createTask: async() => {
        try {
            App.setLoading(true);
            const content = $('#newTask').val();
            // await App.todoList.createTask(content);
            // await App.loadContract();
            // await App.render();
            window.location.reload();
            // App.setLoading(false);    
        } catch (error) {
            console.log(error);
            //console.log(error.)
        }
        
    }
}
$(() => {
    $(window).load( ()=>{
        App.load()
    })
})