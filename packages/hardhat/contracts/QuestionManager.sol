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

    // Mapping to store user answers
    mapping(address => mapping(uint256 => uint256)) public userAnswers; // user address -> question ID -> selected option index

    // Events
    event QuestionCreated(uint256 questionId, string questionText);
    event QuestionAnswered(uint256 questionId, bool isCorrect);
    event UserAnswered(address user, uint256 questionId, uint256 selectedOptionIndex);

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    modifier isOwner() {
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
    function answerQuestion(uint256 _questionId, uint256 _optionIndex, address _user) public returns (bool) {
        require(_questionId < questionCount, "Invalid question ID");

        Question memory question = questions[_questionId];
        bool isCorrect = (_optionIndex == question.correctOptionIndex);

        emit QuestionAnswered(_questionId, isCorrect);
        emit UserAnswered(_user, _questionId, _optionIndex); // Emitir evento de respuesta del usuario

        return isCorrect;
    }

    // Function to save user answer
    function saveUserAnswer(uint256 _questionId, uint256 _selectedOption, address _user) public {
        require(_questionId < questionCount, "Invalid question ID");
        userAnswers[_user][_questionId] = _selectedOption; // Guardar la respuesta del usuario

        emit UserAnswered(_user, _questionId, _selectedOption); // Emitir evento
    }

    // Function to get user answers for multiple questions
    function getUserAnswers(uint256[] memory _questionIds, address _user) public view returns (uint256[] memory) {
        uint256[] memory answers = new uint256[](_questionIds.length); // Inicializar el arreglo para las respuestas

        for (uint256 i = 0; i < _questionIds.length; i++) {
            require(_questionIds[i] < questionCount, "Invalid question ID");
            answers[i] = userAnswers[_user][_questionIds[i]]; // Guardar la respuesta correspondiente
        }

        return answers; // Retorna el arreglo de respuestas
    }

    // Function to get the details of a question
    function getQuestionDetails(uint256 _questionId) public view returns (string memory questionText, string[] memory options, uint256 correctOptionIndex) {
        require(_questionId < questionCount, "Invalid question ID");

        Question memory question = questions[_questionId];
        questionText = question.questionText;
        correctOptionIndex = question.correctOptionIndex;

        options = new string[](question.options.length);
        for (uint256 i = 0; i < question.options.length; i++) {
            options[i] = question.options[i].optionText;
        }

        return (questionText, options, correctOptionIndex);
    }

    // Function to retrieve details for multiple questions based on an array of IDs
    function getQuestionsDetails(uint256[] memory _questionIds)
        public
        view
        returns (
            string[] memory questionTexts,
            string[][] memory allOptions,
            uint256[] memory correctOptionIndices,
            uint256[] memory ids
        )
    {
        uint256 length = _questionIds.length;

        // Initialize arrays to store each detail component
        questionTexts = new string[](length);
        allOptions = new string[][](length);
        correctOptionIndices = new uint256[](length);
        ids = new uint256[](length); // Inicializar el arreglo ids

        for (uint256 i = 0; i < length; i++) {
            uint256 questionId = _questionIds[i];
            require(questionId < questionCount, "Invalid question ID");

            Question memory question = questions[questionId];

            // Store details for each question
            questionTexts[i] = question.questionText;
            correctOptionIndices[i] = question.correctOptionIndex;
            ids[i] = questionId; // Asignar el ID de la pregunta

            // Initialize options array for each question
            string[] memory options = new string[](question.options.length);
            for (uint256 j = 0; j < question.options.length; j++) {
                options[j] = question.options[j].optionText;
            }
            allOptions[i] = options;
        }

        return (questionTexts, allOptions, correctOptionIndices, ids);
    }

}
