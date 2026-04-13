// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {Evix} from "../src/Evix.sol";

contract DeployScript is Script {
    function run() external {
        address owner = vm.envAddress("OWNER");

        vm.startBroadcast();
        Evix evix = new Evix(owner);
        vm.stopBroadcast();

        // solhint-disable-next-line no-console
        (evix);
    }
}
