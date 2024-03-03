// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CasinoToken is ERC20 {
    constructor() ERC20("CasinoToken", "CSNT") {
        _mintTo(msg.sender, 100);
    }

    function _mintTo(address to, uint256 amount) internal {
        _mint(to, amount * 10**decimals());
    }

    function MintTo(address to, uint256 amount) public {
        _mintTo(to, amount);
    }
}
