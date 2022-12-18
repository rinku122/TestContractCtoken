// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface CErc20 {
    function balanceOf(address account) external view returns (uint256);

    function mint(uint256) external returns (uint256);
}
