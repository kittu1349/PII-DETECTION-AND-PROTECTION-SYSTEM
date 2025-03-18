const express = require('express');
const Web3 = require('web3');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const web3 = new Web3('http://127.0.0.1:7545');

// copy and paste the same abi data as done in the index.js
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "cid",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "CIDStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "piiTypes",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imageHash",
				"type": "string"
			}
		],
		"name": "logPiiDetection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "detectedPii",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "imageHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "PIIDetected",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "cid",
				"type": "string"
			}
		],
		"name": "storeCID",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getCIDs",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = ''; // same as index.js, input the deployed contract address 
const piiTrackerContract = new web3.eth.Contract(contractABI, contractAddress);

// all api routes to get the blocks data
app.get('/api/events', async (req, res) => {
    try {
        const latestBlock = await web3.eth.getBlockNumber();
        const fromBlock = Math.max(0, latestBlock - 5000); 
        const piiEvents = await piiTrackerContract.getPastEvents('PIIDetected', {
            fromBlock,
            toBlock: 'latest'
        });

        // CIDStored
        const cidEvents = await piiTrackerContract.getPastEvents('CIDStored', {
            fromBlock,
            toBlock: 'latest'
        });

        const formattedPiiEvents = piiEvents.map(event => ({
            type: 'PIIDetected',
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
            sender: event.returnValues.sender,
            detectedPii: event.returnValues.detectedPii,
            imageHash: event.returnValues.imageHash,
            timestamp: new Date(parseInt(event.returnValues.timestamp) * 1000).toLocaleString(),
            rawTimestamp: parseInt(event.returnValues.timestamp)
        }));

        const formattedCidEvents = cidEvents.map(event => ({
            type: 'CIDStored',
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
            sender: event.returnValues.sender,
            cid: event.returnValues.cid,
            timestamp: new Date(parseInt(event.returnValues.timestamp) * 1000).toLocaleString(),
            rawTimestamp: parseInt(event.returnValues.timestamp)
        }));

        const allEvents = [...formattedPiiEvents, ...formattedCidEvents]
            .sort((a, b) => b.rawTimestamp - a.rawTimestamp);

        res.json({ status: 'success', events: allEvents });
    } catch (error) {
        console.error('Error fetching blockchain events:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch blockchain events' });
    }
});

// cid address basedd on the address
app.get('/api/cids/:address', async (req, res) => {
    const { address } = req.params;
    
    if (!web3.utils.isAddress(address)) {
        return res.status(400).json({ status: 'error', message: 'Invalid Ethereum address' });
    }
    
    try {
        console.log(`Looking up CIDs for address: ${address}`);
        const cids = await piiTrackerContract.methods.getCIDs(address).call();
        console.log(`Found ${cids.length} CIDs for address ${address}`);
        
        res.json({ status: 'success', cids });
    } catch (error) {
        console.error('Error retrieving CIDs:', error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve CIDs' });
    }
});


// list of transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const latestBlock = await web3.eth.getBlockNumber();
        const fromBlock = Math.max(0, latestBlock - 5000);
        
        let transactions = [];
        
        
        for (let i = fromBlock; i <= latestBlock; i++) {
            const block = await web3.eth.getBlock(i, true);
            
            if (block && block.transactions) {
                
                const contractTxs = block.transactions.filter(tx => 
                    tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()
                );
                
                for (const tx of contractTxs) {
                    const receipt = await web3.eth.getTransactionReceipt(tx.hash);
                    
                    let functionName = 'Unknown Function';
                    let decodedParams = {};
                    
                    try {
                        const decoded = web3.eth.abi.decodeParameters(
                            piiTrackerContract.options.jsonInterface
                                .find(item => item.signature === tx.input.slice(0, 10))?.inputs || [],
                            tx.input.slice(10)
                        );
                        
                        if (tx.input.startsWith('0x9b318a71')) {
                            functionName = 'logPiiDetection';
                            decodedParams = {
                                piiTypes: decoded[0],
                                imageHash: decoded[1]
                            };
                        } else if (tx.input.startsWith('0x65b5e5f8')) {
                            functionName = 'storeCID';
                            decodedParams = {
                                cid: decoded[0]
                            };
                        }
                    } catch (error) {
                        console.error('Error decoding transaction input:', error);
                    }
                    
                    transactions.push({
                        blockNumber: block.number,
                        timestamp: new Date(block.timestamp * 1000).toLocaleString(),
                        hash: tx.hash,
                        from: tx.from,
                        to: tx.to,
                        value: web3.utils.fromWei(tx.value, 'ether'),
                        gas: tx.gas,
                        gasPrice: web3.utils.fromWei(tx.gasPrice, 'gwei'),
                        status: receipt.status ? 'Success' : 'Failed',
                        functionName,
                        decodedParams
                    });
                }
            }
        }
        
        transactions.sort((a, b) => b.blockNumber - a.blockNumber);
        
        res.json({ status: 'success', transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch transactions' });
    }
});

app.get('/test-accounts', async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        
        const firstAccountCids = await piiTrackerContract.methods.getCIDs(accounts[0]).call();
        
        const balance = await web3.eth.getBalance(contractAddress);
        
        res.json({
            status: 'success',
            accounts: accounts,
            firstAccount: {
                address: accounts[0],
                cids: firstAccountCids,
                cidCount: firstAccountCids.length
            },
            contractBalance: web3.utils.fromWei(balance, 'ether')
        });
    } catch (error) {
        console.error('Error in test accounts:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.post('/test-store-cid', async (req, res) => {
    try {
        const { address } = req.body;
        const accounts = await web3.eth.getAccounts();
        
        const fromAccount = (address && web3.utils.isAddress(address)) ? address : accounts[0];
        
        const testCid = `test-cid-${Date.now()}`;
        
        console.log(`Storing test CID ${testCid} from account ${fromAccount}`);
        
        const result = await piiTrackerContract.methods
            .storeCID(testCid)
            .send({ from: fromAccount });
        
        const updatedCids = await piiTrackerContract.methods.getCIDs(fromAccount).call();
        
        res.json({
            status: 'success',
            testCid: testCid,
            fromAccount: fromAccount,
            transactionHash: result.transactionHash,
            updatedCids: updatedCids
        });
    } catch (error) {
        console.error('Error in test store CID:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 8083;
app.listen(PORT, () => {
    console.log(`Blockchain Admin Tool running on http://localhost:${PORT}`);
});
