// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// 📌 2. Add a Max Supply Cap
contract MyToken is ERC20, Ownable {
    constructor() ERC20("MyToken", "MKT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // decimals()는 함수
    // constant는 컴파일 시점에 값이 고정되어야 하는 상수라서 decimals()를 사용할 수 없음
    // Solidity는 constant 안에서 런타임 함수를 호출하는 걸 금지

    // the underscores are just for readability.
    // uint256 x = 2_000_000; // same as 2000000

    uint256 public constant MAX_SUPPLY = 2_000_000 * 10 ** 18;

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds Max Supply");
        _mint(to, amount);
    }
}
