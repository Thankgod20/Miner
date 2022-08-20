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

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}