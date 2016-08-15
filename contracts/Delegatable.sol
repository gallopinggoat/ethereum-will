import "Ownable.sol";


/* 
 * Contract deriving from Ownable, enabling a selected
 * set of delegates to change ownership.
*/ 
contract Delegatable is Ownable() {
	mapping (address => bool) public delegates;

	function Delegatable () {
		delegates[msg.sender] = true;
	}

	function addDelegate (address _addr) {
		delegates[_addr] = true;
	}

	function removeDelegate (address _addr) {
		delegates[_addr] = false;
	}

	function changeOwner(address _newOwner)
	onlyDelegate (msg.sender) {
		owner = _newOwner;
		ownerChange(msg.sender, _newOwner);
	}


	modifier onlyDelegate (address _addr) {
		if (delegates[_addr]) _
		else throw;
	}
}

