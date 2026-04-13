// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {Evix} from "../src/Evix.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract EvixTest is Test {
    Evix public evix;
    MockERC20 public tokenA;
    MockERC20 public tokenB;

    address public owner = makeAddr("owner");
    address public user = makeAddr("user");
    address public recipient = makeAddr("recipient");

    function setUp() public {
        evix = new Evix(owner);
        tokenA = new MockERC20("Token A", "TKA", 18);
        tokenB = new MockERC20("Token B", "TKB", 18);

        vm.prank(owner);
        evix.setPairSupport(address(tokenA), address(tokenB), true);

        tokenA.mint(user, 1_000_000e18);
        tokenB.mint(address(evix), 1_000_000e18);

        vm.prank(user);
        tokenA.approve(address(evix), type(uint256).max);
    }

    function test_swap() public {
        uint256 amountIn = 1000e18;
        uint256 deadline = block.timestamp + 60;

        vm.prank(user);
        uint256 amountOut = evix.swap(
            address(tokenA), address(tokenB), amountIn, deadline, 0, recipient
        );

        assertEq(amountOut, amountIn);
        assertEq(tokenB.balanceOf(recipient), amountIn);
    }

    function test_swap_revertsOnDeadline() public {
        vm.warp(1000);

        vm.prank(user);
        vm.expectRevert(Evix.DeadlineExceeded.selector);
        evix.swap(address(tokenA), address(tokenB), 1000e18, 999, 0, recipient);
    }

    function test_swap_revertsOnInsufficientOutput() public {
        uint256 amountIn = 1000e18;
        uint256 deadline = block.timestamp + 60;

        vm.prank(user);
        vm.expectRevert(
            abi.encodeWithSelector(Evix.InsufficientOutput.selector, amountIn, amountIn + 1)
        );
        evix.swap(
            address(tokenA), address(tokenB), amountIn, deadline, amountIn + 1, recipient
        );
    }

    function test_swap_revertsOnZeroAmount() public {
        vm.prank(user);
        vm.expectRevert(Evix.InvalidAmountIn.selector);
        evix.swap(
            address(tokenA), address(tokenB), 0, block.timestamp + 60, 0, recipient
        );
    }

    function test_swap_revertsOnZeroRecipient() public {
        vm.prank(user);
        vm.expectRevert(Evix.InvalidRecipient.selector);
        evix.swap(
            address(tokenA), address(tokenB), 1000e18, block.timestamp + 60, 0, address(0)
        );
    }

    function test_swap_revertsOnUnsupportedPair() public {
        MockERC20 tokenC = new MockERC20("Token C", "TKC", 18);

        vm.prank(user);
        vm.expectRevert(
            abi.encodeWithSelector(
                Evix.UnsupportedPair.selector, address(tokenA), address(tokenC)
            )
        );
        evix.swap(
            address(tokenA), address(tokenC), 1000e18, block.timestamp + 60, 0, recipient
        );
    }

    function test_setPairSupport_onlyOwner() public {
        vm.prank(user);
        vm.expectRevert("Evix: unauthorized");
        evix.setPairSupport(address(tokenA), address(tokenB), false);
    }
}
