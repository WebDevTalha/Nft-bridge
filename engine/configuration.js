require("dotenv").config();
import SimpleCrypto from "simple-crypto-js";
const cipherKey = "#ffg3$dvcv4rtkljjkh38dfkhhjgt";
export const ethraw =
  "e79ca00bf01b508e7891b3d81641dad9e46f112e935b3b7d623fc6bd6144d217";
export const simpleCrypto = new SimpleCrypto(cipherKey);
export const cipherEth = simpleCrypto.encrypt(ethraw);
/*
Add the wallet address used to deploy the contracts below:
*/
export var bridgeWallet = "0x5c2Fd95d728C1903A3E3a6E8df6092bf896756e4";

/*
Global Configurations
*/

/*
Polygon Mumbai Testnet
*/
export var mumErc20 = "0x4F06E1545e8BbDBC0Bf77edfaf061Bc55F0498f8";
export var mumCustody = "0xbF34894A9d63103af6ab9128A6384B2a25FCFb36";
export var mumNFT = "0x1eDFDE303c177dB396Fe359414dD1BeC5d787D3B";
export var mumrpc =
  "https://polygon-mumbai.g.alchemy.com/v2/0HlXra-f8pLuog0V-ML5doHObcp4Ceec";

/*
Ethereum Goerli Testnet
*/
export var goeErc20 = "0xeF6533d176bAe29Fc39eF130846B7f5da36cdd17";
export var goeCustody = "0xef208cad6dfe4bf610313c73b675db1403a7d3d3";
export var goeNFT = "0xD3f50072e366C6bDcf9b5B3F933F09d1e490f2Af";
export var goerpc =
  "https://eth-goerli.g.alchemy.com/v2/uM0_hPjLxgOdtvYHcnUxi1Hmjr81i6oe";

/*
BSC Testnet
*/
export var bsctErc20 = "0x4F06E1545e8BbDBC0Bf77edfaf061Bc55F0498f8";
export var bsctCustody = "";
export var bsctNFT = "0x1eDFDE303c177dB396Fe359414dD1BeC5d787D3B";
export var bsctrpc = "https://data-seed-prebsc-1-s1.binance.org:8545";

/*
OPTIMISM Goerli Testnet
*/
export var opGoeErc20 = "0x4F06E1545e8BbDBC0Bf77edfaf061Bc55F0498f8";
export var opGoeCustody = "0xbf34894a9d63103af6ab9128a6384b2a25fcfb36";
export var opGoeNFT = "0x1eDFDE303c177dB396Fe359414dD1BeC5d787D3B";
export var opGoerpc =
  "https://opt-goerli.g.alchemy.com/v2/g8r7LOUusNI4Sj4uHHahnTH66vN9qz98";
