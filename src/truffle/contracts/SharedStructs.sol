// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

library SharedStructs {    
    struct Vote {
        address voter;
        bool isUpvote;
        string comment;
    }
}
