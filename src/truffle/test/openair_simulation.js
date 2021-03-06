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
        //addField(
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
    const account6=accounts[6]
    const account7=accounts[7]    
    const account8=accounts[8]
    const account9=accounts[9]

    //sign up on the area so as to get some starting balance in account
    await openAirInstance.registerAreaParticipation(fieldName, areaName1);  //assuming the current user is account 0
    //await openAirInstance.registerAreaParticipation(fieldName, areaName2);  //assuming the current user is account 0
    await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account1});
    await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account2}); 
    await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account3}); 
    await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account4});
    await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account5});
    await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account6}); 
    await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account7});
    //await openAirInstance.registerAreaParticipation(fieldName, areaName1, {from: account5});

    //generate a speech to vote against
    const chargePerSpeech = (await openAirInstance.getChargePerSpeech.call()).toNumber();
    await opinionTokenInstance.approveAndSpeak(openAirInstance.address, chargePerSpeech, fieldName, areaName1, "Blockchain techology can power open corporate culture", "As a requirement for the survival of companies, openness is necessary to build a culture of trust in organisations.\n\n Blockchain technology offers the advantages of *trust* and *transparency*.", {from: account0});
    await opinionTokenInstance.approveAndSpeak(openAirInstance.address, chargePerSpeech, fieldName, areaName1, "The Open-Air Speech Platform project is awesome!", "This is a test content.", {from: account1}); 
    await opinionTokenInstance.approveAndSpeak(openAirInstance.address, chargePerSpeech, fieldName, areaName1, "Hackathon anouncement", "This is a test content.", {from: account2}); 
    await opinionTokenInstance.approveAndSpeak(openAirInstance.address, chargePerSpeech, fieldName, areaName1, "Blockchain has no place in a bank!!", "This is a test content.", {from: account3}); 

    //upvotes
    const chargePerVote = (await openAirInstance.getChargePerVote.call()).toNumber();
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 0,  true, "I totally agree!", {from: account1}); 
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 0,  true, "I totally agree!", {from: account2}); 
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 0,  true, "I totally agree!", {from: account3}); 
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 0,  true, "I totally agree!", {from: account6}); 
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 0,  true, "I totally agree!", {from: account5}); 
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 1,  true, "I totally agree!", {from: account0}); 
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 1,  true, "I totally agree!", {from: account2});
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 1,  true, "I totally agree!", {from: account3});
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 2,  true, "I totally agree!", {from: account4}); 

  
    //downvotes
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 0,  false, "I disagree!", {from: account4}); 
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 1,  false, "I disagree!", {from: account4});
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 0,  false, "I disagree!", {from: account7});
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 3,  false, "I disagree!", {from: account0});
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 3,  false, "I disagree!", {from: account1});
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 3,  false, "I disagree!", {from: account2});
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 3,  false, "I disagree!", {from: account4});
    await opinionTokenInstance.approveAndVote(openAirInstance.address, chargePerVote, fieldName, areaName1, 3,  false, "I disagree!", {from: account5});

    assert.isTrue(true, "This is for simulation"); 
  });

});


