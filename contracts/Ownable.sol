/* 
 *	Contract with a single property owner, and
 *  an abstract function to change ownership.
*/
contract Ownable {
	address owner;
	event ownerChange(address indexed _from,
					   address indexed _to);

	function Ownable () {
		owner = msg.sender;	
	}


	/*
	 * Simple default ownership transferring scheme.
	 * Override this in a derived contract to implement
	 * a custom scheme.
	*/
	function changeOwner (address _newOwner)
	onlyOwner {
		owner = _newOwner;
		ownerChange(msg.sender, _newOwner);
	}


	modifier onlyOwner {
		if (msg.sender == owner) {
			_
		} else {
			throw;
		}
	}
}