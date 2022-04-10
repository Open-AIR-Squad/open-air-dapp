# open-air

Team Title:  Open AIR Squad
===========================
Why?  AIR - the first letters of the 3 departments:  Artificial Intelligence (AI) + Infrastructure, Planning and Engineering (IP&E) + Remote Banking and Share Service (RBSS)

Project:  Open-Air Speech Platform (based on Smart Contract)
============================================================
A speech platform facilitating/encouraging free expression of opionions from the participants, beyond the barriers between organizations.

Since is similar to Reddit, we could also call it <b>Breddit</b> (a Blockchain powered Reddit:-).

Benefits reference: https://medium.com/@octoz/daring-an-open-corporate-culture-190750a126fa



Ideas:
=====
-----------------------------------------------------
It cost you money to post - paid to the contract.

It cost you money to upvote/downvote a post (with optional comments) - paid to the contract.

The poster gets a "bonus" for each upvote -- paid from the contract -- up to a accumulated "ceiling amount" -- to potentially get his/her "investment" back, plus some "profits".

The poster gets a "bonus deduction" for each downvote -- paid to the contract.  In the worst case, he/she doesn't get any money to compensate for his/her post (which incurred an expense to begin with).

Each voter gets a bonus for each subsequent vote on the same side.

If a post gets excessive number of downvotes exceeding upvotes -- which likely is a sign of abusive content -- the contract will:
1. pulldown the post
2. give the poster a penalty (optionally)
3. should the upvoters be given a penalty too -- maybe not?

--------------------
You wouldn't abuse the system to make arbitrary posts -- as each post costs you money.
You wouldn't abuse the system to arbitarily upvote or downvote -- as each vote costs you money.
You would have an incentive to make good posts that you believe in - as, beside getting your opinion heard, you could earn a profit as return for your investment
You would have an incentive to upvote or downvote - as, besides your natural desire to express your support or disagreement, you could earn a profit if enough votes are on your side 
You wouldn't "site on the fence" and delay your vote by watching - as the earlier voters make more money than the later ones
The profit you make would give you more capital to speak out more later - either through posting or voting

-------------------------------------------------------
Initial capital distribution
- "Opinion Tokens" - ERC-20 based smart contract to mint and distribute (code reference: https://dev.to/codesphere/create-your-own-ethereum-token-in-minutes-42ao)
- an equal initial amount to each participant 
- a sufficient amount to the contract -- we probably don't expect the contract to be self sufficient do we?
- an oversized amount to designated "moderator" (? - optional) to allow for over-ruling in exceptional scenarios -- within capacity (measured used of power)
-------------------------------------------------------  

On permissioned network -- use a service such as Consensys's Quorum Blockchain Service (QBS)?   Azure AD based authentication/authorization...  
probably beyond POC.   In POC, could use contract managed authorization if needed for the time being.

Future improvement ideas:
The POC would demonstrate the feasibility through a "forum contract" that has no classification -- every posting is on a single "subject area".  In the future it can be expanded into a "Factory Contract" that can produce "forum contracts", each on a subject catefory -- or even a "tree hierarchy" of subjects..
-------------------------------------------
Why ERC-20 -- most popular.  
ERC-223
ERC-777 - registry/hooks make them vulnerable to re-entrancy attacks
ERC-820
ERC-1363
https://www.blockchain-council.org/ethereum/ethereum-tokens-erc-20-vs-erc-223-vs-erc-777/
------------------------------------------
Open and transparent as AIR!
Field - organization  (e.g. CIBC, TD, ...)
Area - subject area, non-department-specific, i.e. open subjects, such as:
    Innovation
    Governance
    Work and Life
    Environment
-----------------------------------------
ganache-cli -i 1337 -q --gasLimit=0x1fffffffffffff --allowUnlimitedContractSize -e 1000000000
truffle migrate --reset --network ganache_cli
truffle test --network ganache_cli --show-events
truffle test test/openair_simulation.js --network ganache_cli --show-events

truffle-flattener .\contracts\OpenAir.sol >> OpenAir-flattened.txt 
is useful for running the contract on Remix  - Ref: https://medium.com/linum-labs/error-vm-exception-while-processing-transaction-revert-8cd856633793


