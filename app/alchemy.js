import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { goerli, polygonMumbai, optimismGoerli } from "wagmi/chains";
import { configureChains, createConfig, WagmiConfig } from "wagmi";

export const alchemy = () => {
  alchemyProvider({ apiKey: "KO-A-NeITdzNIMwhE4snnj3epbaeqCCp" });
};

export const publicP = () => {
  publicProvider();
};

export const configCh = configureChains(
  [goerli, polygonMumbai, optimismGoerli],
  [alchemy, publicP]
);
