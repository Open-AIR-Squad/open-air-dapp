const OpenAir = artifacts.require("OpenAir");
const OpinionToken = artifacts.require("OpinionToken");

contract('OpenAir', (accounts) => {
  let openAirInstance, opinionTokenInstance;
  beforeEach(async () => {
    //openAirInstance = await OpenAir.deployed();
    openAirInstance = await OpenAir.new(); //new() would reset the context, so as not for the test case to be polluted by preceding ones
    opinionTokenInstance = await OpinionToken.at(await openAirInstance.getTokenContractAddress.call());
  });


  it('test simulation', async () => {

    const fieldName = "Bank-wide";
    const areaName1 = "Innovation";
    const areaName2 = "Goverance";

            //some initial fields and areas for testing of web app
        //addField("Bank-wide");
        await openAirInstance.addField("Bank-wide");
        //addArea("Bank-wide", "Innovation");
        await openAirInstance.addArea("Bank-wide", "Innovation");
        //addArea("Bank-wide", "Governance");
        await openAirInstance.addArea("Bank-wide", "Governance");
        //addArea("Bank-wide", "Work and Life");
        await openAirInstance.addArea("Bank-wide", "Work and Life");
        //addArea("Bank-wide", "Environment");
        await openAirInstance.addArea("Bank-wide", "Environment");
        
        
        await openAirInstance.addField("CIO Organization");
        await openAirInstance.addField("Infrastructure");
        await openAirInstance.addField("Retail Branches");

  

    const account0=accounts[0]
    const account1=accounts[1]
    const account2=accounts[2]
    const account3=accounts[3]    
    const account4=accounts[4]
    const account5=accounts[5]

    //sign up on the area so as to get some starting balance in account
    await openAirInstance.registerAreaParticipation(fieldName, areaName1);  //assuming the current user is account 0
    //await openAirInstance.registerAreaParticipation(fieldName, areaName2);  //assuming the current user is account 0
    await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account1});
    await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account2}); 
    await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account3}); 
    await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account4});
    await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account5});

    //generate a speech to vote against
    const chargePerSpeech = (await openAirInstance.getChargePerSpeech.call()).toNumber();
    await opinionTokenInstance.approveAndSpeak(openAirInstance.address, chargePerSpeech, fieldName, areaName1, "Blockchain Technology for Open corporate culture", "This is a test content."); 
    await opinionTokenInstance.approveAndSpeak(openAirInstance.address, chargePerSpeech, fieldName, areaName1, "The Open-Air DApp is awesome!", "This is a test content.", {from: account1}); 
    await opinionTokenInstance.approveAndSpeak(openAirInstance.address, chargePerSpeech, fieldName, areaName1, "Test titile in area 1 from account2", "This is a test content.", {from: account2}); 
    await opinionTokenInstance.approveAndSpeak(openAirInstance.address, chargePerSpeech, fieldName, areaName2, "Test titile in area 2 from account0", "This is a test content."); 

    //upvotes
    const chargePerVote = (await openAirInstance.getChargePerVote.call()).toNumber();
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 0,  true, "I totally agree!", {from: account1}); 
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 0,  true, "I totally agree!", {from: account2}); 
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 1,  true, "I totally agree!", {from: account0}); 

  
    //downvotes
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 0,  false, "I disagree!", {from: account4}); 
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 1,  false, "I disagree!", {from: account4});
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 0,  false, "I disagree!", {from: account5});
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 2,  false, "I disagree!", {from: account0});
    
    assert.isTrue(true, "This is for simulation"); 
  });

});


