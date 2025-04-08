import { allowance, approve, getOwner, getWeb3 } from "../web3/web3.kaia";

async function testAllowance() {
  const web3 = await getWeb3();
  const owner = await getOwner();
  const spender = owner.address;

  const amount = web3.utils.toWei("3", "ether");
  console.log(`✅ Approving ${amount} tokens to ${spender}...`);
  await approve(spender, Number(amount));

  const result = await allowance(owner.address, spender);
  if (!result) throw new Error("❌ allowance() returned undefined");

  const resultInEther = web3.utils.fromWei(result.toString(), "ether");
  console.log(
    `🧾 Allowance from ${owner.address} to ${spender}: ${resultInEther} tokens`
  );
}

testAllowance().catch((err) => {
  console.error("❌ Error occurred:", err);
});
