// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract StakingManager {

    string public constant contractTag = "Staking Manager Contract!";
    address public owner;

    // Mapping to store the stake amount per user per course
    mapping(address => mapping(uint256 => uint256)) public stakes;

    event StakeDeposited(address indexed user, uint256 courseId, uint256 amount);
    event StakeWithdrawn(address indexed user, uint256 courseId, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    // Function to deposit a stake for a specific course
    function depositStake(address _user, uint256 _courseId) public payable {
        require(msg.value > 0, "Stake must be greater than zero");
        stakes[_user][_courseId] += msg.value;
        emit StakeDeposited(_user, _courseId, msg.value);
    }

    // Function to withdraw a user's stake for a specific course
    function withdrawStake(address _user, uint256 _courseId) public {
        uint256 stakedAmount = stakes[_user][_courseId];
        require(stakedAmount > 0, "No stake to withdraw for this course");

        stakes[_user][_courseId] = 0;
        payable(_user).transfer(stakedAmount);
        emit StakeWithdrawn(_user, _courseId, stakedAmount);
    }

    // Check the amount of staked ETH for a user in a specific course
    function getStake(address _user, uint256 _courseId) public view returns (uint256) {
        return stakes[_user][_courseId];
    }
}
