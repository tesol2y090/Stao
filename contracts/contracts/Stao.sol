// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

import "./StaoGovernor.sol";
import "./StaoImplement.sol";
import "./TimeLock.sol";
import "./zora/ZoraNFTCreatorV1.sol";

contract Stao is Ownable, ERC20, ERC20Permit, ERC20Votes {

    StaoGovernor public staoGovern;
    StaoImplement public staoImplement;
    TimeLock public timeLock;

    uint256 public amountPerContributor;
    uint256 public maxContributors;
    uint256 public contributorsAmount;

    mapping (address => bool) public isContribute;

    event Contribution(address contributors);

    constructor(
        string memory _name, 
        string memory _symbol, 
        uint256 _amountPerContributor, 
        uint256 _maxContributors, 
        uint256 _minDelay, 
        uint256 _quorumPercentage, 
        uint256 _votingPeriod, 
        uint256 _votingDelay,
        ZoraNFTCreatorV1 _zoraCreator
    ) ERC20(_name, _symbol) ERC20Permit(_name) {
        amountPerContributor = _amountPerContributor;
        maxContributors = _maxContributors;
        address[] memory proposers;
        address[] memory executors;
        timeLock = new TimeLock(_minDelay, proposers, executors);
        staoGovern = new StaoGovernor(IVotes(address(this)), timeLock, _quorumPercentage, _votingPeriod, _votingDelay);
        staoImplement = new StaoImplement(_zoraCreator);

        timeLock.grantRole(timeLock.PROPOSER_ROLE(), address(staoGovern));
        timeLock.revokeRole(timeLock.TIMELOCK_ADMIN_ROLE(), address(this));
    }

    function contribute() payable external {
        require(msg.value == amountPerContributor, "Not acceptable!");
        require(!isContribute[msg.sender], "Contribute already!");
        require(contributorsAmount < maxContributors, "Max contributors!");
        _mint(msg.sender, 1 ether);
        isContribute[msg.sender] = true;
        contributorsAmount += 1;

        emit Contribution(msg.sender);
    }

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
    
}
