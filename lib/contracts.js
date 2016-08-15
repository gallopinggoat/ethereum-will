
var Web3 = require('web3'); 

function Contracts(provider) {
	if (typeof provider == "undefined")
		provider = "http://localhost:8545";
	this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
	this.defaultAccount = this.web3.eth.accounts[0];
	this.interfaces = require('../contracts/cache/interfaces.json').interfaces;
	this.eth_contract = (abi) => {
		return this.web3.eth.contract(abi);
	}
}




Contracts.prototype.deploy = function (name, args) {

	var _defaultAccount = this.defaultAccount;
	var _data = this.interfaces[name].bin;
	var _gas = 3000000;
	var _abi = this.interfaces[name].abi;
	var _contract = this.eth_contract(JSON.parse(_abi));

	opts = {
		"from": this.defaultAccount,
		"data": _data,
		"gas": _gas
	}


	if (typeof args == "undefined")
		return _contract.new(opts, tx_callback);

	prefix = "_contract.new(";
	args = args.join();
	opts = JSON.stringify(opts);
	suffix = ",opts,tx_callback);"
	console.log(prefix + args + suffix);
	return eval(prefix + args + suffix);

}





function tx_callback (err, contract) {
	if (!err) {
		if (!contract.address) {
			console.log("Tx Hash: %s", contract.transactionHash);
		} else {
			console.log("Address: %s", contract.address);
		}
	} else {
		console.log(err);
	}
}



module.exports = Contracts;
