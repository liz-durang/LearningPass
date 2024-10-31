// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract StakingManager {
    string public constant contractTag = "Staking Manager Contract!";
    address public owner;

    // Mapping to store the stake amount per user per course
    mapping(address => mapping(uint256 => uint256)) public stakesCourses;

    // Mapping to store all courses a user has stakes in 
    mapping(address => uint256[]) private userCourses;

    //Mapping to store de stake amount per award 
    mapping(uint256 => uint256) public amountRewards;

    // Mapping to store the stake amount per user per reward
    mapping(address => mapping(uint256 => uint256)) public stakesRewards;

    // Mapping to store all reward a user has claim in 
    mapping(address => uint256[]) private userRewards;

    event CourseStakeDeposited(address indexed user, uint256 courseId, uint256 amount);
    event CourseStakeWithdrawn(address indexed user, uint256 courseId, uint256 amount);
    event RewardStakeDeposited(uint256 rewardId, uint256 amount);
    event RewardStakeClaimed(address indexed user, uint256 amount);
    event RewardStakeWithdrawn(address indexed user, uint256 rewardId, uint256 amount);
    event ContractFunded(address indexed owner, uint256 amount);


    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    // Function to deposit a stake for a specific course
    function depositCourseStake(address _user, uint256 _courseId) public payable {
        require(msg.value > 0, "Stake must be greater than zero");

        // If this is the first stake for this course, add it to userCourses
        if (stakesCourses[_user][_courseId] == 0) {
            userCourses[_user].push(_courseId);
        }

        stakesCourses[_user][_courseId] += msg.value;
        
        emit CourseStakeDeposited(_user, _courseId, msg.value);
    }

    // Function to deposit a stake for a specific reward
    function depositRewardStake(uint256 _rewardId) public payable {
        require(msg.value > 0, "Stake must be greater than zero");
        
        // Sumar el nuevo depósito a la cantidad existente
        amountRewards[_rewardId] += msg.value;

        emit RewardStakeDeposited(_rewardId, msg.value);
    }


    // Function to user deposit rewards 
    function claimReward(address _user, uint256 amount, uint256 rewardIndex) public {
        require(amount > 0, "Reward amount must be greater than zero");
        require(address(this).balance >= amount, "Insufficient contract balance");

        // Transferir la recompensa al estudiante
        // Sumar la cantidad a las recompensas del usuario
        

        // If this is the first stake for this reward, add it to userRewards
        if (stakesRewards[_user][rewardIndex] == 0) {
            userRewards[_user].push(rewardIndex);
        }
        stakesRewards[_user][rewardIndex] += amount;

        emit RewardStakeClaimed(_user, amount);
    }

    // Function to withdraw a user's stake for a specific course
    function withdrawStakeCourse(address _user, uint256 _courseId) public {
        uint256 stakedAmount = stakesCourses[_user][_courseId];
        require(stakedAmount > 0, "No stake to withdraw for this course");

        stakesCourses[_user][_courseId] = 0;
        payable(_user).transfer(stakedAmount);
        emit CourseStakeWithdrawn(_user, _courseId, stakedAmount);
    }
    

    // Function to withdraw a user's stake for a specific reward
    function withdrawStakeReward(address _user, uint256 _rewardId) public {
        uint256 stakedAmount = stakesCourses[_user][_rewardId];
        require(stakedAmount > 0, "No stake to withdraw for this reward");

        stakesRewards[_user][_rewardId] = 0;
        payable(_user).transfer(stakedAmount);
        emit RewardStakeWithdrawn(_user, _rewardId, stakedAmount);
    }
    

    // Check the amount of staked ETH for a user in a specific course
    function getStakeCourse(address _user, uint256 _courseId) public view returns (uint256) {
        return stakesCourses[_user][_courseId];
    }

    // Function to get the total stake of a user across all courses
    function getTotalStakeCourses(address _user) public view returns (uint256 totalStake) {
        uint256[] memory courses = userCourses[_user];
        for (uint256 i = 0; i < courses.length; i++) {
            totalStake += stakesCourses[_user][courses[i]];
        }
    }

    // Allow the contract to receive Ether
    receive() external payable {}

     // Function to fund the contract
    function fundContract() public payable {
        require(msg.value > 0, "Funding amount must be greater than zero");
        emit ContractFunded(msg.sender, msg.value); // Emitir evento al fondear el contrato
    }

    // Function to get the balance of the contract
    function getContractBalance() public view returns (uint256) {
        return address(this).balance; // Retorna el balance actual del contrato en wei
    }
}
