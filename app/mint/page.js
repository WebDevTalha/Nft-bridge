"use client";
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
import { bridgeWallet, ethraw } from "../../engine/configuration";
import {
  goeNFT,
  goeCustody,
  goeErc20,
  goerpc,
} from "../../engine/configuration";
import {
  opGoeErc20,
  opGoeCustody,
  opGoeNFT,
  opGoerpc,
} from "../../engine/configuration";
import {
  bsctNFT,
  bsctCustody,
  bsctErc20,
  bsctrpc,
} from "../../engine/configuration";
import {
  mumNFT,
  mumCustody,
  mumErc20,
  mumrpc,
} from "../../engine/configuration";
import "sf-font";
import "aos/dist/aos.css";
import BridgeABI from "../../engine/BridgeABI.json";
import CustodyABI from "../../engine/CustodyABI.json";
import NftABI from "../../engine/NftABI.json";
import Erc20ABI from "../../engine/Erc20ABI.json";
import Web3Modal from "web3modal";
import Web3 from "web3";
import axios from "axios";
import Sourcebridge from "../../engine/interfaces/Sourcebridge";
import Circles from "../../engine/circles";
import detectEthereumProvider from "@metamask/detect-provider";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import optimismImg from "../../public/optimism.png";
import ethereumImg from "../../public/ethereumlogo.png";
import bscImg from "../../public/bsc.png";
import polygonImg from "../../public/polygonwhite.png";
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

const page = () => {
  var goe = "0x5";
  var mm = "0x13881";
  var opt = "0x1a4";
  var talhaNftContractAddress = null;
  const nftTokenId = 525;
  async function handleMint() {
    if (window.ethereum) {
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (currentChainId === goe) {
        talhaNftContractAddress = goeNFT;
        var dRpc = goerpc;
      } else if (currentChainId === mm) {
        talhaNftContractAddress = mumNFT;
        var dRpc = mumrpc;
      } else if (currentChainId === opt) {
        talhaNftContractAddress = opGoeNFT;
        var dRpc = opGoerpc;
      }

      // return true if network id is the same
      if (talhaNftContractAddress === null) {
        window.alert("Network Not Supported");
      } else {
        const ethprovider = new ethers.providers.JsonRpcProvider(dRpc);
        const ethKey = ethraw;
        var wallet = new ethers.Wallet(ethKey, ethprovider);
        const contract = new ethers.Contract(
          talhaNftContractAddress,
          BridgeABI,
          wallet
        );
        try {
          const rawTxn = await contract.bridgeMint(bridgeWallet, nftTokenId);
          let signedTxn = await wallet.sendTransaction(rawTxn);
          await signedTxn.wait();
          console.log("Bridge NFT Minted at Destination!");
          console.log("response: ", rawTxn);
          console.log("response: ", signedTxn);

          function transactionConfirmedTimer() {
            const Toast = Swal.mixin({
              toast: true,
              position: "bottom-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "success",
              title: "NFT Mint Success",
            });
          }
        } catch (err) {
          if (err.code === "INSUFFICIENT_FUNDS") {
            // window.alert("insufficient balance")
            Swal.fire({
              icon: "error",
              title: "Insufficient Funds",
              text: "You can get some Sepolia Faucet from Here",
              confirmButtonText: "Get Faucet",
            }).then(() => {
              window.open("https://sepoliafaucet.com/", "_blank");
            });
            function isLoadingTimerrr() {
              return setIsLoading(false);
            }
            window.setTimeout(isLoadingTimerrr(), 5000);
          } else if (err.code === "ACTION_REJECTED") {
            // window.alert("Transaction Rejected")
            const Toast = Swal.mixin({
              toast: true,
              position: "bottom-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "warning",
              title: "Transaction Cancled",
            });
            function isLoadingTimerrr() {
              return setIsLoading(false);
            }
            window.setTimeout(isLoadingTimerrr(), 5000);
          }
          // console.log(err.code)
          // console.log("error: ", err)
        }
      }
    }
  }
  return (
    <>
      <div>
        {/* <Circles /> */}
        <Container lg="true">
          <div className="mainBridge">
            <div className="cardWrapper">
              <div className="bridgeCard">
                <div className="singleMintCard">
                  <div className="mintWrapper">
                    <div className="nftImage">
                      <img
                        src="https://ipfs.io/ipfs/QmZeZaXgoHPT6Bt5TybwUj9sDJP3pu6QZ1wjo8KgLFCA89/2.png"
                        alt="nft"
                      />
                    </div>
                    <div className="nftContent">
                      <div className="contentTitle">
                        <span>Talha ERC721 NFT</span>
                        <h2>
                          Public Mint is <span>Live</span>
                        </h2>
                        <div>
                          <p>Mint Start in: 01/08/2023 UTC: 12:00 pm</p>
                          <p>Mint End in: 01/04/2024 UTC: 12:00 pm</p>
                        </div>
                      </div>
                      <div className="mintSupply">
                        <h4>TOTAL NFT SUPPLY</h4>
                        <span>5555</span>
                      </div>
                      <div className="mintBtn">
                        <Button variant="contained" onClick={handleMint}>
                          Mint Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default page;
