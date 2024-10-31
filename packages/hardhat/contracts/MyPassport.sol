//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract MyPassport {
    
    // State Variables
    struct Passport {
        string fullName;
        uint256 issueDate;
        string bio;
        bool isValid;
        string userId;
    }

    string public constant contractTag = "MyPassport Contract!";
    mapping(address => Passport) public passports;
    mapping(address => mapping(string => bool)) public roles; // Mapping (usuario => (rol => existe))
    address public immutable owner;
    address public admin;

    // Events: a way to emit log statements from smart contract that can be listened to by external parties
    event PassportIssued(address indexed owner, string fullName, uint256 issueDate);
    event PassportRevoked(address indexed owner);
    event RoleAssigned(address indexed user, string role);
    event RoleRevoked(address indexed user, string role);
    event AdminAdded(address indexed newAdmin);
    event AdminRemoved(address indexed admin);

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == owner, "Not the Owner");
		_;
	}

    // Modifier: to restrict access to admin functions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not the admin");
        _;
    }

    // Constructor: Called once on contract deployment
    constructor(address _owner) {
		owner = _owner;
        admin = _owner;
	}

     // Register a new passport for an individual
    function issuePassport(address _user, string memory _fullName, string memory _bio, string memory _userId) public {
        require(!passports[_user].isValid, "Passport already exists for this address");


        passports[_user] = Passport({
            fullName: _fullName,
            issueDate: block.timestamp,
            bio: _bio,
            isValid: true,
            userId: _userId
        });

        assignRole(_user, "student");

        emit PassportIssued(_user, _fullName, block.timestamp);
    }
    
     // Revoke an existing passport
    function revokePassport(address _user) public onlyAdmin{
        require(passports[_user].isValid, "Passport does not exist or is already revoked");

        passports[_user].isValid = false;

        emit PassportRevoked(_user);
    }



    // Check if a passport is valid
    function isPassportValid(address _user) public view returns (bool) {
        bool valid;
        if(passports[_user].isValid){
            valid = true;
        }else{
            valid = false;
        }

        return valid;
    }

    // Get passport details
    function getPassportDetails(address _user) public view returns (string memory fullName, string memory bio, uint256 issueDate, bool isValid, string memory userId) {
    
    Passport memory passport = passports[_user];

    require(passport.isValid, "Passport does not exist or is invalid");

    return (passport.fullName, passport.bio, passport.issueDate, passport.isValid, passport.userId);
}

    // Assign a role to a passport
    function assignRole(address _user, string memory _role) public {
        require(passports[_user].isValid, "Passport does not exist");
        require(!roles[_user][_role], "Role already assigned"); // Verificar que no se duplique el rol

        roles[_user][_role] = true; // Asignar el rol
        emit RoleAssigned(_user, _role);
    }

    // Revoke a role from a passport
    function revokeRole(address _user, string memory _role) public onlyAdmin{
        require(passports[_user].isValid, "Passport does not exist");
        require(roles[_user][_role], "Role does not exist for this user"); // Verificar que el rol exista

        roles[_user][_role] = false; // Revocar el rol
        emit RoleRevoked(_user, _role);

    }

    // Check if a user has a specific role
    function hasRole(address _user, string memory _role) public view returns (bool) {
        require(passports[_user].isValid, "Passport does not exist");
        return roles[_user][_role]; // Retornar el estado del rol
    }

    // Add a new admin (only owner)
    function setAdmin(address _newAdmin) public onlyAdmin {
        admin = _newAdmin;
        emit AdminAdded(_newAdmin);
    }
   
}
