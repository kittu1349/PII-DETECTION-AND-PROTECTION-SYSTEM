const express = require('express');
const Web3 = require('web3');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));


const web3 = new Web3('http://127.0.0.1:7545'); // locally hosted Ganache blockchain

// after compiling the solidity contract on remix, copy and paste the abi data from there to here
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
const contractAddress = ''; // after connecting to the ganache in the depoy section and deploying the contract, copy and paste the contract address

const piiTrackerContract = new web3.eth.Contract(contractABI, contractAddress);

app.post('/log-pii', async (req, res) => {
    const { sender, piiTypes, imageHash } = req.body;

    try {
        const accounts = await web3.eth.getAccounts();
        const result = await piiTrackerContract.methods
            .logPiiDetection(piiTypes, imageHash)
            .send({ from: accounts[0] }); 

        res.status(200).json({ status: 'success', transactionHash: result.transactionHash });
    } catch (error) {
        console.error('Error logging PII detection:', error);
        res.status(500).json({ status: 'error', message: 'Failed to log PII detection' });
    }
});

app.post('/store-cid', async (req, res) => {
    const { cid, sender } = req.body;

    if (!cid) {
        return res.status(400).json({ status: 'error', message: 'CID is required' });
    }

    try {
        const accounts = await web3.eth.getAccounts();
        
        let fromAccount = accounts[0];
        if (sender && web3.utils.isAddress(sender)) {
            fromAccount = sender;
        }
        
        console.log(`Storing CID ${cid} using account ${fromAccount}`);
        
        const result = await piiTrackerContract.methods
            .storeCID(cid)
            .send({ 
                from: fromAccount,
                gas: 6721975  // added high gas limit to prevent out-of-gas errors
            });

        console.log("Transaction complete. Result:", JSON.stringify({
            from: fromAccount,
            transactionHash: result.transactionHash,
            blockNumber: result.blockNumber,
            events: Object.keys(result.events || {})
        }, null, 2));

        res.status(200).json({ 
            status: 'success', 
            transactionHash: result.transactionHash,
            fromAddress: fromAccount,
            message: 'CID successfully stored on the blockchain'
        });
    } catch (error) {
        console.error('Error storing CID:', error);
        res.status(500).json({ status: 'error', message: 'Failed to store CID on the blockchain' });
    }
});

app.get('/get-cids/:address', async (req, res) => {
    const { address } = req.params;
    
    if (!web3.utils.isAddress(address)) {
        return res.status(400).json({ status: 'error', message: 'Invalid Ethereum address' });
    }
    
    try {
        console.log(`Looking up CIDs for address: ${address}`);
        const cids = await piiTrackerContract.methods.getCIDs(address).call();
        console.log(`Found ${cids.length} CIDs for address ${address}`);
        
        res.status(200).json({ status: 'success', cids });
    } catch (error) {
        console.error('Error retrieving CIDs:', error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve CIDs' });
    }
});

app.get('/get-accounts', async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        res.status(200).json({ status: 'success', accounts });
    } catch (error) {
        console.error('Error getting accounts:', error);
        res.status(500).json({ status: 'error', message: 'Failed to get accounts' });
    }
});

const PORT = 8082; // because 8081 already has a python code on it
app.listen(PORT, () => {
    console.log(`Blockchain middleware running on http://localhost:${PORT}`);
});
