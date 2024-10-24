// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract QuestionManager {

    string public constant contractTag = "Question Manager Contract!";
    address public owner;
    
    // Structure for the options of a question
    struct Option {
        string optionText;
    }

    // Structure of a question with multiple options and one correct answer
    struct Question {
        string questionText;
        Option[] options;
        uint256 correctOptionIndex; // Index of the correct option in the options array
    }

    // Mapping to store all questions
    mapping(uint256 => Question) public questions;
    uint256 public questionCount = 0;

    // Events
    event QuestionCreated(uint256 questionId, string questionText);
    event QuestionAnswered(uint256 questionId, bool isCorrect);

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == owner, "Not the Owner");
		_;
	}

    // Constructor: Called once on contract deployment
    constructor(address _owner) {
		owner = _owner;
        
	}

    // Function to add a new question with its options
    function addQuestion(string memory _questionText, string[] memory _options, uint256 _correctOptionIndex) public {
        require(_correctOptionIndex < _options.length, "Correct option index out of bounds");

        Question storage question = questions[questionCount];
        question.questionText = _questionText;
        question.correctOptionIndex = _correctOptionIndex;

        for (uint256 i = 0; i < _options.length; i++) {
            question.options.push(Option({optionText: _options[i]}));
        }

        emit QuestionCreated(questionCount, _questionText);
        questionCount++;
    }

    // Function to answer a question and check if it's correct
    function answerQuestion(uint256 _questionId, uint256 _optionIndex) public returns (bool) {
        require(_questionId < questionCount, "Invalid question ID");

        Question memory question = questions[_questionId];
        bool isCorrect = (_optionIndex == question.correctOptionIndex);

        emit QuestionAnswered(_questionId, isCorrect);

        return isCorrect;
    }

    // Function to get the details of a question
    function getQuestionDetails(uint256 _questionId) public view returns (string memory questionText, string[] memory options) {
        require(_questionId < questionCount, "Invalid question ID");

        Question memory question = questions[_questionId];
        questionText = question.questionText;

        options = new string[](question.options.length);
        for (uint256 i = 0; i < question.options.length; i++) {
            options[i] = question.options[i].optionText;
        }

        return (questionText, options);
    }
}
