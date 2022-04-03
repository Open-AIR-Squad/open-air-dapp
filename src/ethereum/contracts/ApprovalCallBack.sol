
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24;

abstract contract ApprovalCallBack {
    function onApproveAndCall(address from, uint256 tokens, address token, bytes memory data) virtual public;
    function onApproveAndSpeak(address from, uint256 tokens, address token, string memory fieldName, string memory areaName, string memory title, string memory text) virtual public;
    function onApproveAndVote(address from, uint256 tokens, address token,string memory fieldName, string memory areaName, uint speechIndex, bool isUpVote, string memory comment) virtual public;
}