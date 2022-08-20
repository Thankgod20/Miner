
/**
 /$$   /$$                  /$$$$$$$$                       /$$           /$$       /$$          
|__/  | $$                 |__  $$__/                      | $$          | $$      | $$          
 /$$ /$$$$$$   /$$$$$$$       | $$  /$$$$$$  /$$$$$$   /$$$$$$$  /$$$$$$ | $$$$$$$ | $$  /$$$$$$ 
| $$|_  $$_/  /$$_____//$$$$$$| $$ /$$__  $$|____  $$ /$$__  $$ |____  $$| $$__  $$| $$ /$$__  $$
| $$  | $$   |  $$$$$$|______/| $$| $$  \__/ /$$$$$$$| $$  | $$  /$$$$$$$| $$  \ $$| $$| $$$$$$$$
| $$  | $$ /$$\____  $$       | $$| $$      /$$__  $$| $$  | $$ /$$__  $$| $$  | $$| $$| $$_____/
| $$  |  $$$$//$$$$$$$/       | $$| $$     |  $$$$$$$|  $$$$$$$|  $$$$$$$| $$$$$$$/| $$|  $$$$$$$
|__/   \___/ |_______/        |__/|__/      \_______/ \_______/ \_______/|_______/ |__/ \_______/
https://itstradable.info/bsc/
twitter: @i_tradable
 */

// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC20/ERC20.sol)

pragma solidity  >=0.4.22 <0.9.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
import "./ERC20.sol";
import "./Ownable.sol";
contract USDi is ERC20, Ownable {
    using SafeMath for uint;
    uint private _totalMint = 0;

    constructor() ERC20("r-USD", "USD-ri") {}

    function mint(address to, uint amount,uint _tAmount) public onlyOwner {
        _totalMint += _tAmount;
        _mint(to, amount); 
    }

    function burn(address from, uint amount) public onlyOwner {
        _totalMint -= amount;
        _burn(from, amount); 
    }

    function disburse(uint _rewards, address[] memory holders,uint _dreward) public onlyOwner returns (bool){
        //uint f_reward_t = _rewards;
        _totalSupply += _dreward;
        uint reward_t = _rewards;
        address[] memory d_holders = holders;
        uint num_holder = d_holders.length;
        require(num_holder>0,"Zero Divide");
        uint reward_per = reward_t.div(num_holder);
        uint count = 0;
        for (uint i = 0; i< num_holder;i++) {
            address hold_ers = d_holders[i];
            reward_t -= reward_per;
            count +=1;            
            if (_balances[hold_ers] > 0 && reward_t>reward_per)
                _balances[hold_ers]+=reward_per;

        }
        require(count>0,"Disburses Error");
        return true;
    }

    function getTotalMint() public view returns (uint) {
        return _totalMint;
    }
    
    /// (UPDATE) `transferOwnership` is already an externally-facing method inherited from `Ownable`
    /// Thanks @brianunlam for pointing this out
    ///
    /// function _transferOwnership(address newOwner) public onlyOwner {
    ///     transferOwnership(newOwner);
    /// }
}