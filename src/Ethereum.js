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