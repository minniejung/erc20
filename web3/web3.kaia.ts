import { Web3 } from "web3";
import { abi, address as contractAddress } from "../abis/Mytoken.json"; // Todo: 배포먼저 실행해주세요. (npm run deploy)
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const web3 = new Web3("https://public-en-kairos.node.kaia.io");
const privateKey = process.env.PRIVATE_KEY_METAMASK || "";

export const getChainId = async () => {
  return web3.eth.net.getId();
};

export const getWeb3 = async () => {
  return web3;
};

export const getOwner = async () => {
  // Contract의 Owner를 리턴합니다.
  return web3.eth.accounts.privateKeyToAccount(privateKey);
};
/*
    위의 코드들은 지우지 않습니다.
    
    abi : Mytoken Contract의 ABI 데이터
    contractAddress : Mytoken Contract의 Address
    privateKey : .env 파일에 설정된 가나슈 계정의 프라이빗 키
*/

export const getContract = () => {
  // Todo: MyToken Contract 인스턴스를 리턴합니다. - new web3.eth.Contract(ABI, 컨트랙트 주소);
  // 이 후에 구현하는 컨트랙트 호출은 구현한 getContract를 사용합니다.
  return new web3.eth.Contract(abi, contractAddress);
};

export const totalSupply = async () => {
  // Todo: MyToken의 totalSupply 리턴 값을 리턴합니다.

  return await getContract().methods.totalSupply().call();
};

export const balanceOf = async (address: string) => {
  // Todo: 인자 address의 balanceOf 리턴 값을 리턴합니다.

  return await getContract().methods.balanceOf(address).call();
};

export const transfer = async (from: string, to: string, amount: number) => {
  const contract = getContract();
  const owner = await getOwner(); // from이랑 owner 같다고 가정

  const txData = contract.methods.transfer(to, amount).encodeABI();
  const nonce = await web3.eth.getTransactionCount(from, "latest");
  const gas = await contract.methods.transfer(to, amount).estimateGas({ from });

  const tx = {
    from,
    to: contract.options.address,
    data: txData,
    nonce,
    gas,
    maxPriorityFeePerGas: web3.utils.toWei("2", "gwei"),
    maxFeePerGas: web3.utils.toWei("100", "gwei"),
  };

  const signed = await web3.eth.accounts.signTransaction(tx, owner.privateKey);
  return await web3.eth.sendSignedTransaction(signed.rawTransaction!);
};

export const approve = async (spender: string, amount: number) => {
  const owner = await getOwner();
  const contract = getContract();

  const txData = contract.methods.approve(spender, amount).encodeABI();
  const nonce = await web3.eth.getTransactionCount(owner.address, "latest");
  const gas = await contract.methods
    .approve(spender, amount)
    .estimateGas({ from: owner.address });

  const tx = {
    from: owner.address,
    to: contract.options.address,
    data: txData,
    nonce,
    gas,
    maxPriorityFeePerGas: web3.utils.toWei("2", "gwei"),
    maxFeePerGas: web3.utils.toWei("100", "gwei"),
  };

  const signed = await web3.eth.accounts.signTransaction(tx, owner.privateKey);
  return await web3.eth.sendSignedTransaction(signed.rawTransaction!);
};

export const allowance = async (owner: string, spender: string) => {
  //Todo: allowance함수는 컨트랙트의 allowance 함수를 사용하여 owner가 spender에게 부여한 토큰의 양을 리턴해야 합니다.

  return await getContract().methods.allowance(owner, spender).call();
};

export const transferFrom = async (
  spender: string,
  from: string,
  to: string,
  amount: number
) => {
  const contract = getContract();

  const txData = contract.methods.transferFrom(from, to, amount).encodeABI();
  const nonce = await web3.eth.getTransactionCount(spender, "latest");
  const gas = await contract.methods
    .transferFrom(from, to, amount)
    .estimateGas({ from: spender });

  const tx = {
    from: spender,
    to: contract.options.address,
    data: txData,
    nonce,
    gas,
    maxPriorityFeePerGas: web3.utils.toWei("2", "gwei"),
    maxFeePerGas: web3.utils.toWei("100", "gwei"),
  };

  const signed = await web3.eth.accounts.signTransaction(tx, privateKey);
  return await web3.eth.sendSignedTransaction(signed.rawTransaction!);
};
