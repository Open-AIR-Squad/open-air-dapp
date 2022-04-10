// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.24;

//Ref: https://www.quicknode.com/guides/solidity/how-to-create-and-deploy-an-erc20-token
//Ref: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
//Ref: https://wizard.openzeppelin.com/


import "./IERC20.sol"; 
import "./SafeMath.sol"; 
import "./OpenAir.sol";
import "./ApprovalCallBack.sol";
  
contract OpinionToken is IERC20 {
    string symbol;
    string name;
    uint8 decimals;
    uint256 totalSupply_;
    address tokenCreator;         // the creator of token contract
    uint256 unitsOneEthCanBuy  = 10; //symbloc -- not to be used
    
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;
 
 
    event OpinionTokenInstanceCreated(address creator, address instanceAddress);
    constructor() {
        symbol = "AIR";
        name = "Opinion Token";
        tokenCreator = msg.sender; 
        decimals = 0;
        totalSupply_ = 0;
        
        mint(tokenCreator, totalSupply_);
        emit OpinionTokenInstanceCreated(tokenCreator, address(this));
    }

    modifier onlyBy(address addr) {
        require(msg.sender == addr);
        _;
    }
 
    function getTokenCreator() public view returns (address) {
        return tokenCreator;
    }

    function totalSupply() public view returns (uint256) {
        return totalSupply_  - balances[address(0)];
    }
 
    function balanceOf(address account) public view returns (uint256 balance) {
        return balances[account];
    }
 
    function transfer(address to, uint tokens) public returns (bool success) {
        require((msg.sender == tokenCreator) || (to == tokenCreator), "Transfer can only be made from or to the tokenCreator");
        require(balances[msg.sender] >= tokens, "No sufficient tokens to transfer");
        balances[msg.sender] = SafeMath.safeSub(balances[msg.sender], tokens);
        balances[to] = SafeMath.safeAdd(balances[to], tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
 
    function approve(address spender, uint256 tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
 
    function transferFrom(address from, address to, uint256 tokens) public returns (bool success) {
        require((from == tokenCreator) || (to == tokenCreator), "Transfer can only be made from or to the tokenCreator");
        balances[from] = SafeMath.safeSub(balances[from], tokens);
        allowed[from][msg.sender] = SafeMath.safeSub(allowed[from][msg.sender], tokens);
        balances[to] = SafeMath.safeAdd(balances[to], tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
 
    function allowance(address owner, address spender) public view returns (uint256 remaining) {
        return allowed[owner][spender];
    }
 


    receive() external payable {        
        uint256 amount = msg.value * unitsOneEthCanBuy;
        require(balanceOf(tokenCreator) >= amount, "Not enough tokens");
        transferFrom(tokenCreator, msg.sender, amount);
        // emit an event to inform of the transfer        
        //emit Transfer(tokenCreator, msg.sender, amount);
        // send the ether earned to the token owner
        payable(tokenCreator).transfer(msg.value);
    }
 
    fallback() external payable {
        revert();
    }


    function mint(address account, uint256 amount) public onlyBy(tokenCreator)  {
        require(account != address(0), "ERC20: mint to the zero address");
        totalSupply_ += amount;
        balances[account] += amount;
        emit Transfer(address(0), account, amount);
        //_afterTokenTransfer(address(0), account, amount); //hook, not used
    }

    function mint(uint256 amount) public onlyBy(tokenCreator) {
        mint(address(tokenCreator), amount);
    }

    function burn(address account, uint256 amount) public onlyBy(tokenCreator) {
        require(account != address(0), "ERC20: burn from the zero address");
        //_beforeTokenTransfer(account, tokenCreator, amount); //hook, not used
        uint256 accountBalance = balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            balances[account] = accountBalance - amount;
        }
        totalSupply_ -= amount;
        emit Transfer(account, address(0), amount);
        //_afterTokenTransfer(account, tokenCreator, amount); //hook, not used
    }


    function approveAndCall(address spender, uint256 tokens, bytes memory data) public returns (bool success) {
        approve(spender, tokens);
        ApprovalCallBack(spender).onApproveAndCall(msg.sender, tokens, address(this), data);
        return true;
    }



    function approveAndVote(address spender, uint256 tokens, string memory fieldName, string memory areaName, uint speechIndex, bool isUpVote, string memory comment) public returns (bool success) {

        approve(spender, tokens);
        ApprovalCallBack(address(spender)).onApproveAndVote(msg.sender, tokens, address(this), fieldName, areaName, speechIndex, isUpVote, comment);
        
        return true;
    }


    function approveAndSpeak(address spender, uint256 tokens, string memory fieldName, string memory areaName, string memory title, string memory text) public returns (bool success) {
        
        approve(spender, tokens); 
        ApprovalCallBack(spender).onApproveAndSpeak(msg.sender, tokens, address(this), fieldName, areaName, title, text);
        
        return true;
    }


}