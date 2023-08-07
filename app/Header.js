"use client";
import React, { useState } from "react";
import logo from "./favicon.ico";
import { usePathname } from "next/navigation";
import Link from "next/link";
import truncateEthAddress from "truncate-eth-address";
import Swal from "sweetalert2";
// import detectEthereumProvider from "@metamask/detect-provider"
import { formatBalance, formatChainAsNum } from "./utils";
import Image from "next/image";
import "./App.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SyncIcon from "@mui/icons-material/Sync";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import DataSaverOffOutlinedIcon from "@mui/icons-material/DataSaverOffOutlined";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli, polygonMumbai, optimismGoerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [goerli, polygonMumbai, optimismGoerli],
  [
    alchemyProvider({ apiKey: "KO-A-NeITdzNIMwhE4snnj3epbaeqCCp" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "TokenSwap",
  projectId: "201675b279d66737f3978db03768e72f",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const Header = () => {
  const location = usePathname();
  return (
    <>
      <header>
        <div className="header-wrapper">
          <div className="nav-logo">
            <div className="navlogo">
              <Link href="/">
                <Image src={logo} alt="logo" />
              </Link>
            </div>
            <ul>
              <li>
                <Link href="/">
                  {location === "/" ? (
                    <div className="nav-active">
                      <SyncIcon /> <span>Bridge</span>
                    </div>
                  ) : (
                    <div>Bridge</div>
                  )}
                </Link>
              </li>
              <li>
                <Link href="/mint">
                  {location === "/mint" ? (
                    <div className="nav-active">
                      <RocketLaunchIcon /> <span>Mint</span>
                    </div>
                  ) : (
                    <div>Mint</div>
                  )}
                </Link>
              </li>
              <li>
                <Link href="/launch">
                  {location === "/launch" ? (
                    <div className="nav-active">
                      <RocketLaunchIcon /> <span>Launch</span>
                    </div>
                  ) : (
                    <div>Launch</div>
                  )}
                </Link>
              </li>
              <li>
                <Link href="/portfolia">
                  {location === "/portfolia" ? (
                    <div className="nav-active">
                      <DataSaverOffOutlinedIcon /> <span>Portfolio</span>
                    </div>
                  ) : (
                    <div>Portfolio</div>
                  )}
                </Link>
              </li>
            </ul>
          </div>
          <div className="wallet-connect">
            <WagmiConfig config={wagmiConfig}>
              <RainbowKitProvider
                chains={chains}
                theme={darkTheme({
                  accentColor: "#1F51FF40",
                  accentColorForeground: "white",
                  overlayBlur: "small",
                })}
              >
                <ConnectButton label="Connect" />
              </RainbowKitProvider>
            </WagmiConfig>

            <button className="nav-three-dot">
              <MoreHorizIcon />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
