//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./StakingManager.sol";

contract RewardManager {
    struct Reward {
        string description;
        string rewardType;
        uint256 totalAmount; //Amount for all the students
        uint256 amount; // Amount of reward by student
        uint256 timeLimit; // Time limit to earn the reward
        uint256 attemp; //limit of attemp to earn a reward
        bool exists; // Check if the reward exists
        string provider;
    }

    string public constant contractTag = "Reward Manager Contract!";
    address public owner;
    uint256 public rewardCount;

    mapping(uint256 => Reward[]) public rewards; // Rewards for each course

    StakingManager public stakingManager;

    event RewardCreated(uint256 courseId, uint256 amount);
    event RewardClaimed(uint256 courseId, address student, uint256 amount);
    event RewardRemoved(uint256 courseId, uint256 rewardIndex);
    event RewardWithdrawn(address user, uint256 rewardIndex);


    constructor(address _owner, address payable _stakingManagerAddress) {
        owner = _owner;
        stakingManager = StakingManager(_stakingManagerAddress);
    }

    function createRewardTime(uint256 _courseId, uint256 _amount, uint256 _timeLimit, string memory _provider, string memory _description) public payable{
        require(_amount > 0, "Reward amount must be greater than zero");
        require(msg.value > _amount, "Total reward amount must be greater than amount");

        // Verificar si ya existe un Reward de tipo "Time" para este curso
        uint256 existingRewardIndex;
        bool exists = false;

        try this.getRewardIndexByType(_courseId, "Time") returns (uint256 index) {
            existingRewardIndex = index;
            exists = true; // Si se encuentra, se establece exists a true
        } catch {
            exists = false; // Si no se encuentra, permanece false
        }

        require(!exists, "Reward of type 'Time' already exists for this course");

        rewards[_courseId].push(Reward({
            rewardType: "Time",
            totalAmount: msg.value,
            amount: _amount,
            timeLimit: _timeLimit,
            attemp: 0,
            exists: true, 
            provider: _provider,
            description: _description
        }));

        stakingManager.depositRewardStake{value: msg.value}(rewardCount);
        rewardCount++;

        emit RewardCreated(_courseId, _amount);
    }

    function createRewardAttemp(uint256 _courseId, uint256 _amount, uint256 _attemp, string memory _provider, string memory _description) public payable{
        require(_amount > 0, "Reward amount must be greater than zero");
        require(msg.value > _amount, "Total reward amount must be greater than amount");

        // Verificar si ya existe un Reward de tipo "Time" para este curso
        uint256 existingRewardIndex;
        bool exists = false;

        try this.getRewardIndexByType(_courseId, "Attemp") returns (uint256 index) {
            existingRewardIndex = index;
            exists = true; // Si se encuentra, se establece exists a true
        } catch {
            exists = false; // Si no se encuentra, permanece false
        }

        require(!exists, "Reward of type 'Attemp' already exists for this course");

        rewards[_courseId].push(Reward({
            rewardType: "Attemp",
            totalAmount: msg.value,
            amount: _amount,
            timeLimit: 0,
            attemp: _attemp,
            exists: true, 
            provider: _provider,
            description: _description
        }));

        stakingManager.depositRewardStake{value: msg.value}(rewardCount);
        rewardCount++;

        emit RewardCreated(_courseId, _amount);
    }


    function claimRewardTime(uint256 _courseId, address _student, uint256 _completionTime) public {
        uint256 rewardIndex = getRewardIndexByType(_courseId, "Time");
        
        Reward storage reward = rewards[_courseId][rewardIndex];
        require(reward.exists, "Reward does not exist");
        require(_completionTime < reward.timeLimit, "Completion time exceeds reward time limit");

        // Transferir la recompensa al estudiante
        stakingManager.claimReward(_student, reward.amount, rewardIndex);

        emit RewardClaimed(_courseId, _student, reward.amount);
    }

    // Function to allow the user to withdraw their specific reward
    // Function to allow the user to withdraw their specific reward
    function withdrawRewardTime(address _user, uint256 _courseId) public {
        uint256 rewardIndex = getRewardIndexByType(_courseId, "Time");
        
        Reward storage reward = rewards[_courseId][rewardIndex];
        require(reward.exists, "Reward does not exist");

        // Comprobar que hay suficiente balance para el retiro
        require(reward.amount > 0, "No reward to withdraw.");

        // Lógica para retirar la recompensa del stakingManager
        stakingManager.withdrawStakeReward(_user, rewardIndex);
        reward.exists = false; // Marcar como no existente para evitar el retiro duplicado

        emit RewardWithdrawn(_user, rewardIndex);
    }



    function getRewardAmount(uint256 _courseId, uint256 rewardIndex) public view returns (uint256) {
        require(rewardIndex < rewards[_courseId].length, "Reward index out of bounds");
        return rewards[_courseId][rewardIndex].amount;
    }

    function getRewardIndexByType(uint256 _courseId, string memory _rewardType) public view returns (uint256) {
        Reward[] memory courseRewards = rewards[_courseId];
        for (uint256 i = 0; i < courseRewards.length; i++) {
            if (keccak256(abi.encodePacked(courseRewards[i].rewardType)) == keccak256(abi.encodePacked(_rewardType))) {
                return i; // Retorna el índice si se encuentra
            }
        }
        revert("Reward type not found"); // Revertir si no se encuentra el tipo de recompensa
    }   

    function removeRewardTime(uint256 _courseId, uint256 _rewardIndex) public {
        require(_rewardIndex < rewards[_courseId].length, "Reward index out of bounds");
        Reward storage rewardToRemove = rewards[_courseId][_rewardIndex];
        require(rewardToRemove.exists, "Reward does not exist");

        // Mover el último elemento al índice que queremos eliminar y luego reducir el tamaño del array
        rewards[_courseId][_rewardIndex] = rewards[_courseId][rewards[_courseId].length - 1];
        rewards[_courseId].pop();

        // Emitir evento de eliminación de recompensa
        emit RewardRemoved(_courseId, _rewardIndex);
    }

    function rewardExists(uint256 _courseId, string memory _rewardType) internal view returns (bool) {
        Reward[] memory courseRewards = rewards[_courseId];
        for (uint256 i = 0; i < courseRewards.length; i++) {
            if (keccak256(abi.encodePacked(courseRewards[i].rewardType)) == keccak256(abi.encodePacked(_rewardType))) {
                return true;
            }
        }
        return false; 

    }

    function getAllRewardsByCourse(uint256 _courseId) public view returns (Reward[] memory) {
    return rewards[_courseId];
}





   
}
