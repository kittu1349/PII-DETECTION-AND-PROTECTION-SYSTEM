"use strict";

var express = require('express');

var Web3 = require('web3');

var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.json({
  limit: '10mb'
})); // Increase payload size limit if needed
// Connect to Ganache

var web3 = new Web3('http://127.0.0.1:7545'); // Replace with your Ganache URL
// Load the smart contract ABI and address

var contractABI = [{
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "sender",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "string",
    "name": "detectedPii",
    "type": "string"
  }, {
    "indexed": false,
    "internalType": "string",
    "name": "imageHash",
    "type": "string"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
  }],
  "name": "PIIDetected",
  "type": "event"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "piiTypes",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "imageHash",
    "type": "string"
  }],
  "name": "logPiiDetection",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];
var contractAddress = '0x338518a29DEA74EefA3f1194b495ed72A09C42F6'; // Replace with your deployed contract address

var piiTrackerContract = new web3.eth.Contract(contractABI, contractAddress); // Endpoint to log PII detection

app.post('/log-pii', function _callee(req, res) {
  var _req$body, sender, piiTypes, imageHash, accounts, result;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, sender = _req$body.sender, piiTypes = _req$body.piiTypes, imageHash = _req$body.imageHash;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(web3.eth.getAccounts());

        case 4:
          accounts = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(piiTrackerContract.methods.logPiiDetection(piiTypes, imageHash).send({
            from: accounts[0]
          }));

        case 7:
          result = _context.sent;
          // Use the first account from Ganache
          res.status(200).json({
            status: 'success',
            transactionHash: result.transactionHash
          });
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          console.error('Error logging PII detection:', _context.t0);
          res.status(500).json({
            status: 'error',
            message: 'Failed to log PII detection'
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11]]);
}); // Start the server

var PORT = 8082; // Use a different port than Flask

app.listen(PORT, function () {
  console.log("Blockchain middleware running on http://localhost:".concat(PORT));
});