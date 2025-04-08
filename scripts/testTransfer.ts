import { transfer, balanceOf, getOwner, getWeb3 } from "../web3/web3.kaia";

async function testTransfer() {
  const web3 = await getWeb3();
  const owner = await getOwner();
  const from = owner.address;

  console.log("from", from);

  const to = "0xfca1c3a52c77e89f0a2a8ac635afcaec3f76e5ee";

  const amount = web3.utils.toWei("1", "ether");
  console.log(`🔁 Transferring ${amount} wei from ${from} to ${to}`);

  // 전송 전 잔액
  const balanceBefore = await balanceOf(to);
  console.log("balanceBefore", balanceBefore);
  if (!balanceBefore) throw new Error("Balance fetch failed");
  console.log(
    "💰 To address balance before:",
    web3.utils.fromWei(balanceBefore.toString(), "ether")
  );

  // 트랜잭션 실행
  const tx = await transfer(from, to, Number(amount));
  console.log("✅ Transfer Tx hash:", tx.transactionHash);

  // 전송 후 잔액
  const balanceAfter = await balanceOf(to);
  if (!balanceAfter) throw new Error("Balance fetch failed");
  console.log(
    "💰 To address balance after:",
    web3.utils.fromWei(balanceAfter.toString(), "ether")
  );
}

testTransfer().catch((err) => {
  console.error("❌ Error occurred:", err);
});
