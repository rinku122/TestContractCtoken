// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

interface ICompound {
    function supply(address asset, uint256 amount) external;
}
