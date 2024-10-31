// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract MyLearningNFT {
    // Eventos estándar de ERC721
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    // Mappings para almacenar la propiedad y las aprobaciones
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;

    // Nombre y símbolo del token
    string public name;
    string public symbol;

    string public constant contractTag = "MyLearningNFT Contract!";

    // Contador para el ID de token
    uint256 private _tokenIdCounter;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    // Función para consultar el propietario de un token
    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Token no existe");
        return owner;
    }

    // Función para consultar el balance de tokens de un propietario
    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "Consulta para la direccion cero");
        return _balances[owner];
    }

    // Función para aprobar a otra dirección para transferir un token
    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(to != owner, "Aprobacion al propietario actual");
        require(msg.sender == owner, "No tienes permiso para aprobar este token");

        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    // Función para transferir un token a otra dirección
    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "No tienes permiso para transferir este token");
        require(ownerOf(tokenId) == from, "No es el propietario actual del token");
        require(to != address(0), "Transferencia a la direccion cero");

        _transfer(from, to, tokenId);
    }

    // Función para mintear un nuevo token
    function mint(address to) public {
        require(to != address(0), "Direccion cero no permitida");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;

        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    // Función para verificar si alguien es propietario o aprobado para un token
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || _tokenApprovals[tokenId] == spender);
    }

    // Función interna para realizar la transferencia de un token
    function _transfer(address from, address to, uint256 tokenId) internal {
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        // Borra la aprobación anterior
        delete _tokenApprovals[tokenId];
        emit Transfer(from, to, tokenId);
    }
}