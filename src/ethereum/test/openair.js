const OpenAir = artifacts.require("OpenAir");
const OpinionToken = artifacts.require("OpinionToken");

contract('OpenAir', (accounts) => {
  let openAirInstance, opinionTokenInstance;
  beforeEach(async () => {
    //openAirInstance = await OpenAir.deployed();
    openAirInstance = await OpenAir.new(); //new() would reset the context, so as not for the test case to be polluted by preceding ones
    opinionTokenInstance = await OpinionToken.at(await openAirInstance.getTokenContractAddress.call());
  });

  it('test adding Field', async () => {
    const fieldName = "BMO";
    await openAirInstance.addField(fieldName);
    const fieldExists = await openAirInstance.fieldExists(fieldName);
    assert.equal(fieldExists, true, "Field was not added");
  });

  it('test adding Area', async () => {
    const balanceBefore = await opinionTokenInstance.balanceOf.call(openAirInstance.address);
    const fieldName = "BMO";
    const areaName = "Misc";
    await openAirInstance.addArea(fieldName, areaName);
    const areaExists = await openAirInstance.areaExists(fieldName, areaName);
    assert.equal(areaExists, true, "Area was not added");
    const balanceAfter = await opinionTokenInstance.balanceOf.call(openAirInstance.address);
    const tokensToMintPerArea = await openAirInstance.getTokensToMintPerArea();
    assert.equal(balanceAfter.toNumber(), balanceBefore.toNumber() + tokensToMintPerArea.toNumber(), "Didn't get the expected minted tokens upon creating the area");
  });

  it('should mint additional 10000000 with each new Area', async () => {

    const startingBalance = (await opinionTokenInstance.balanceOf.call(openAirInstance.address)).toNumber();
    await openAirInstance.addArea("testField", "testArea"); 

    const endingBalance = (await opinionTokenInstance.balanceOf.call(openAirInstance.address)).toNumber();

    assert.equal(endingBalance, startingBalance + 10000000, "Newly minted tokens not found following Area addition");
  });

  
  it('registering for area participation should get a participation award for the first time, but not after', async () => {
    
    const fieldName = "testField";
    const areaName = "testArea";

    await openAirInstance.addArea(fieldName, areaName) 
    const participant = accounts[3];

    const areaParticipationAward = (await openAirInstance.getAwardForParticipation.call()).toNumber();
    const startingBalance = (await opinionTokenInstance.balanceOf.call(participant)).toNumber();
   
    await openAirInstance.registerAreaParticipation(fieldName, areaName, { from: participant }); 

    const balanceAfterFirstRegistration =  (await opinionTokenInstance.balanceOf.call(participant)).toNumber();
    
    assert.equal(balanceAfterFirstRegistration, startingBalance + areaParticipationAward, "Should have received a paricipation award to the account.");

    await openAirInstance.registerAreaParticipation(fieldName, areaName, { from: participant }); 

    const balanceAfterSecondRegistration =  (await opinionTokenInstance.balanceOf.call(participant)).toNumber();
   
    assert.equal(balanceAfterFirstRegistration, balanceAfterSecondRegistration, "There should be no change to the account as no award for double registration.");

  });
  

  it('test approveAndCall', async () => {

    //sign up on an area so as to get some starting balance in account
    const fieldName = "testField";
    const areaName = "testArea";
    await openAirInstance.addArea(fieldName, areaName) 
    await openAirInstance.registerAreaParticipation(fieldName, areaName); 
    
    const str = "TEST";
    var bytesv2 = []; // char codes
    for (var i = 0; i < str.length; ++i) {
      var code = str.charCodeAt(i);
      bytesv2 = bytesv2.concat([code & 0xff, code / 256 >>> 0]);
    } 
    const result = await opinionTokenInstance.approveAndCall(openAirInstance.address, 5, bytesv2); 
    
    assert.ok(result.receipt.status, "Transaction should be successful.");
    
    //assert.isTrue(false, "Purposely failed to show events");
  });



  it('test approveAndSpeak', async () => {

    const fieldName = "testField";
    const areaName = "testArea";
    await openAirInstance.addArea(fieldName, areaName); //this call is restricted to "moderator" - that the contract creator is acting initially 
    const speaker = accounts[4];
    //sign up on the area so as to get some starting balance in account
    await openAirInstance.registerAreaParticipation(fieldName, areaName, {from: speaker}); 
    
    const balanceBeforeSpeak = (await opinionTokenInstance.balanceOf.call(speaker)).toNumber();
    const chargePerSpeech = (await openAirInstance.getChargePerSpeech.call()).toNumber();
    await opinionTokenInstance.approveAndSpeak(openAirInstance.address, chargePerSpeech, fieldName, areaName, "This is a Test Title", "This is a test content.",  {from: speaker}); 
    const balanceAfterSpeak = (await opinionTokenInstance.balanceOf.call(speaker)).toNumber();
    assert.equal(balanceAfterSpeak, balanceBeforeSpeak - chargePerSpeech, "A charge for speech should be deducted from account.")
  });


  it('test approveAndVote', async () => {

    const fieldName = "testField";
    const areaName = "testArea";
    await openAirInstance.addArea(fieldName, areaName); //this call is restricted to "moderator" - that the contract creator is acting initially 
    const speaker = accounts[4];
    const voter1 = accounts[5];
    const voter2 = accounts[6];
    //sign up on the area so as to get some starting balance in account
    await openAirInstance.registerAreaParticipation(fieldName, areaName, {from: speaker}); 
    await openAirInstance.registerAreaParticipation(fieldName, areaName, {from: voter1}); 
    await openAirInstance.registerAreaParticipation(fieldName, areaName, {from: voter2}); 

    //generate a speech to vote against
    const chargePerSpeech = (await openAirInstance.getChargePerSpeech.call()).toNumber();
    await opinionTokenInstance.approveAndSpeak(openAirInstance.address, chargePerSpeech, fieldName, areaName, "This is a Test Title", "This is a test content.",  {from: speaker}); 

    //voter1 upvotes
    var voter1BalanceBefore = (await opinionTokenInstance.balanceOf.call(voter1)).toNumber();
    const chargePerVote = (await openAirInstance.getChargePerVote.call()).toNumber();
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName, 0,  true, "I totally agree!", {from: voter1}); 
    var voter1BalanceAfter = (await opinionTokenInstance.balanceOf.call(voter1)).toNumber();
    assert.equal(voter1BalanceAfter, voter1BalanceBefore - chargePerVote, "A charge for voting should be deducted from voter account.");
  
    //voter2 upvotes
    var speakerBalanceBefore = (await opinionTokenInstance.balanceOf.call(speaker)).toNumber();
    const awardToVoterPerFollower = (await openAirInstance.getAwardToVoterPerFollower.call()).toNumber();
    const awardToSpeakerPerUpVote = (await openAirInstance.getAwardToSpeakerPerUpVote.call()).toNumber();
    voter1BalanceBefore = (await opinionTokenInstance.balanceOf.call(voter1)).toNumber();
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName, 0,  true, "I second!", {from: voter2}); 
    voter1BalanceAfter = (await opinionTokenInstance.balanceOf.call(voter1)).toNumber();
    var speakerBalanceAfter = (await opinionTokenInstance.balanceOf.call(speaker)).toNumber();
    assert.equal(speakerBalanceAfter, speakerBalanceBefore + awardToSpeakerPerUpVote, "An award should be given to the speaker for each upvote.");
    assert.equal(voter1BalanceAfter, voter1BalanceBefore + awardToVoterPerFollower, "An award should be given to leading voter for each following voter on the same side.");
  });

});


