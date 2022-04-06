// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./OpinionToken.sol";
import "./Speech.sol";
import "./Utils.sol";
import "./ApprovalCallBack.sol";
import "./SharedStructs.sol";



contract OpenAir is ApprovalCallBack {
    struct Area {
        string name;
        Speech[] speeches;
        mapping (address => bool) participationRecord; 
    }

    struct Field {
        string name;
        mapping (string => Area) nameAreaMapping;
		string[] areaNames;
    }

    modifier onlyBy(address addr) {
        require(msg.sender == addr, Utils.append("Unacceptable msg.sender -- expects: ", Utils.addrToString(addr)));
        _;
    }
	
    event OpenAirInstanceCreated(address creator, address instanceAddress);
	event FieldAdded(string fieldName, address by);
    event AreaAdded(string fieldName, string areaName, address by);
    event AreaParticipationRegistered(string fieldName, string areaName, address participant);
    event SpeechAdded(address indexed speaker, string fieldName, string areaName, string title, address by);
    event ReceivedApprovalToCall(address sender, uint256 amount, address token, bytes data);
    event ReceivedApprovalToSpeak(address sender, uint256 amount, address token, string fieldName, string areaName, string title);
    event ReceivedApprovalToVote(address sender, uint256 amount, address token, string fieldName, string areaName, uint speechIndex, bool isUpVote);

    address creator;
    address moderator;
	OpinionToken tokenContract;
	
    mapping (string => Field) nameFieldMapping;
	string[] fieldNames;

    uint256 chargePerVote = 2;
    uint256 chargePerSpeech = 20;
    uint256 tokensToMintPerArea = 10000000;
    uint256 awardForParticipation = 100;
	uint256 awardToSpeakerPerUpVote = 4;
	uint256 awardToVoterPerFollower = 1;

    constructor () {
        tokenContract = new OpinionToken();
        creator = msg.sender;
        moderator = creator; //initially

        //some initial fields and areas for testing of web app
        addField("CIBC");
        addArea("CIBC", "Innovation");
        addArea("CIBC", "Governance");
        addArea("CIBC", "Work and Life");
        addArea("CIBC", "Environment");
        addField("TD");
        addField("Scotia Bank");
        
        emit OpenAirInstanceCreated(creator, address(this));
    }
    
    function getTokenContract() public view returns (OpinionToken) {
        return tokenContract;
    }

    function getTokenContractAddress() public view returns (address) {
        return address(tokenContract);
    }

    function getContractCreator() public view returns (address) {
        return creator;
    }
	
    function getChargePerVote() public view returns (uint256) {
        return chargePerVote;
    }
    function getChargePerSpeech() public view returns (uint256) {
        return chargePerSpeech;
    }
    function getAwardForParticipation() public view returns (uint256) {
        return awardForParticipation;
    }
    function getAwardToVoterPerFollower() public view returns (uint256) {
        return awardToVoterPerFollower;
    }
    function getAwardToSpeakerPerUpVote() public view returns (uint256) {
        return awardToSpeakerPerUpVote;
    }    
    function getTokensToMintPerArea() public view returns (uint256) {
        return tokensToMintPerArea;
    }

    function getFieldNames() public view returns (string[] memory) {
        return fieldNames;
    }

    function getField (string memory fieldName) internal view returns (Field storage) {
        return nameFieldMapping[fieldName];
    }
    function getAreaNames(string memory fieldName) public view returns (string[] memory) {
        return getField(fieldName).areaNames;
    }
    function getArea(string memory fieldName, string memory areaName) internal view returns (Area storage) {
        return nameFieldMapping[fieldName].nameAreaMapping[areaName];
    }
    function getAreaSpeechCount(string memory fieldName, string memory areaName) public view returns (uint) {
        return getArea(fieldName, areaName).speeches.length;
    }    
    function getSpeeches(string memory fieldName, string memory areaName) public view returns (Speech [] memory) {
        return getArea(fieldName, areaName).speeches;
    }    
	function getSpeech(string memory fieldName, string memory areaName, uint speechIndex) public view returns (Speech) {
        return nameFieldMapping[fieldName].nameAreaMapping[areaName].speeches[speechIndex];
    }    
	
	function getSpeechAddress(string memory fieldName, string memory areaName, uint speechIndex) public view returns (address) {
        return address(getSpeech(fieldName, areaName, speechIndex));
    }   

	function setModerator(address candidate) public onlyBy(creator) {
        moderator = candidate;
    }
    function fieldExists(string memory name) public view returns (bool) {
        return Utils.compareStrings(nameFieldMapping[name].name, name);
    }
    function addField(string memory name) public onlyBy(moderator) {
        require(!fieldExists(name), Utils.append("Field already exists for name=", name));
        fieldNames.push(name);
        nameFieldMapping[name].name=name;
        //mapping(string => Area) storage areas;
        //nameFieldMapping[name] = Field(name, areas);
        emit FieldAdded(name, msg.sender);
    }	
    function areaExists(string memory fieldName, string memory areaName) public view returns (bool) {
        return Utils.compareStrings(nameFieldMapping[fieldName].nameAreaMapping[areaName].name, areaName);
    }
    function addArea(string memory fieldName, string memory areaName) public onlyBy(moderator) {
        require(!areaExists(fieldName, areaName), "Area with that name already exists");
        if (!fieldExists(fieldName)) {
            addField(fieldName);
        }
        nameFieldMapping[fieldName].nameAreaMapping[areaName].name = areaName;
        nameFieldMapping[fieldName].areaNames.push(areaName);
        tokenContract.mint(tokensToMintPerArea); //mint new tokens for every new area
        emit AreaAdded(fieldName, areaName, msg.sender);
    }	
    function addSpeech(address speaker, string memory fieldName, string memory areaName, string memory title, string memory text) public onlyBy(getTokenContractAddress()){
        Speech speech = new Speech(speaker, fieldName, areaName, title, text);
        nameFieldMapping[fieldName].nameAreaMapping[areaName].speeches.push(speech);
        emit SpeechAdded(speaker, fieldName, areaName, title, msg.sender);
    }
	
    function registerAreaParticipation(string memory fieldName, string memory areaName) public {
        Area storage area = getArea(fieldName, areaName);
        address participant = msg.sender;
        if (area.participationRecord[participant] != true) {
            tokenContract.transfer(participant, awardForParticipation);
            area.participationRecord[participant] = true;
            emit AreaParticipationRegistered(fieldName, areaName, msg.sender);
        }
    }

    
    function onApproveAndCall(address from, uint256 tokens, address token, bytes memory data) public override {
        emit ReceivedApprovalToCall(from, tokens, token, data);
        tokenContract.transferFrom(from, address(this), tokens);
    }


	function onApproveAndSpeak(address speaker, uint256 amount, address token, string memory fieldName, string memory areaName, string memory title, string memory content) override public {
        emit ReceivedApprovalToSpeak(speaker, amount, token, fieldName, areaName, title);
        require(amount >= chargePerSpeech, "Approved amount not enough");
        addSpeech(speaker, fieldName, areaName, title, content);
        tokenContract.transferFrom(speaker, address(this), chargePerSpeech); 

    }

    function onApproveAndVote(address voter, uint256 amount, address token, string memory fieldName, string memory areaName, uint speechIndex, bool isUpVote, string memory comment) override public {
        emit ReceivedApprovalToVote(voter, amount, token, fieldName, areaName, speechIndex, isUpVote);  
        require(amount >= chargePerVote, "Approved amount not enough");      
        Speech speech = getSpeech(fieldName, areaName, speechIndex);
        
        //award speakers (for each upvote) and leading voters (for each following voter)
        if (isUpVote) {
            tokenContract.transfer(speech.getSpeaker(), awardToSpeakerPerUpVote); //award to speaker per upvote
            //award leading upVoters
            SharedStructs.Vote[] memory upVotes = speech.getUpVotes();
            for (uint i = 0; i < upVotes.length; i ++) {
                tokenContract.transfer(upVotes[i].voter, awardToVoterPerFollower);
            }
        } else {
            //award leading downVoters
            SharedStructs.Vote[] memory downVotes = speech.getDownVotes();
            for (uint i = 0; i < downVotes.length; i ++) {
                tokenContract.transfer(downVotes[i].voter, awardToVoterPerFollower);
            }
        }

        speech.registerVote(voter, isUpVote, comment);
        tokenContract.transferFrom(voter, address(this), chargePerVote); //charge voter for voting
        
    }
}
