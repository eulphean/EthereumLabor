class Ethereum {
    constructor() {
        // Initiate the Ethereum controller. 
        this.projectId = 'f1c2741a46ef4b6da35206c7e2b32887';
        this.infuraWS = 'wss://mainnet.infura.io/ws/v3/';
        this.coinGeckoEndpoint = "https://api.coingecko.com/api/v3/";
        this.ethereumPrice = "simple/price?ids=ethereum&vs_currencies=usd"; 

        // Ethereum subscriptions only work with a Websocket Provider.
        // This kind of a provider is available in Web3 release/1.0 branch.
  
        //this.web3Provider = new Web3.providers.HttpProvider("https://www.ethercluster.com/morden"); 
        // this.web3Provider = new Web3.providers.WebsocketProvider("wss://ws.web3api.io?x-api-key=UAK9b30bf4dbaaf128904e1a1a49137d772");
        
        this.web3Provider = new Web3.providers.WebsocketProvider(this.infuraWS + this.projectId);
        this.web3 =new Web3(this.web3Provider);

        this.web3data = new Web3Data("UAK9b30bf4dbaaf128904e1a1a49137d772");
        this.web3data.connect(status => {
            console.log('status ->', status.type)
        }); 
    }

    subscribe(onTransaction, onBlock) {
        // Subscribe to pending transactions. 
        // this.txSubscription = this.web3.eth.subscribe('pendingTransactions', function (error, result) {
        //     console.log('Pending transaction'); 
        // }).on("data", onTransaction)
        // .on("error", function(e) {
        //     console.error(e); 
        //     console.error("Connection Failed");
        // })
        // .on("end", function(e) {
        //     console.log("Connection Ended");
        // })

        // // Subscribe to new blocks. 
        // this.blockSubscription = this.web3.eth.subscribe('newBlockHeaders', function (error, result) {    
        // }).on("data", onBlock); 

        // Subscribe to pending transactions. 
        this.web3data.on({ eventName: 'pending_transactions' }, data => {
           onTransaction(data.hash); 
        }); 

        // Subscribing to new blocks. 
        this.web3data.on({ eventName: 'block'}, data => {
            onBlock(data);
        });
    }

    unsubscribe() {
        // Unsubscribe from pending transactions. 
        // this.txSubscription.unsubscribe(function (error, success) {
        //     if (error) {
        //         console.error('Failed to unsubscribe');
        //     }
        // });

        // Unsubscribe from new block headers. 
        // this.blockSubscription.unsubscribe(function (error, success) {});
    }

    getBlockByNum(blockNum, onTransactions) {
        // var block = await this.web3data.eth.getBlock(blockNum, {validationMethod : 'full'}); 
        // var num; 
        // if (block.number) {
        //     num = block.number;
        // } else {
        //     num = block.blocks.current;
        // }
        // console.log('Current Block Number: ' + blockNum + ', ' + num);
        // if (blockNum == num) {
        //     console.log(block.validation.transactions);
        //     onTransactions(block.validation.transactions); 
        // }
        this.web3.eth.getBlock(blockNum, false, function(error, result) {
            if(!error) {
                if (result != null) {
                    var num = result.number; 
                    if (blockNum === num) {
                        // console.log('Fetched Block, Transactions: ' + blockNum + ', ' + result.transactions.length) ;
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
        // var block = await this.web3data.eth.getBlock('latest', {validationMethod : 'full'});
        // setBlockNum(block.number);
        this.web3.eth.getBlock('latest', false, function(error, result) {
            if(!error) {
                if (result != null) {
                    let blockNum = result.number; 
                    setBlockNum(blockNum);
                }
            }
        });
    }

    getEthereumPrice(onEthPrice) {
        var url = this.coinGeckoEndpoint + this.ethereumPrice; 
        loadJSON(url, onEthPrice); 
    }
};