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

    unsubscribe() {
        // Unsubscribe from pending transactions. 
        this.txSubscription.unsubscribe(function (error, success) {});

        // Unsubscribe from new block headers. 
        this.blockSubscription.unsubscribe(function (error, success) {});
    }

    getBlockByNum(blockNum, onTransactions) {
        this.web3.eth.getBlock(blockNum, false, function(error, result) {
            if(!error) {
                if (result != null) {
                    var num = result.number; 
                    if (blockNum === num) {
                        console.log('Fetched Block, Transactions: ' + blockNum + ', ' + result.transactions.length) ;
                        // Send back transactions data with this callback
                        onTransactions(result.transactions); 
                    }
                } 
            }
            else {
                console.error(error);
            }
        });
    }

    getLatestBlock(setBlockNum) {
        this.web3.eth.getBlock('latest', false, function(error, result) {
            if(!error) {
                if (result != null) {
                    let blockNum = result.number; 
                    setBlockNum(blockNum);
                }
            }
        });
    }
};