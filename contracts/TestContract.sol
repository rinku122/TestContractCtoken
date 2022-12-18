// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./libraries/TransferHelper.sol";
import "./interfaces/IRouter.sol";
import "./interfaces/ICErc20.sol";
import "./interfaces/ICompound.sol";

contract TestContract is Context, ReentrancyGuard, ERC20 {
    address private USDT;
    address private USDC;
    IRouter private router;
    ICompound private compound;
    uint256 internal constant UINT_MAX = type(uint256).max;

    constructor(
        address _USDT,
        address _USDC,
        address _router,
        address _compound
    ) ERC20("Compund USDC", "cUSDC") {
        USDT = _USDT;
        USDC = _USDC;
        router = IRouter(_router);
        compound = ICompound(_compound);
        TransferHelper.safeApprove(USDT, address(router), UINT_MAX);
        TransferHelper.safeApprove(USDC, address(compound), UINT_MAX);
    }

    /**
     * @notice Swaps USDT to USDC and sends token to compound Protocol
     * @param amount Amount is the amount of USDT
     */

    function investment(uint256 amount) external nonReentrant {
        require(amount > 0, "Main : Insufficient Investment");
        TransferHelper.safeTransferFrom(
            USDT,
            msg.sender,
            address(this),
            amount
        );

        address[] memory path0 = new address[](2);
        path0[0] = USDT;
        path0[1] = USDC;

        uint256[] memory amountsOutToken0 = router.getAmountsOut(amount, path0);
        uint256 amountOutToken0 = amountsOutToken0[amountsOutToken0.length - 1];
        //Swapping USDT to USDC
        router.swapExactTokensForTokens(
            amount,
            amountOutToken0,
            path0,
            address(this),
            block.timestamp
        );
        //Giving token to compound protocol
        compound.supply(USDC, amountOutToken0);
        //Minting receipt token
        _mint(_msgSender(), amountOutToken0);
    }
}
