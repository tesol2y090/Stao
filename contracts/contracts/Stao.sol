// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

import "./StaoGovernor.sol";
import "./StaoImplement.sol";
import "./TimeLock.sol";
import "./zora/ZoraNFTCreatorV1.sol";

contract Stao is Ownable, ERC20Votes {
    bytes32 public constant SET_EDITION_SIZE = bytes32("setEditionSize");
    bytes32 public constant SET_ROYALTY_BPS = bytes32("setRoyaltyBPS");
    bytes32 public constant SET_SALE_CONFIG = bytes32("setSaleConfig");
    bytes32 public constant SET_ANIMATION_URI = bytes32("setAnimationURI");
    bytes32 public constant SET_IMAGE_URI = bytes32("setImageURI");
    bytes32 public constant SET_IS_VOTE_COMPLETED = bytes32("setIsVoteCompleted");
    bytes32 public constant CREATE_NFT = bytes32("createNFT");

    enum ProjectState {
        RaiseFunding,
        SetEditionSize,
        SetRoyaltyBPS,
        SetSaleConfig,
        SetAnimationURI,
        SetImageURI,
        SetIsVoteCompleted,
        ReadyToCreateNFT
    }

    StaoGovernor public staoGovern;
    StaoImplement public staoImplement;
    TimeLock public timeLock;

    // Propose Parameter
    uint64 public editionSize;
    uint16 public royaltyBPS;
    IERC721Drop.SalesConfiguration public salesConfig;
    string public animationURI;
    string public imageURI;
    bool public isVoteCompleted;
    bytes public callData;
    string public description;

    uint256 public amountPerContributor;
    uint256 public maxContributors;
    uint256 public contributorsAmount;
    uint256 public contribitorShareBPS;
    ProjectState public projectState;

    mapping (address => bool) public isContribute;
    mapping (bytes32 => uint256) public proposeToId;

    event Contribution(address contributors);

    constructor(
        string memory _name, 
        string memory _symbol, 
        string memory _description,
        uint256 _amountPerContributor, 
        uint256 _maxContributors, 
        uint256 _contribitorShareBPS,
        uint256 _minDelay, 
        uint256 _quorumPercentage, 
        uint256 _votingPeriod, 
        uint256 _votingDelay,
        ZoraNFTCreatorV1 _zoraCreator
    ) ERC20(_name, _symbol) ERC20Permit(_name) {
        projectState = ProjectState.RaiseFunding;
        amountPerContributor = _amountPerContributor;
        maxContributors = _maxContributors;
        contribitorShareBPS = _contribitorShareBPS;
        address[] memory proposers;
        address[] memory executors;
        timeLock = new TimeLock(_minDelay, proposers, executors);
        staoGovern = new StaoGovernor(IVotes(address(this)), timeLock, _quorumPercentage, _votingPeriod, _votingDelay);
        staoImplement = new StaoImplement(_zoraCreator, _name, _symbol, _description);

        timeLock.grantRole(timeLock.PROPOSER_ROLE(), address(staoGovern));
        timeLock.grantRole(timeLock.EXECUTOR_ROLE(), address(staoGovern));
        timeLock.revokeRole(timeLock.TIMELOCK_ADMIN_ROLE(), address(this));

        staoImplement.transferOwnership(address(timeLock));   
    }

    function contribute() payable external {
        require(msg.value == amountPerContributor, "Not acceptable!");
        require(!isContribute[msg.sender], "Contribute already!");
        require(contributorsAmount < maxContributors, "Max contributors!");
        require(projectState == ProjectState.RaiseFunding, "Too late!");
        _mint(msg.sender, 1 ether);
        delegate(msg.sender);
        isContribute[msg.sender] = true;
        contributorsAmount += 1;

        if(contributorsAmount == maxContributors) {
            projectState = ProjectState.SetEditionSize;
        }

        emit Contribution(msg.sender);
    }

    function proposeEditionSize(uint64 _editionSize, bytes memory _callData, string memory _description) public onlyOwner {
        require(projectState == ProjectState.SetEditionSize, "Not this time!");
        editionSize = _editionSize;
        callData = _callData;
        description = _description;
        address[] memory addressArr = new address[](1);
        addressArr[0] = address(staoImplement);
        uint256[] memory valueArr = new uint256[](1);
        valueArr[0] = 0;
        bytes[] memory callDataArr = new bytes[](1);
        callDataArr[0] = callData;
        uint256 proposalId = staoGovern.propose(addressArr, valueArr, callDataArr, description);
        proposeToId[SET_EDITION_SIZE] = proposalId;
    }

    function proposeRoyaltyBPS(uint16 _royaltyBPS, bytes memory _callData, string memory _description) public onlyOwner {
        require(projectState == ProjectState.SetRoyaltyBPS, "Not this time!");
        royaltyBPS = _royaltyBPS;
        callData = _callData;
        description = _description;
        address[] memory addressArr = new address[](1);
        addressArr[0] = address(staoImplement);
        uint256[] memory valueArr = new uint256[](1);
        valueArr[0] = 0;
        bytes[] memory callDataArr = new bytes[](1);
        callDataArr[0] = callData;
        uint256 proposalId = staoGovern.propose(addressArr, valueArr, callDataArr, description);
        proposeToId[SET_ROYALTY_BPS] = proposalId;
    }

    function proposeSaleConfig(IERC721Drop.SalesConfiguration memory _salesConfig, bytes memory _callData, string memory _description) public onlyOwner {
        require(projectState == ProjectState.SetSaleConfig, "Not this time!");
        salesConfig = _salesConfig;
        callData = _callData;
        description = _description;
        address[] memory addressArr = new address[](1);
        addressArr[0] = address(staoImplement);
        uint256[] memory valueArr = new uint256[](1);
        valueArr[0] = 0;
        bytes[] memory callDataArr = new bytes[](1);
        callDataArr[0] = callData;
        uint256 proposalId = staoGovern.propose(addressArr, valueArr, callDataArr, description);
        proposeToId[SET_SALE_CONFIG] = proposalId;
    }

    function proposeAnimationURI(string memory _animationURI, bytes memory _callData, string memory _description) public onlyOwner {
        require(projectState == ProjectState.SetAnimationURI, "Not this time!");
        animationURI = _animationURI;
        callData = _callData;
        description = _description;
        address[] memory addressArr = new address[](1);
        addressArr[0] = address(staoImplement);
        uint256[] memory valueArr = new uint256[](1);
        valueArr[0] = 0;
        bytes[] memory callDataArr = new bytes[](1);
        callDataArr[0] = callData;
        uint256 proposalId = staoGovern.propose(addressArr, valueArr, callDataArr, description);
        proposeToId[SET_ANIMATION_URI] = proposalId;
    }

    function proposeImageURI(string memory _imageURI, bytes memory _callData, string memory _description) public onlyOwner {
        require(projectState == ProjectState.SetImageURI, "Not this time!");
        imageURI = _imageURI;
        callData = _callData;
        description = _description;
        address[] memory addressArr = new address[](1);
        addressArr[0] = address(staoImplement);
        uint256[] memory valueArr = new uint256[](1);
        valueArr[0] = 0;
        bytes[] memory callDataArr = new bytes[](1);
        callDataArr[0] = callData;
        uint256 proposalId = staoGovern.propose(addressArr, valueArr, callDataArr, description);
        proposeToId[SET_IMAGE_URI] = proposalId;
    }

    function proposeIsVoteCompleted(bool _isVoteCompleted, bytes memory _callData, string memory _description) public onlyOwner {
        require(projectState == ProjectState.SetIsVoteCompleted, "Not this time!");
        isVoteCompleted = _isVoteCompleted;
        callData = _callData;
        description = _description;
        address[] memory addressArr = new address[](1);
        addressArr[0] = address(staoImplement);
        uint256[] memory valueArr = new uint256[](1);
        valueArr[0] = 0;
        bytes[] memory callDataArr = new bytes[](1);
        callDataArr[0] = callData;
        uint256 proposalId = staoGovern.propose(addressArr, valueArr, callDataArr, description);
        proposeToId[SET_IS_VOTE_COMPLETED] = proposalId;
    }

    function proposeCreateNFT(bytes memory _callData, string memory _description) public onlyOwner {
        require(projectState == ProjectState.ReadyToCreateNFT, "Not this time!");
        callData = _callData;
        description = _description;
        address[] memory addressArr = new address[](1);
        addressArr[0] = address(staoImplement);
        uint256[] memory valueArr = new uint256[](1);
        valueArr[0] = 0;
        bytes[] memory callDataArr = new bytes[](1);
        callDataArr[0] = callData;
        uint256 proposalId = staoGovern.propose(addressArr, valueArr, callDataArr, description);
        proposeToId[CREATE_NFT] = proposalId;
    }

    function queueProposal() public onlyOwner {
        address[] memory addressArr = new address[](1);
        addressArr[0] = address(staoImplement);
        uint256[] memory valueArr = new uint256[](1);
        valueArr[0] = 0;
        bytes[] memory callDataArr = new bytes[](1);
        callDataArr[0] = callData;
        staoGovern.queue(addressArr, valueArr, callDataArr, keccak256(bytes(description)));
    }

    function executeProposal() public onlyOwner {
        address[] memory addressArr = new address[](1);
        addressArr[0] = address(staoImplement);
        uint256[] memory valueArr = new uint256[](1);
        valueArr[0] = 0;
        bytes[] memory callDataArr = new bytes[](1);
        callDataArr[0] = callData;
        staoGovern.execute(addressArr, valueArr, callDataArr, keccak256(bytes(description)));
        if(projectState == ProjectState.SetEditionSize) {
            projectState = ProjectState.SetRoyaltyBPS;
        } else if(projectState == ProjectState.SetRoyaltyBPS) {
            projectState = ProjectState.SetSaleConfig;
        } else if(projectState == ProjectState.SetSaleConfig) {
            projectState = ProjectState.SetAnimationURI;
        } else if(projectState == ProjectState.SetAnimationURI) {
            projectState = ProjectState.SetImageURI;
        } else if(projectState == ProjectState.SetImageURI) {
            projectState = ProjectState.SetIsVoteCompleted;
        } else if(projectState == ProjectState.SetIsVoteCompleted) {
            projectState = ProjectState.ReadyToCreateNFT;
        }
    }

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._burn(account, amount);
    }
    
}
