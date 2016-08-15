import "Pingable.sol";

contract Pinger is Pingable {

	function Pinger() {
		owner = msg.sender;
	}

	function ping () onlyOwner {
		last_ping = now;
		Ping(msg.sender, last_ping);
	}
}