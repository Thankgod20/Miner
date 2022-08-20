const StakingContract = artifacts.require("StakeMiner");
const FLoan = artifacts.require("FLoan");
const WETH = artifacts.require("WETH");
const PancakeRouter = artifacts.require("pancakeRouter");
const ERC20 = artifacts.require("ERC20");
const PancakeFactory = artifacts.require("pancakeFactory");
const BN = require("bn.js");

contract("StakeMiner Contract", (accounts)=> {
    let stakeHolder = null;
    let weth = null;
    let usdt = null;
    let usdc = null;
    let pump = null;
    let pancakeRounter = null;
    let usd_i = null;
    let usd_i_r = null;
    let flashLoan = null;
    before(async ()=>{
        //0xFf301e3c3Bf276C574B93d196761cF883B9f1710
        //stakeHolder = await StakingContract.at("0xFf301e3c3Bf276C574B93d196761cF883B9f1710");
        stakeHolder = await StakingContract.new("0x55d398326f99059fF775485246999027B3197955");
        

        weth = await WETH.at("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");
        usdt = await ERC20.at("0x55d398326f99059fF775485246999027B3197955");
        usdc = await ERC20.at("0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d");
        pump = await ERC20.at("0x104Ea31A8d46e1826a2042580B405038E6acFCA6");
        flashLoan = await FLoan.new(stakeHolder.address,usdt.address);

        pancakeRounter = await PancakeRouter.at("0x10ED43C718714eb63d5aA57B78B54704E256024E");
        usd_i =  await stakeHolder.getUSDi({from:accounts[0]}).catch(err => {console.log(err)});
        usd_i_r = await ERC20.at(usd_i);
    });
    for (let i = 0; i < accounts.length;i++) {
        it("Swap WETH to USDT", async() => {
            console.log("User",accounts[i])
            return pancakeRounter.swapExactETHForTokensSupportingFeeOnTransferTokens(
                0,
                [weth.address,usdt.address],
                accounts[i],
                Math.floor(Date.now() / 1000) + 60 * 10,
                {from:accounts[i],value:'10000000000000000000'}
            ).then(async result=>{
                let USDtB = await usdt.balanceOf(accounts[i]);
                console.log("Balance of USD-t",USDtB.toString())
            }).catch(err => {console.log(err)});
        
        });
    }
    for (let i = 0; i < accounts.length;i++) {
        it("Swap WETH to USDc", async() => {
            console.log("User",accounts[i])
            return pancakeRounter.swapExactETHForTokensSupportingFeeOnTransferTokens(
                0,
                [weth.address,usdc.address],
                accounts[i],
                Math.floor(Date.now() / 1000) + 60 * 10,
                {from:accounts[i],value:'10000000000000000000'}
            ).then(async result=>{
                let USDtB = await usdt.balanceOf(accounts[i]);
                console.log("Balance of USD-t",USDtB.toString())
            }).catch(err => {console.log(err)});
        
        });
    }
    for (let i = 1; i < accounts.length/2;i++) {
        it ("Stake USDT",async() => {
            console.log("User",accounts[i])
            console.log("usd-i",usd_i);
            console.log("stakeAddr",stakeHolder.address);
            let usdtBalance = await usdt.balanceOf(accounts[i]).catch(err => {console.log(err)});
            let RecepttBalanceO = await usd_i_r.balanceOf(accounts[i],{from:accounts[i]})
            console.log("Recept",RecepttBalanceO.toString())
            return usdt.approve(stakeHolder.address,usdtBalance,{from:accounts[i]}).then(async() =>{
                let allowance = await usdt.allowance(accounts[i],stakeHolder.address,{from:accounts[i]});
                console.log("Allowance",allowance.toString())
                let amountStake = "150000000000000000000";
                let stake = await stakeHolder.stake(amountStake,usdt.address,{from:accounts[i],gas:3000000,gasPrice:null}).catch(err => {console.log("EER",err)});
                let contractBalance = await usdt.balanceOf(stakeHolder.address,{from:accounts[i]})
                let RecepttBalance = await usd_i_r.balanceOf(accounts[i],{from:accounts[i]})
                console.log("Stake",contractBalance.toString());
                console.log("Recept",RecepttBalance.toString())
                let USDTBalance = await usdt.balanceOf(accounts[i],{from:accounts[i]})
                console.log("USDT-B b4",USDTBalance.toString())

                let stBalance = await stakeHolder.getTotalMint({from:accounts[i]})
                console.log("Total Mint ",stBalance.toString());             
                let contractTS = await usd_i_r.totalSupply({from:accounts[i]})
                console.log("USDi TOTSL SUP ",contractTS.toString());
            }).catch(err => {console.log("ERR",err)})
            //console.log(approveUsdt);


        })
    }
    for (let i = (accounts.length/2); i < accounts.length-3;i++) {
        it ("Stake WBNB",async() => {
            console.log("User",accounts[i])
            console.log("usd-i",usd_i);
            console.log("stakeAddr",stakeHolder.address);
            let usdtBalance = await usdt.balanceOf(accounts[i]).catch(err => {console.log(err)});

            let amountStake = "450000000000000000000";
            let stake = await stakeHolder.stake(amountStake,weth.address,{from:accounts[i],value:"1000000000000000000",gas:3000000,gasPrice:null}).catch(err => {console.log("EER",err)});
            let contractBalance = await usdt.balanceOf(stakeHolder.address,{from:accounts[i]})
            let RecepttBalance = await usd_i_r.balanceOf(accounts[i],{from:accounts[i]})
            console.log("Stake",contractBalance.toString());
            console.log("Recept",RecepttBalance.toString())
            let USDTBalance = await usdt.balanceOf(accounts[i],{from:accounts[i]})
            console.log("USDT-B b4",USDTBalance.toString())

            let stBalance = await stakeHolder.getTotalMint({from:accounts[i]})
            console.log("Total Mint ",stBalance.toString());             
            let contractTS = await usd_i_r.totalSupply({from:accounts[i]})
            console.log("USDi TOTSL SUP ",contractTS.toString());
            //console.log(approveUsdt);


        })
    }
    for (let i = accounts.length-3; i < accounts.length;i++) {
        it ("Stake USDc",async() => {
            console.log("User",accounts[i])
            console.log("usd-i",usd_i);
            console.log("stakeAddr",stakeHolder.address);
            let usdcBalance = await usdc.balanceOf(accounts[i]).catch(err => {console.log(err)});
            return usdc.approve(stakeHolder.address,usdcBalance,{from:accounts[i]}).then(async() =>{
                let allowance = await usdc.allowance(accounts[i],stakeHolder.address,{from:accounts[i]});
                console.log("Allowance",allowance.toString())
                let amountStake = "450000000000000000000";
                let stake = await stakeHolder.stake(amountStake,usdc.address,{from:accounts[i],gas:3000000,gasPrice:null}).catch(err => {console.log("EER",err)});
                let contractBalance = await usdt.balanceOf(stakeHolder.address,{from:accounts[i]})
                let RecepttBalance = await usd_i_r.balanceOf(accounts[i],{from:accounts[i]})
                console.log("Stake",contractBalance.toString());
                console.log("Recept",RecepttBalance.toString())
                let USDTBalance = await usdc.balanceOf(accounts[i],{from:accounts[i]})
                console.log("USDT-B b4",USDTBalance.toString())

                let stBalance = await stakeHolder.getTotalMint({from:accounts[i]})
                console.log("Total Mint ",stBalance.toString());             
                let contractTS = await usd_i_r.totalSupply({from:accounts[i]})
                console.log("USDi TOTSL SUP ",contractTS.toString()); 

            }).catch(err => {console.log("ERR",err)})
            //console.log(approveUsdt);


        })
    } 
    let totalWith = 0;
    for (let i = 1; i < accounts.length;i++) {
        
        it("Check %increase", async() => {
            let USDTBalance = await usdt.balanceOf(accounts[i],{from:accounts[i]})
            console.log("USDT-B b4",USDTBalance.toString())
            let usdi_b = await usd_i_r.balanceOf(accounts[i],{from:accounts[i]});
            totalWith+=parseInt(usdi_b.toString())
            console.log("Current Rate", usdi_b.toString());
            console.log("totalWithdrawal",totalWith)
        })
    }/*
    it("initiate Flashloan", async() => {
        let fundFl = await usdt.transfer(flashLoan.address,"50000000000000000000");
        let balancFl = await usdt.balanceOf(flashLoan.address);

        console.log("Flash Loan Balance",balancFl.toString());
        let fl = await flashLoan.initStateLoan("100000000000000000000");
        for (let x in fl.logs)
            console.log("FlashLoan Report:-",fl.logs[x].args.message,"Value:-",fl.logs[x].args.val.toString());
    })*/
    for (let i=1;i< accounts.length;i++) {
        it("Vote New Team",async() => {
            let usdtBalance = await usdt.balanceOf(accounts[i]).catch(err => {console.log(err)});
            let USDTBalance = await usdt.balanceOf(accounts[i],{from:accounts[i]})
            console.log("USDT-B b4",USDTBalance.toString())
            return usdt.approve(stakeHolder.address,usdtBalance,{from:accounts[i]}).then(async() =>{
                return stakeHolder.voteNewTeam(accounts[0],"105000000000000000000",{from:accounts[i],gas:3000000,gasPrice:null}).then(async()=>{
                    let checkAdd = await stakeHolder.checkOwner(accounts[2],{from:accounts[i]});
                    console.log("Address ADDed",checkAdd.toString());
                })
            })
        })
    }
    it("itTeam withdraw Stake", async() => {
        let totalUsdt = await usdt.balanceOf(stakeHolder.address,{from:accounts[0]});
        console.log("Before Withdrawal",totalUsdt.toString());
        let team1Usdt = await usdt.balanceOf(accounts[0],{from:accounts[0]});
        console.log("Team Usdt",team1Usdt.toString());  
        return stakeHolder.withdrawal(totalUsdt.toString(),{from:accounts[0]}).then (async() =>{
            let totalAUsdt = await usdt.balanceOf(stakeHolder.address,{from:accounts[0]});
            console.log("After Withdrawal",totalAUsdt.toString());    
            let teamUsdt = await usdt.balanceOf(accounts[0],{from:accounts[0]});
            console.log("Team Usdt",teamUsdt.toString());               
        })
       
    });
    it("Add new team Member", async() =>{
        return stakeHolder.addItsTTeam(accounts[1],{from:accounts[0]}).then(async() =>{
            let checkAdd = await stakeHolder.checkOwner(accounts[1],{from:accounts[0]});
            console.log("Address ADDed",checkAdd.toString());
        })
    });
    it("Set Vote Requirement", async() =>{
        return stakeHolder.voteRequirement("50000000000000000000",18,{from:accounts[0]}).then(async() =>{
            let amounttV = await stakeHolder.numberVote();
            let reqVoter = await stakeHolder.chargeVote();
            console.log("Vote Requiremetns",amounttV.toString(),"Number of V",reqVoter.toString())
        })
    });
    it("itTeam Deposit Stake", async() => {
        let totalUsdt = await usdt.balanceOf(stakeHolder.address,{from:accounts[0]});
        console.log("Before Withdrawal",totalUsdt.toString());
        let teamUsdt = await usdt.balanceOf(accounts[0],{from:accounts[0]});
        console.log("Team Usdt",teamUsdt.toString());         
        return usdt.approve(stakeHolder.address,teamUsdt,{from:accounts[0]}).then(async() =>{
            let Deposit = await stakeHolder.Deposit(teamUsdt.toString(),{from:accounts[0]});
            let totalAUsdt = await usdt.balanceOf(stakeHolder.address,{from:accounts[0]});
            console.log("After Withdrawal",totalAUsdt.toString());   
        }); 
         
    });
    for (let i = 1; i < accounts.length;i++) {
        
        it("UnStake token", async() => {
            console.log("User",accounts[i]);

            let USDTBalance = await usdt.balanceOf(accounts[i],{from:accounts[i]})
            console.log("USDT-B b4",USDTBalance.toString())
            
            let totalUsdt = await usdt.balanceOf(stakeHolder.address,{from:accounts[i]})   
            console.log("Total USdt ",totalUsdt.toString());
            
            let contractBalance = await stakeHolder.getTotalMint({from:accounts[i]})
            console.log("Total Mint ",contractBalance.toString());             
            let contractTS = await usd_i_r.totalSupply({from:accounts[i]})
            console.log("USDi TOTSL SUP ",contractTS.toString()); 

            let usdi_b = await usd_i_r.balanceOf(accounts[i],{from:accounts[i]});
            console.log("USDI Rate", usdi_b.toString());
            // Get Stake output
            let stakeOupt = await stakeHolder.getStakeOutPut(usdi_b.toString(),{from:accounts[i]});
            console.log("Stake Ext Output", stakeOupt.toString())
            
            return usd_i_r.approve(stakeHolder.address,usdi_b,{from:accounts[i]}).then(async() =>{
                let allowance = await usd_i_r.allowance(accounts[i],stakeHolder.address,{from:accounts[i]});
                console.log("Allowance",allowance.toString())
                let amountBurn = ('%s.',usdi_b.toString());
                console.log("Amount-burn",amountBurn);
                
                let stake = await stakeHolder.unStake(String(usdi_b),{from:accounts[i],gas:3000000,gasPrice:null});
                //console.log(stake.logs[0].args);
                console.log(stake.logs[0].args.from);
                console.log(stake.logs[0].args.amount.toString());
                let contractBalance = await stakeHolder.getTotalMint({from:accounts[i]})
                let totalUsdt = await usdt.balanceOf(stakeHolder.address,{from:accounts[i]})
                let RecepttBalance = await usd_i_r.balanceOf(accounts[i],{from:accounts[i]})
                let USDTBalance = await usdt.balanceOf(accounts[i],{from:accounts[i]})
                console.log("Total USdt ",totalUsdt.toString());
                console.log("UnStake ",contractBalance.toString());
                console.log("USDT-B",USDTBalance.toString())
                console.log("Recept",RecepttBalance.toString())

            }).catch(err => {console.log("ERR",err)})

        })
    } 
});