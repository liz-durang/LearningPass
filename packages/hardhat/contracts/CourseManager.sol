//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./QuestionManager.sol";
import "./StakingManager.sol";
import "./MyLearningNFT.sol";
import "./RewardManager.sol";


contract CourseManager {
    struct Course {
        string name;
        string description;
        string courseType;
        address instructor;
        uint256 enrolledStudents;
        uint256[] questionIds; // IDs of questions associated with this course
        uint256 stakingRequirement; // how many staking requires
        uint256 nftsIssued; // how many nft issued

        mapping(address => bool) students; // Tracks enrolled students
        mapping(address => uint256) studentProgress; // Tracks number of questions answered by each student
        mapping(address => uint256) studentStartTime; // Tracks when each student started the course
    }

    string public constant contractTag = "Course Manager Contract!";
    mapping(uint256 => Course) public courses;
    uint256 public courseCount;
    address public owner;

    QuestionManager public questionManager; // Instance of QuestionManager contract
    StakingManager public stakingManager; // Instance of StakingManager contract
    MyLearningNFT public myLearningNFT; // Instance of MyLearningNFT contract
    RewardManager public rewardManager; // Instance of MyLearningNFT contract


    event CourseCreated(uint256 courseId, string name, address instructor,uint256 stakingRequirement );
    event StudentEnrolled(uint256 courseId, address student,  uint256 stakingRequirement);
    event StudentUnenrolled(uint256 courseId, address student );
    event QuestionAddedToCourse(uint256 courseId, uint256 questionId);
    event QuestionAnswered(uint256 courseId, address student, uint256 questionId);


    modifier onlyInstructor(uint256 courseId) {
        require(msg.sender == courses[courseId].instructor, "Only the instructor can perform this action");
        _;
    }

    modifier courseExists(uint256 courseId) {
        require(courseId < courseCount, "Course does not exist");
        _;
    }

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    modifier onlyOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == owner, "Only the owner can perform this action");
		_;
	}

    // Constructor: Called once on contract deployment
    constructor(
        address _owner, 
        address _questionManagerAddress, 
        address payable _stakingContractAddress, 
        address _nftContractAddress, 
        address _rewardManagerAddress
    ) {
		owner = _owner;
        questionManager = QuestionManager(_questionManagerAddress);
        stakingManager = StakingManager(_stakingContractAddress);
        myLearningNFT = MyLearningNFT(_nftContractAddress);
        rewardManager = RewardManager(_rewardManagerAddress);
	}

    function createCourse(string memory _name, string memory _description, uint256 _stakingRequirement, string memory _courseType) public {
        Course storage newCourse = courses[courseCount];
        newCourse.name = _name;
        newCourse.description = _description;
        newCourse.courseType = _courseType;
        newCourse.instructor = msg.sender;
        newCourse.enrolledStudents = 0;
        newCourse.stakingRequirement = _stakingRequirement;

        emit CourseCreated(courseCount, _name, msg.sender, _stakingRequirement);
        courseCount++;
    }

    function enroll(address _student, uint256 _courseId) public payable courseExists(_courseId) {
        Course storage course = courses[_courseId];
        require(!course.students[_student], "Already enrolled");
        require(msg.value == course.stakingRequirement, "Incorrect staking amount");

         // Deposit the stake into the staking contract and pass the courseId
        stakingManager.depositCourseStake{value: msg.value}(_student, _courseId);

        course.students[_student] = true;
        course.enrolledStudents++;
        course.studentStartTime[_student] = block.timestamp; // Registrar la fecha y hora de inicio

        emit StudentEnrolled(_courseId, _student, msg.value);
    }

    function unenroll(address _student, uint256 _courseId) public courseExists(_courseId) {
        Course storage course = courses[_courseId];
        require(course.students[_student], "Not enrolled");

        course.students[_student] = false;
        course.enrolledStudents--;

        emit StudentUnenrolled(_courseId, _student);
    }

    function isEnrolled(uint256 _courseId, address _student) public view courseExists(_courseId) returns (bool) {
        return courses[_courseId].students[_student];
    }

    function getCourseDetails(uint256 _courseId) public view courseExists(_courseId) returns (string memory, string memory, address, uint256, uint256) {
        Course storage course = courses[_courseId];
        return (course.name, course.description, course.instructor, course.enrolledStudents, course.stakingRequirement);
    }

    // Function to create a new question and add it to a course
    function createAndAddQuestionToCourse(
        uint256 _courseId, 
        string memory _questionText, 
        string[] memory _options, 
        uint256 _correctOptionIndex
    ) public courseExists(_courseId) {
        // Create a new question in the QuestionManager
        questionManager.addQuestion(_questionText, _options, _correctOptionIndex);
        
        // Get the ID of the newly created question (it will be questionCount - 1)
        uint256 newQuestionId = questionManager.questionCount() - 1;
        
        // Add the new question to the course
        courses[_courseId].questionIds.push(newQuestionId);
        
        emit QuestionAddedToCourse(_courseId, newQuestionId);
    }


    // Function to retrieve the questions of a course
    function getCourseQuestions(uint256 _courseId) public view returns (uint256[] memory) {
        require(_courseId < courseCount, "Invalid course ID");
        return courses[_courseId].questionIds;
    }

    // Function to answer a question within a course
    function answerCourseQuestion(uint256 _courseId, uint256 _questionIndex, uint256 _optionIndex, address _student) public returns (bool) {
        require(_courseId < courseCount, "Invalid course ID");

        Course storage course = courses[_courseId];
        uint256 questionId = course.questionIds[_questionIndex];
        require(course.students[msg.sender], "Not enrolled in the course");

        bool correct = questionManager.answerQuestion(questionId, _optionIndex);

        if (correct) {
            course.studentProgress[_student]++;
            emit QuestionAnswered(_courseId, _student, questionId);
        }

        return correct;
    }

    // Method to get the progress of a student in a course
    function getStudentProgress(uint256 _courseId, address _student) public view courseExists(_courseId) returns (uint256 progressPercentage) {
        Course storage course = courses[_courseId];
        require(course.students[_student], "Student not enrolled in the course");

        uint256 totalQuestions = course.questionIds.length;
        if (totalQuestions == 0) {
            return 0;
        }

        uint256 answeredQuestions = course.studentProgress[_student];
        progressPercentage = (answeredQuestions * 100) / totalQuestions;
    }

    // Withdraw the stake for a student (after course completion or other conditions) and mintNFT
    function finishCourse(uint256 _courseId, address _student) public courseExists(_courseId) {
        Course storage course = courses[_courseId];
        require(course.students[_student], "Not enrolled in the course");
        require(course.questionIds.length > 0, "The course must have at least one question");
        require(course.studentProgress[_student] == course.questionIds.length, "Course not completed");

        // Withdraw the stake from the staking contract for the specific course
        //stakingManager.withdrawStakeCourse(_student, _courseId);

        // Mint NFT of the student
        myLearningNFT.mint(_student);
        course.nftsIssued++;

        //claim reward
        this.claimRewardTime(_courseId, _student);

        course.students[_student] = false;
        course.enrolledStudents--;

        
    }

    //Get how many NFT issued by course
    function getNftsIssued(uint256 _courseId) public view courseExists(_courseId) returns (uint256) {
        return courses[_courseId].nftsIssued;
    }

    // Retrieve the enrollment date of a student in a course
    function getStudentStartTime(uint256 _courseId, address _student) public view courseExists(_courseId) returns (uint256) {
        require(courses[_courseId].students[_student], "Student not enrolled in the course");
        return courses[_courseId].studentStartTime[_student];
    }
    
    // Create a reward of time for a course
    function createRewardTime(uint256 _courseId, uint256 _amount, uint256 _timeLimit) public payable{
        require(_courseId < courseCount, "Invalid course ID");
        
        address instructor = courses[_courseId].instructor;
        // Llama a la función de rewardManager con los parámetros correctos
        rewardManager.createRewardTime{value: msg.value}(_courseId, _amount, _timeLimit, instructor);
    }


    // Claim Reward of time to students rewards
    function claimRewardTime(uint256 _courseId, address _student) public {
        Course storage course = courses[_courseId];
        require(course.students[_student], "Not enrolled in the course");

        uint256 completionTime = block.timestamp;

        require(course.studentProgress[_student] == course.questionIds.length, "Course not completed");

        rewardManager.claimRewardTime(_courseId, _student, completionTime);
    }

    function withdrawRewardTime(address _user, uint256 _courseId) public {
        rewardManager.withdrawRewardTime(_user, _courseId);
    }


}
