//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./QuestionManager.sol";
import "./StakingManager.sol";

contract CourseManager {
    struct Course {
        string name;
        string description;
        address instructor;
        uint256 enrolledStudents;
        uint256[] questionIds; // IDs of questions associated with this course
        uint256 stakingRequirement; // how many staking requires

        mapping(address => bool) students;
    }

    string public constant contractTag = "Course Manager Contract!";
    mapping(uint256 => Course) public courses;
    uint256 public courseCount;
    address public owner;

    QuestionManager public questionManager; // Instance of QuestionManager contract
    StakingManager public stakingManager; // Instance of StakingManager contract

    event CourseCreated(uint256 courseId, string name, address instructor,uint256 stakingRequirement );
    event StudentEnrolled(uint256 courseId, address student,  uint256 stakingRequirement);
    event StudentUnenrolled(uint256 courseId, address student );
    event QuestionAddedToCourse(uint256 courseId, uint256 questionId);

    modifier onlyInstructor(uint256 courseId) {
        require(msg.sender == courses[courseId].instructor, "Only the instructor can perform this action");
        _;
    }

    modifier courseExists(uint256 courseId) {
        require(courseId < courseCount, "Course does not exist");
        _;
    }

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == owner, "Not the Owner");
		_;
	}

    // Constructor: Called once on contract deployment
    constructor(address _owner, address _questionManagerAddress, address _stakingContractAddress) {
		owner = _owner;
        questionManager = QuestionManager(_questionManagerAddress);
        stakingManager = StakingManager(_stakingContractAddress);
        
	}

    function createCourse(string memory _name, string memory _description, uint256 _stakingRequirement) public {
        Course storage newCourse = courses[courseCount];
        newCourse.name = _name;
        newCourse.description = _description;
        newCourse.instructor = msg.sender;
        newCourse.enrolledStudents = 0;
        newCourse.stakingRequirement = _stakingRequirement;

        emit CourseCreated(courseCount, _name, msg.sender, _stakingRequirement);
        courseCount++;
    }

    function enroll(address _student, uint256 courseId) public payable courseExists(courseId) {
        Course storage course = courses[courseId];
        require(!course.students[msg.sender], "Already enrolled");
        require(msg.value == course.stakingRequirement, "Incorrect staking amount");

         // Deposit the stake into the staking contract and pass the courseId
        stakingManager.depositStake{value: msg.value}(msg.sender, courseId);

        course.students[_student] = true;
        course.enrolledStudents++;

        emit StudentEnrolled(courseId, _student, msg.value);
    }

    function unenroll(address _student, uint256 courseId) public courseExists(courseId) {
        Course storage course = courses[courseId];
        require(course.students[_student], "Not enrolled");

        course.students[_student] = false;
        course.enrolledStudents--;

        emit StudentUnenrolled(courseId, _student);
    }

    function isEnrolled(uint256 courseId, address student) public view courseExists(courseId) returns (bool) {
        return courses[courseId].students[student];
    }

    function getCourseDetails(uint256 courseId) public view courseExists(courseId) returns (string memory, string memory, address, uint256) {
        Course storage course = courses[courseId];
        return (course.name, course.description, course.instructor, course.enrolledStudents);
    }

    // Function to add an existing question to a course
    function addQuestionToCourse(uint256 _courseId, uint256 _questionId) public {
        require(_courseId < courseCount, "Invalid course ID");
        require(_questionId < questionManager.questionCount(), "Invalid question ID");

        courses[_courseId].questionIds.push(_questionId);
        emit QuestionAddedToCourse(_courseId, _questionId);
    }

    // Function to retrieve the questions of a course
    function getCourseQuestions(uint256 _courseId) public view returns (uint256[] memory) {
        require(_courseId < courseCount, "Invalid course ID");
        return courses[_courseId].questionIds;
    }

    // Function to answer a question within a course
    function answerCourseQuestion(uint256 _courseId, uint256 _questionIndex, uint256 _optionIndex) public returns (bool) {
        require(_courseId < courseCount, "Invalid course ID");

        uint256 questionId = courses[_courseId].questionIds[_questionIndex];
        return questionManager.answerQuestion(questionId, _optionIndex);
    }

    // Withdraw the stake for a student (after course completion or other conditions)
    function withdrawFinishedCourse(uint256 courseId) public courseExists(courseId) {
        Course storage course = courses[courseId];
        require(course.students[msg.sender], "Not enrolled in the course");

        // Withdraw the stake from the staking contract for the specific course
        stakingManager.withdrawStake(msg.sender, courseId);

        course.students[msg.sender] = false;
        course.enrolledStudents--;
    }

}
