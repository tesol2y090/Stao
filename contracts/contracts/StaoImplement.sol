// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/access/Ownable.sol";

import "./zora/ZoraNFTCreatorV1.sol";
import "./zora/interfaces/IERC721Drop.sol";

contract StaoImplement is Ownable {

	ZoraNFTCreatorV1 public zoraNFTCreator;
	IERC721Drop public staoNFT;

	string public name;
	string public symbol;
	uint64 public editionSize;
	uint16 public royaltyBPS;
  address payable public fundsRecipient;
  address public defaultAdmin;
  IERC721Drop.SalesConfiguration public saleConfig;
  string public description;
  string public animationURI;
  string public imageURI;

	bool public isVoteCompleted;

	event CreateNFT(address creator, address collection, uint256 timestamp);

	constructor(ZoraNFTCreatorV1 _zoraNFTCreator) {
			zoraNFTCreator = _zoraNFTCreator;
			fundsRecipient = payable(msg.sender);
			defaultAdmin = msg.sender;
	}

	function setName(string memory _name) public onlyOwner {
			name = _name;
	}

	function setSymbol(string memory _symbol) public onlyOwner {
			symbol = _symbol;
	}

	function setEditionSize(uint64 _editionSize) public onlyOwner {
			editionSize = _editionSize;
	}

	function setRoyaltyBPS(uint16 _royaltyBPS) public onlyOwner {
			royaltyBPS = _royaltyBPS;
	}

	function setSaleConfig(IERC721Drop.SalesConfiguration memory _saleConfig) public onlyOwner {
			saleConfig = _saleConfig;
	}

	function setDescription(string memory _description) public onlyOwner {
			description = _description;
	}

	function setAnimationURI(string memory _animationURI) public onlyOwner {
			animationURI = _animationURI;
	}

	function setImageURI(string memory _imageURI) public onlyOwner {
			imageURI = _imageURI;
	}
	
	function setIsVoteCompleted(bool _isVoteCompleted) public onlyOwner {
			isVoteCompleted = _isVoteCompleted;
	}
	
	function createNFT() public onlyOwner {
			require(isVoteCompleted, "Not vote completed!");	
			address newStaoNFT = zoraNFTCreator.createEdition(name, symbol, editionSize, royaltyBPS, fundsRecipient, defaultAdmin, saleConfig, description, animationURI, imageURI);

			staoNFT = IERC721Drop(newStaoNFT);

			emit CreateNFT(msg.sender, address(staoNFT), block.timestamp);
	}

}