"use client";
require("dotenv").config();
const Cryptr = require("cryptr");
import React from "react";
import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Text,
  Col,
  Container,
  Spacer,
  Checkbox,
  Button,
  Row,
  Dropdown,
  Modal,
  Image,
  Spinner,
} from "@nextui-org/react";
import { ethers, providers } from "ethers";
import { bridgeWallet, ethraw } from "../engine/configuration";
import { goeNFT, goeCustody, goeErc20, goerpc } from "../engine/configuration";
import {
  opGoeErc20,
  opGoeCustody,
  opGoeNFT,
  opGoerpc,
} from "../engine/configuration";
import {
  bsctNFT,
  bsctCustody,
  bsctErc20,
  bsctrpc,
} from "../engine/configuration";
import { mumNFT, mumCustody, mumErc20, mumrpc } from "../engine/configuration";
import "sf-font";
import "aos/dist/aos.css";
import BridgeABI from "../engine/BridgeABI.json";
import CustodyABI from "../engine/CustodyABI.json";
import NftABI from "../engine/NftABI.json";
import Erc20ABI from "../engine/Erc20ABI.json";
import Web3Modal from "web3modal";
import Web3 from "web3";
import axios from "axios";
import Sourcebridge from "../engine/interfaces/Sourcebridge";
import Circles from "../engine/circles";
import detectEthereumProvider from "@metamask/detect-provider";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import optimismImg from "../public/optimism.png";
import ethereumImg from "../public/ethereumlogo.png";
import bscImg from "../public/bsc.png";
import polygonImg from "../public/polygonwhite.png";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

const droptheme = createTheme({
  type: "dark",
  theme: {
    fontFamily: "SF Pro Display",
    colors: {
      primaryLight: "#00000020",
      primaryLightHover: "#00000020",
      primaryLightActive: "#00000020",
      primaryLightContrast: "#00000020",
      primary: "#1F51FF40",
      primaryBorder: "#00000020",
      primaryBorderHover: "#00000020",
      primarySolidHover: "#00000010",
      primarySolidContrast: "$white",
      primaryShadow: "$white500",
      transparent: "#00000000",
      dropdownItemHoverTextColor: "#00000000",
      link: "#5E1DAD",

      myColor: "#00000000",
    },
    space: {},
    fonts: {},
  },
});

