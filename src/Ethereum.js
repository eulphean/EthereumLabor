class Ethereum {
    constructor() {
        // Initiate the Ethereum controller. 
        this.projectId = '24b152bca7704bf39741eed185972f92';
        this.infuraWS = 'wss://mainnet.infura.io/ws/v3/';

        // Ethereum subscriptions only work with a Websocket Provider.
        // This kind of a provider is available in Web3 release/1.0 branch.
        this.web3Provider = new Web3.providers.WebsocketProvider(this.infuraWS + this.projectId);
        this.web3 =new Web3(this.web3Provider);
    }

    getBlockTransactions(blockNumber, onTransactions) {
        // Array packed with all transactions in this block. 
        var transactions = []; 
        console.log('Request detailed Block data: ' + blockNumber);
        this.web3.eth.getBlock('latest', false, function(error, result) {
            if(!error) {
                if (result != null) {
                    // result.transactions.forEach(function(tx) {
                    //     transactions.push(tx); 
                    // });
                    console.log('Received Detailed Block data: ' + result.number);
                    console.log('# of Transactions: ' + result.transactions.length);
                    
                    // Send back transactions data with this callback
                    onTransactions(result.transactions); 
                } else {
                    console.warn('Oops: Result is null. Maybe the block is not ready to be extracted yet.');
                }
            }
            else {
                console.error(error);
            }
        });
    }

    subscribe(onTransaction, onBlock) {
        // Subscribe to pending transactions. 
        this.txSubscription = this.web3.eth.subscribe('pendingTransactions', function (error, result) {
        }).on("data", onTransaction); 

        // Subscribe to new blocks. 
        this.blockSubscription = this.web3.eth.subscribe('newBlockHeaders', function (error, result) {    
        }).on("data", onBlock); 
    }

    unsubscribe(onTransaction, onBlock) {
        // Unsubscribe from transactions. 
        this.txSubscription.unsubscribe(function (error, success) {
            //if (success)
            //console.log('Successfully unsubscribed from transactions. ');
            onTransaction();
        });

        // Unsubscribe from new blocks. 
        this.blockSubscription.unsubscribe(function (error, success) {
            //if (success)
            //console.log('Successfully unsubscribed from new blocks.');
            onBlock();
        });
    }
};