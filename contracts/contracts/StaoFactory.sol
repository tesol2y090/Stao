// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.10;
// import "@openzeppelin/contracts/access/Ownable.sol";

// import "./Stao.sol";
// import "./zora/ZoraNFTCreatorV1.sol";

// contract StaoFactory is Ownable {
// 	struct StaoInfo {
// 		address contractAddress;
// 		address owner;
// 		string name;
// 		string description;
// 		string portfolio;
// 		string facebook;
// 		uint256 amount;
// 		uint256 maxContributors;
// 	}

// 	StaoInfo[] public staos;
// 	uint256 public totalStaos;

// 	// Stao parameter
// 	uint256 public minDelay;
//   uint256 public quorumPercentage;
//   uint256 public votingPeriod;
//   uint256 public votingDelay;
// 	address public zoraNFTCreator;

// 	event CreateStao(address owner, address staoAddress, uint256 timestamp);

// 	constructor(
// 		uint256 _minDelay, 
//     uint256 _quorumPercentage, 
//     uint256 _votingPeriod, 
//     uint256 _votingDelay,
//     address _zoraNFTCreator
// 	) {
// 		minDelay = _minDelay;
// 		quorumPercentage = _quorumPercentage;
// 		votingPeriod = _votingPeriod;
// 		votingDelay = _votingDelay;
// 		zoraNFTCreator = _zoraNFTCreator;
// 	}

// 	function createStao(
// 		string memory _name,
// 		string memory _symbol,
// 		string memory _description, 
// 		string memory _portfolio, 
// 		string memory _facebook,
// 		uint256 _amount,
// 		uint256 _maxContributors
// 	) external {
// 		Stao stao = new Stao(_name, _symbol, _description, _amount, _maxContributors, minDelay, quorumPercentage, votingPeriod, votingDelay, ZoraNFTCreatorV1(zoraNFTCreator));

// 		stao.transferOwnership(msg.sender);

// 		staos.push(StaoInfo({
// 			contractAddress: address(stao),
// 			owner: msg.sender,
// 			name: _name,
// 			description: _description,
// 			portfolio: _portfolio,
// 			facebook: _facebook,
// 			amount: _amount,
// 			maxContributors: _maxContributors
// 		}));

// 		totalStaos += 1;

// 		emit CreateStao(msg.sender, address(stao), block.timestamp);

// 	}

// }