export default function Home() {
  const [id, getId] = useState(0);
  const [customPay, useToken] = React.useState(true);
  const [nfts, setNfts] = useState([]);
  const [nftStatus, setNftStatus] = useState(false);
  const [sourceNft, getSourceNft] = useState([]);
  const [sourceRpc, getSourceRpc] = useState([]);
  const [confirmLink, getConfirmLink] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };
  const [sourceCustody, getSourceCustody] = useState([]);
  const [erc20Contract, getErc20] = useState([]);
  const [selected, setSelected] = React.useState(new Set(["Set Destination"]));
  const destChain = React.useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );

  const getNftTokenId = (tokeId) => {
    const idName = `singleNftBoxId_${tokeId}`;
    const nftCard = document.getElementById(idName);
    nftCard.classList.add("active");
    getId(tokeId);
  };

  const [isLoading, setIsLoading] = useState(false);

  const blockImage = React.useMemo((resolve, reject) => {
    var eth = "Ethereum";
    var bsc = "Binance Smart Chain";
    var pol = "Polygon";
    var opt = "Optimism";
    if (destChain == eth) {
      return <img src="ethereumlogo.png" width={"160px"} alt="eth" />;
    } else if (destChain == bsc) {
      return <img src="bsc.png" width={"160px"} alt="bsc" />;
    } else if (destChain == pol) {
      return <img src="polygonwhite.png" width={"160px"} />;
    } else if (destChain == opt) {
      return <img src="optimism.png" width={"160px"} />;
    }
  });

  const destImg = React.useMemo((resolve, reject) => {
    var eth = "Ethereum";
    var bsc = "Binance Smart Chain";
    var pol = "Polygon";
    var opt = "Optimism";
    if (destChain == eth) {
      return (
        <div>
          <img src="ethereumlogo.png" width={"190px"} />
        </div>
      );
    } else if (destChain == bsc) {
      return (
        <div>
          <img src="bsc.png" width={"190px"} />
        </div>
      );
    } else if (destChain == pol) {
      return (
        <div>
          <img src="polygonwhite.png" width={"190px"} />
        </div>
      );
    } else if (destChain == opt) {
      return (
        <div>
          <img src="optimism.png" width={"190px"} />
        </div>
      );
    }
  });

  const sourceImg = React.useMemo((resolve, reject) => {
    if (sourceRpc == goerpc) {
      return (
        <div>
          <img
            src="ethereumlogo.png"
            width={"220px"}
            style={{ marginTop: "3px" }}
          />
        </div>
      );
    } else if (sourceRpc == mumrpc) {
      return (
        <div>
          <img src="polygonwhite.png" width={"210px"} />
        </div>
      );
    } else if (sourceRpc == bsctrpc) {
      return (
        <div>
          <img src="bsc.png" width={"210px"} />
        </div>
      );
    } else if (sourceRpc == opGoerpc) {
      return (
        <div>
          <img src="optimism.png" width={"210px"} />
        </div>
      );
    }
  });

  var account = null;
  var web3 = null;

  async function setSource() {
    setIsLoading(true);
    setNftStatus(false);
    const web3Modal = new Web3Modal();
    var providera = await web3Modal.connect();
    web3 = new Web3(providera);
    await providera.send("eth_requestAccounts");
    var accounts = await web3.eth.getAccounts();
    account = accounts[0];
    var goe = "0x5";
    var mm = "0x13881";
    var bsct = "0x61";
    var opt = "0x1a4";
    const connected = await detectEthereumProvider();
    if (connected.chainId == goe) {
      var sNft = goeNFT;
      var sCustody = goeCustody;
      var sRpc = goerpc;
      var erc20 = goeErc20;
    } else if (connected.chainId == mm) {
      var sNft = mumNFT;
      var sCustody = mumCustody;
      var sRpc = mumrpc;
      var erc20 = mumErc20;
    } else if (connected.chainId == bsct) {
      var sNft = bsctNFT;
      var sCustody = bsctCustody;
      var sRpc = bsctrpc;
      var erc20 = bsctErc20;
    } else if (connected.chainId == opt) {
      var sNft = opGoeNFT;
      var sCustody = opGoeCustody;
      var sRpc = opGoerpc;
      var erc20 = opGoeErc20;
    }
    const provider = new ethers.providers.JsonRpcProvider(sRpc);
    const key = ethraw;
    const wallet = new ethers.Wallet(key, provider);
    const contract = new ethers.Contract(sNft, NftABI, wallet);
    const itemArray = [];
    await contract.walletOfOwner(account).then((value) => {
      value.forEach(async (id) => {
        let token = parseInt(id, 16);
        const rawUri = contract.tokenURI(token);
        const Uri = Promise.resolve(rawUri);
        const getUri = Uri.then((value) => {
          let str = value;
          let cleanUri = str.replace("ipfs://", "https://ipfs.io/ipfs/");
          let metadata = axios.get(cleanUri).catch(function (error) {
            console.log(error.toJSON());
          });
          return metadata;
        });
        getUri.then((value) => {
          let rawImg = value.data.image;
          var name = value.data.name;
          var desc = value.data.description;
          let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
          let meta = {
            name: name,
            img: image,
            tokenId: token,
            wallet: account,
            desc,
          };
          itemArray.push(meta);
        });
      });
    });
    await new Promise((r) => setTimeout(r, 2000));
    console.log("Wallet Refreshed : " + sRpc);
    getSourceNft(sNft);
    getErc20(erc20);
    getSourceCustody(sCustody);
    getSourceRpc(sRpc);
    setNfts(itemArray);
    setIsLoading(false);
    if (itemArray.length === 0) {
      setNftStatus(true);
    } else {
      setNftStatus(false);
    }
  }

  async function initTransfer() {
    var bsc = "Binance Smart Chain";
    var poly = "Polygon";
    var eth = "Ethereum";
    var opt = "Optimism";
    if (bsc == destChain) {
      var dCustody = bsctCustody;
      var dRpc = bsctrpc;
      var explorer = "https://testnet.bscscan.com/tx/";
      var dNFT = bsctNFT;
    } else if (poly == destChain) {
      var dCustody = mumCustody;
      var dRpc = mumrpc;
      var explorer = "https://mumbai.polygonscan.com/tx/";
      var dNFT = mumNFT;
    } else if (eth == destChain) {
      var dCustody = goeCustody;
      var dRpc = goerpc;
      var explorer = "https://goerli.etherscan.io/tx/";
      var dNFT = goeNFT;
    } else if (opt == destChain) {
      var dCustody = opGoeCustody;
      var dRpc = opGoerpc;
      var explorer = "https://goerli-optimism.etherscan.io/tx/";
      var dNFT = opGoeNFT;
    }
    const tokenId = id;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const userWallet = await signer.getAddress();
    const ethprovider = new ethers.providers.JsonRpcProvider(dRpc);
    const ethKey = ethraw;
    var wallet = new ethers.Wallet(ethKey, ethprovider);
    const sNFTCol = new ethers.Contract(sourceNft, NftABI, signer);
    const tokenContract = new ethers.Contract(erc20Contract, Erc20ABI, signer);
    const ethNFTCustody = new ethers.Contract(dCustody, CustodyABI, wallet);
    const dNFTCont = new ethers.Contract(dNFT, BridgeABI, wallet);
    handler();
    await new Promise((r) => setTimeout(r, 1000));
    let init = "Initializing Transfer...";
    document.getElementById("displayconfirm1").innerHTML = init;
    let confirmHolder = await sNFTCol.ownerOf(tokenId);
    let bridgeHolder = await dNFTCont.ownerOf(tokenId).catch(async (error) => {
      console.log("Bridge NFT not present, Standby...");
      console.log("Bridge NFT Mint at Destination Processing");
    });
    await dNFTCont.ownerOf(tokenId).catch(async (error) => {
      if (error) {
        const rawTxn = await dNFTCont.populateTransaction.bridgeMint(
          bridgeWallet,
          tokenId
        );
        let signedTxn = await wallet.sendTransaction(rawTxn);
        await signedTxn.wait();
        console.log("Bridge NFT Minted at Destination!");
        const nftBridgeApprove = await dNFTCont.approve(dCustody, tokenId);
        await nftBridgeApprove.wait();
        console.log("Transferring NFT to Destination Bridge Custody");
        let gas = { gasLimit: 3000000 };
        const retaindNFT = await ethNFTCustody.retainNew(tokenId, gas);
        await retaindNFT.wait();
        console.log("NFT Successfully Transferred to Destination Custody!");
        var hash = signedTxn.hash;
        console.log("Confirmation TX: " + hash);
        console.log("Verifications completed!, Starting Bridge Transfer...");
      } else if (bridgeHolder == bridgeWallet) {
        console.log("Confirming Bridge NFT at Destination Custody...");
        const nftBridgeApprove = await dNFTCont.approve(dCustody, tokenId);
        const approveConfirm = await nftBridgeApprove.wait();
        console.log(approveConfirm);
        let gas = { gasLimit: 3000000 };
        const retaindNFT = await ethNFTCustody.retainNew(tokenId, gas);
        await retaindNFT.wait();
        console.log("NFT Successfully Transferred to Destination Custody!");
        console.log("Verifications completed!, Starting Bridge Transfer...");
      } else {
        console.log("Error submitting transaction");
      }
    });
    if (confirmHolder == userWallet) {
      let getHolder = await ethNFTCustody.holdCustody(tokenId);
      let unListed = "0x0000000000000000000000000000000000000000";
      if (confirmHolder == getHolder.holder) {
        console.log("User Confirmed, No Updates Needed");
      } else if (getHolder.holder == unListed) {
        console.log("User Confirmed, No Updates Needed");
      } else {
        let updOwner = await ethNFTCustody.updateOwner(tokenId, userWallet);
        let receipt = await updOwner.wait();
        if (receipt) {
          console.log("Holder Address Updated to: " + userWallet);
        } else {
          console.log("Error submitting transaction");
        }
      }
    }
    let status1 = "Verifying Details...";
    document.getElementById("displayconfirm1").innerHTML = status1;
    await new Promise((r) => setTimeout(r, 4000));
    let status2 = "Verified, Bridge Initialized...";
    document.getElementById("displayconfirm1").innerHTML = status2;
    await new Promise((r) => setTimeout(r, 4000));
    let status3 = "Please Approve NFT Transfer to Bridge.";
    document.getElementById("displayconfirm1").innerHTML = status3;
    const sNFTCustody = new ethers.Contract(sourceCustody, CustodyABI, signer);
    const tx1 = await sNFTCol.setApprovalForAll(sourceCustody, true);
    await tx1.wait();
    console.log("Approval to Transfer NFT Received from User!");
    let status4 = "Approval Received! Processing...";
    document.getElementById("displayconfirm1").innerHTML = status4;
    await new Promise((r) => setTimeout(r, 4000));
    let status5 = "Please Execute NFT Transfer to Bridge.";
    if (customPay == true) {
      const cost = await sNFTCustody.costCustom();
      let options = { gasLimit: 3000000 };
      document.getElementById("displayconfirm1").innerHTML = status5;
      const tx2 = await tokenContract.approve(sourceCustody, cost);
      await tx2.wait();
      console.log("Approval to Transfer TX Fee Payment Received!");
      const tx3 = await sNFTCustody.retainNFTC(tokenId, options);
      await tx3.wait();
    } else {
      const costNative = await sNFTCustody.costNative();
      let options = { gasLimit: 3000000, value: costNative };
      document.getElementById("displayconfirm1").innerHTML = status5;
      const tx3 = await sNFTCustody.retainNFTN(tokenId, options);
      await tx3.wait();
    }
    let status6 = "NFT has been transferred to Bridge!!";
    let status7 = "In Transit to destination...";
    document.getElementById("displayconfirm1").innerHTML = status6;
    document.getElementById("displayconfirm4").innerHTML = status7;
    await new Promise((r) => setTimeout(r, 4000));
    console.log("Transferring to Destination Via: " + dRpc);
    let gas = { gasLimit: 3000000 };
    let rawTxn = await ethNFTCustody.populateTransaction.releaseNFT(
      tokenId,
      userWallet,
      gas
    );
    let signedTxn = await wallet.sendTransaction(rawTxn);
    let receipt = await signedTxn.wait();
    if (receipt) {
      var confirmOut6 = "";
      var confirmOut1 = "Transfer has been completed!";
      var confirmOut2 = "Click for more info: ";
      var confirmOut4 = explorer + signedTxn.hash;
      var confirmOut5 = "Transaction Info";
      await new Promise((r) => setTimeout(r, 4000));
      document.getElementById("displayconfirm1").innerHTML = confirmOut1;
      document.getElementById("displayconfirm2").innerHTML = confirmOut2;
      document.getElementById("displayconfirm3").innerHTML = confirmOut5;
      document.getElementById("displayconfirm4").innerHTML = confirmOut6;
    } else {
      console.log("Error submitting transaction");
    }
    getConfirmLink(confirmOut4);
    setSource();
  }

  return (
    <div>
      {/* <Circles /> */}
      <Container lg="true">
        <div className="mainBridge">
          <div className="cardWrapper">
            <div className="bridgeCard">
              <div className="bridgeNetworks">
                <div className="singleBridgeCard">
                  <div className="cardTitle">
                    <h2>
                      <span className="cardTitleBefore active">1</span>
                      Transfer From
                    </h2>
                    <p>Select the network you want to sent from.</p>
                  </div>

                  <div className="singleBridgeFilds">
                    <span className="fildName">Sender Blockchain</span>
                    <Sourcebridge />
                  </div>
                </div>

                <div className="swapBtn">
                  <SwapHorizIcon />
                </div>

                <div className="singleBridgeCard">
                  <div className="cardTitle">
                    <h2>
                      <span className="cardTitleBefore">2</span>
                      Select Receiver Blockchain
                    </h2>
                    <p>Select the network you want to Received Nft.</p>
                  </div>

                  <div className="singleBridgeFilds">
                    <span className="fildName">Receiver Blockchain</span>
                    <Dropdown>
                      <Dropdown.Button
                        bordered
                        flat
                        css={{
                          borderColor: "#ffffff50",
                          borderWidth: "0.8px",
                          color: "White",
                          width: "100%",
                          minHeight: "45px",
                          borderRadius: "5px",
                        }}
                      >
                        {blockImage}
                      </Dropdown.Button>
                      <Dropdown.Menu
                        css={{
                          opacity: "100%",
                          alignContent: "center",
                          width: "600px",
                          display: "grid",
                          backgroundColor: "#00000010",
                        }}
                        aria-label="Single selection actions"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selected}
                        onSelectionChange={setSelected}
                      >
                        <Dropdown.Item key="Ethereum">
                          <img
                            src="ethereumlogo.png"
                            style={{ alignContent: "center" }}
                            width={"130px"}
                          />
                        </Dropdown.Item>
                        {/* <Dropdown.Item key="Binance Smart Chain">
                          <img src="bsc.png" width={"130px"} />
                        </Dropdown.Item> */}
                        <Dropdown.Item key="Polygon">
                          <img src="polygonwhite.png" width={"130px"} />
                        </Dropdown.Item>
                        <Dropdown.Item key="Optimism">
                          <img src="optimism.png" width={"130px"} />
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="singleBridgeCard">
                <div className="retriveButton">
                  <Button variant="contained" onPress={setSource}>
                    Retrieve Assets
                  </Button>
                </div>
              </div>

              <div className="singleBridgeCard">
                <div className="cardTitle">
                  <h2>
                    <span className="cardTitleBefore">3</span>
                    NFT to Transfer
                  </h2>
                  <p>Select the NFT you want to sent.</p>
                </div>
                <div className="2ndWrapper">
                  <div id="noNftFound">{nftStatus ? "Nft Not Found" : ""}</div>
                  <div className="nftGrid">
                    {isLoading ? (
                      <div className="lodear-center">
                        <div class="dots-bars-4"></div>
                      </div>
                    ) : (
                      nfts.map((nft, i) => {
                        console.log(nft);
                        return (
                          <div
                            className="singleNftBox"
                            id={`singleNftBoxId_${nft.tokenId}`}
                            key={i}
                            onClick={() => getNftTokenId(nft.tokenId)}
                          >
                            <div className="nftImage">
                              <Card.Image src={nft.img} />
                            </div>
                            <div className="nftBoxContent" key={i}>
                              <h3>In Wallet</h3>
                              <h4>{nft.name}</h4>
                              <span>Token ID: {nft.tokenId}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="singleBridgeCard">
                <div className="cardTitle">
                  <h2>
                    <span className="cardTitleBefore">4</span>
                    Review Transfer Details
                  </h2>
                  <p>Please Review the bridge details and confirm</p>
                </div>
                <div className="reviewBridgeFilds">
                  <div className="sinBridgeFind">
                    <span>Bridge Source:</span>
                    {sourceImg}
                  </div>
                  <div className="bridgeArrow">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="sinBridgeFind">
                    <span>Bridge Destination:</span>
                    {destImg}
                  </div>
                </div>
                <div className="viewBridgeFilds">
                  <p>
                    NFT Token ID: <span>{id}</span>
                  </p>
                  <Checkbox
                    css={{ mt: "$10" }}
                    size="md"
                    color="success"
                    isSelected={customPay}
                    onChange={useToken}
                  >
                    Pay with THA
                  </Checkbox>
                </div>
                <div className="transferButton">
                  <Button variant="contained" onPress={initTransfer}>
                    Transfer
                  </Button>
                </div>
              </div>

              <Modal
                preventClose
                width="400px"
                closeButton
                animated={true}
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
                css={{
                  backgroundColor: "#000000",
                  boxShadow: "0px 0px 15px #ffffff80",
                  padding: "0",
                }}
              >
                <Image
                  css={{
                    position: "relative",
                    objectFit: "stretch",
                    width: "400px",
                    filter: "sepia(50)",
                  }}
                  alt="Card image background"
                  src="LoadingGIF.gif"
                />
                <Modal.Header
                  css={{ position: "absolute", zIndex: 1 }}
                ></Modal.Header>
                <Modal.Body
                  css={{
                    position: "absolute",
                    zIndex: 1,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Grid>
                    <Row>
                      <Col justify="center" align="center">
                        <Text
                          h4
                          css={{
                            fontFamily: "SF Pro Display",
                            fontWeight: "600",
                            textShadow: "0px 0px 4px #ffffff60",
                            marginTop: "$20",
                          }}
                          id="displayconfirm1"
                        ></Text>
                        <Text
                          h4
                          css={{
                            fontFamily: "SF Pro Display",
                            fontWeight: "200",
                          }}
                          id="displayconfirm4"
                        ></Text>
                        <Text
                          h5
                          css={{
                            fontFamily: "SF Pro Display",
                            fontWeight: "200",
                          }}
                          id="displayconfirm2"
                        ></Text>
                        <a
                          href={confirmLink}
                          target="_blank"
                          placeholder="Transaction Info"
                        >
                          <div
                            style={{
                              color: "#ffffff",
                              fontSize: "18px",
                              textDecoration: "underline",
                              fontFamily: "SF Pro Display",
                              fontWeight: "500",
                              textShadow: "0px 0px 2px #ffffff60",
                            }}
                            id="displayconfirm3"
                          ></div>
                        </a>
                      </Col>
                    </Row>
                    <Spacer></Spacer>
                    <Row>
                      <Col css={{ marginTop: "$10" }}>
                        <Button
                          css={{
                            fontSize: "$md",
                            color: "white",
                            margin: "auto",
                            marginBottom: "$10",
                          }}
                          size={"md"}
                          auto
                          flat
                          color="error"
                          onClick={closeHandler}
                        >
                          CLOSE
                        </Button>
                      </Col>
                    </Row>
                  </Grid>
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>

        {/* <Card
          data-aos="slide-left"
          data-aos-duration="2200"
          data-aos-offset="100"
          css={{
            $$cardColor: "#00000020",
            marginBottom: "$5",
            marginTop: "$70",
            boxShadow: "0px 2px 8px #ffffff50",
          }}
        >
          <Grid css={{ ml: "$10", mr: "$10", mb: "$10", mt: "$10" }}>
            <Button
              shadow
              auto
              color="secondary"
              css={{
                width: "100%",
                fontFamily: "SF Pro Display",
                fontWeight: "100",
                marginTop: "$10",
                fontSize: "20px",
              }}
              onPress={setSource}
            >
              Retrieve Assets
            </Button>
          </Grid>
        </Card> */}
        {/* <Card
          data-aos="slide-right"
          data-aos-duration="2200"
          data-aos-offset="100"
          css={{ $$cardColor: "#00000030", marginBottom: "$5" }}
        >
          <Text
            css={{
              color: "White",
              fontWeight: "200",
              marginLeft: "5px",
              fontSize: "18px",
              mt: "$5",
            }}
          >
            2. Select the NFT to Transfer
          </Text>
          <Grid.Container justify="flex-start" gap={2}>
            {isLoading ? (
              <div className="lodear-center">
                <div class="dots-bars-4"></div>
              </div>
            ) : (
              nfts.map((nft, i) => {
                return (
                  <Grid key={i}>
                    <a>
                      <Card
                        isHoverable
                        isPressable
                        id="btn"
                        key={i}
                        css={{ mw: "160px", marginRight: "$1" }}
                        variant="bordered"
                        onPress={() => getId(nft.tokenId)}
                      >
                        <Card.Image src={nft.img} />
                        <Card.Body sm="true" key={i}>
                          <h3
                            style={{
                              color: "#9D00FF",
                              fontFamily: "SF Pro Display",
                            }}
                          >
                            In Wallet
                          </h3>
                          <Text h5>
                            {nft.name} Token-{nft.tokenId}
                          </Text>
                          <Text>{nft.desc}</Text>
                        </Card.Body>
                      </Card>
                    </a>
                  </Grid>
                );
              })
            )}
          </Grid.Container>
        </Card> */}
        {/* <Card
          data-aos="flip-up"
          data-aos-duration="2200"
          data-aos-offset="100"
          css={{
            $$cardColor: "#00000030",
            marginBottom: "$5",
            boxShadow: "0px 2px 8px #ffffff50",
          }}
        >
          <Text
            css={{
              color: "White",
              fontWeight: "200",
              marginLeft: "5px",
              fontSize: "18px",
              mt: "$5",
            }}
          >
            3. Transfer To:
          </Text>
          <Grid css={{ ml: "$10", mr: "$10", mb: "$10" }}>
            <NextUIProvider theme={droptheme}>
              <Text css={{ mb: "$2" }} h4>
                Destination
              </Text>
              <Dropdown>
                <Dropdown.Button
                  bordered
                  flat
                  css={{
                    borderColor: "#ffffff50",
                    borderWidth: "0.8px",
                    color: "White",
                    width: "100%",
                    minHeight: "45px",
                    borderRadius: "5px",
                  }}
                >
                  {blockImage}
                </Dropdown.Button>
                <Dropdown.Menu
                  css={{
                    opacity: "100%",
                    alignContent: "center",
                    width: "600px",
                    display: "grid",
                    backgroundColor: "#00000010",
                  }}
                  aria-label="Single selection actions"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selected}
                  onSelectionChange={setSelected}
                >
                  <Dropdown.Item key="Ethereum">
                    <img
                      style={{ alignContent: "center" }}
                      src="ethereumlogo.png"
                      width={"130px"}
                    />
                  </Dropdown.Item>
                  <Dropdown.Item key="Binance Smart Chain">
                    <img src="bsc.png" width={"130px"} />
                  </Dropdown.Item>
                  <Dropdown.Item key="Polygon">
                    <img src="polygonwhite.png" width={"130px"} />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </NextUIProvider>
          </Grid>
        </Card> */}
        {/* <Card css={{ $$cardColor: "#00000042", marginBottom: "$5" }}>
          <Text
            css={{
              color: "White",
              fontWeight: "200",
              marginLeft: "5px",
              fontSize: "18px",
              mt: "$5",
            }}
          >
            4. Review Transfer Details and Confirm
          </Text>
          <Row>
            <Col css={{ marginLeft: "$15", marginTop: "$2" }}>{sourceImg}</Col>
            <Col css={{ marginLeft: "$15", marginTop: "$2" }}>{destImg}</Col>
          </Row>
          <Checkbox
            css={{ ml: "$10" }}
            size="md"
            color="success"
            isSelected={customPay}
            onChange={useToken}
          >
            Pay with
            <img className="ml-3" src="n2drsmall.png" width="100px" />
          </Checkbox>
          <Grid lg css={{ ml: "$10", mr: "$10", mb: "$10" }}>
            <Button
              shadow
              auto
              color="secondary"
              css={{
                width: "100%",
                fontFamily: "SF Pro Display",
                fontWeight: "100",
                marginTop: "$10",
                fontSize: "20px",
              }}
              onPress={initTransfer}
            >
              Transfer
            </Button>
          </Grid>
          <Modal
            preventClose
            width="400px"
            closeButton
            animated={true}
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
            noPadding
            css={{
              backgroundColor: "#000000",
              boxShadow: "0px 0px 15px #ffffff80",
            }}
          >
            <Image
              css={{
                position: "relative",
                objectFit: "stretch",
                width: "400px",
              }}
              alt="Card image background"
              src="black-swirl.gif"
            />
            <Modal.Header css={{ position: "absolute", zIndex: 1 }}>
              <img
                src="nftbridge2.png"
                style={{ maxWidth: "250px", opacity: "90%" }}
              />
            </Modal.Header>
            <Modal.Body
              css={{
                position: "absolute",
                zIndex: 1,
                marginTop: "$10",
                marginLeft: "$10",
              }}
            >
              <Grid>
                <Row>
                  <Col justify="center" align="center">
                    <Text
                      h4
                      css={{
                        fontFamily: "SF Pro Display",
                        fontWeight: "600",
                        textShadow: "0px 0px 4px #ffffff60",
                        marginTop: "$20",
                      }}
                      id="displayconfirm1"
                    ></Text>
                    <Text
                      h4
                      css={{ fontFamily: "SF Pro Display", fontWeight: "200" }}
                      id="displayconfirm4"
                    ></Text>
                    <Text
                      h5
                      css={{ fontFamily: "SF Pro Display", fontWeight: "200" }}
                      id="displayconfirm2"
                    ></Text>
                    <a
                      href={confirmLink}
                      target="_blank"
                      placeholder="Transaction Info"
                    >
                      <div
                        style={{
                          color: "#ffffff",
                          fontSize: "18px",
                          textDecoration: "underline",
                          fontFamily: "SF Pro Display",
                          fontWeight: "500",
                          textShadow: "0px 0px 2px #ffffff60",
                        }}
                        id="displayconfirm3"
                      ></div>
                    </a>
                  </Col>
                </Row>
                <Spacer></Spacer>
                <Row>
                  <Col css={{ marginTop: "$15" }}>
                    <Button
                      css={{ fontSize: "$md", color: "white" }}
                      size={"md"}
                      auto
                      flat
                      color="error"
                      onClick={closeHandler}
                    >
                      CLOSE
                    </Button>
                  </Col>
                </Row>
              </Grid>
            </Modal.Body>
          </Modal>
        </Card> */}
        <Spacer></Spacer>
      </Container>
    </div>
  );
}
