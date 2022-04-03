// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./OpinionToken.sol";
import "./OpenAir.sol";
import "./SharedStructs.sol";

contract Speech {

    event SpeechUpVoted(address voter, string fieldName, string areaName, string title, address speaker);
    event SpeechDownVoted(address voter, string fieldName, string areaName, string title, address speaker);


    OpenAir platformContract;
    OpinionToken tokenContract;
    string fieldName;
    string areaName;

    address speaker;
    string title;
    string content;
    SharedStructs.Vote[] upVotes;
    SharedStructs.Vote[] downVotes;
    mapping (address => bool) votedRecord;

    constructor (address _speaker, string memory _fieldName, string memory _areaName, string memory _title, string memory _content) {
        platformContract = OpenAir(msg.sender);
        fieldName = _fieldName;
        areaName = _areaName;
        speaker = _speaker;
        title = _title;
        content =_content;
    }

    function getSpeaker() public view returns (address) {
        return speaker;
    }

    function getUpVotes() public view returns (SharedStructs.Vote[] memory) {
        return upVotes;
    }    

    function getDownVotes() public view returns (SharedStructs.Vote[] memory) {
        return downVotes;
    }  

    function hadVoted(address voter) internal view returns (bool) {
        return votedRecord[voter];
    }

    function registerVote(address voter, bool isUpVote, string memory comment) public {
        require(voter != speaker, "Not allow to vote for your own speech.");
        require(!hadVoted(voter), "Declined as the voter had previously voted.");
        require(msg.sender == address(platformContract), "only accepts request from the openAir platform contract");

        SharedStructs.Vote memory vote = SharedStructs.Vote(voter, isUpVote, comment);
        if (isUpVote) {
            upVotes.push(vote);
            emit SpeechUpVoted(voter, fieldName, areaName, title, speaker);
        } else {
            downVotes.push(vote);
            emit SpeechDownVoted(voter, fieldName, areaName, title, speaker);
        }
        votedRecord[voter] = true;
    }
}