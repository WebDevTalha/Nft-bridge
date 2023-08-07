import React from "react";
import { bscTest, ethTest, polyTest, optiTest } from "../chainchange";
import { useEffect, useState } from "react";
import { Dropdown, Row, Text } from "@nextui-org/react";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { goeNFT, goeCustody, goerpc } from "../configuration";
import { opGoeNFT, opGoeCustody, opGoerpc } from "../configuration";
import { bsctNFT, bsctCustody, bsctrpc } from "../configuration";
import { mumNFT, mumCustody, mumrpc } from "../configuration";

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

export default function Sourcebridge() {
  const [sourceNft, getSourceNft] = useState([]);
  const [sourceCustody, getSourceCustody] = useState([]);
  const [selected, setSelected] = React.useState(new Set(["Set Network"]));
  const selectedValue = React.useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );

  const blockImage = React.useMemo((resolve, reject) => {
    var eth = "Ethereum";
    var bsc = "Binance Smart Chain";
    var pol = "Polygon";
    var opt = "Optimism";
    if (selectedValue == eth) {
      return <img src="ethereumlogo.png" width={"160px"} />;
    } else if (selectedValue == bsc) {
      return <img src="bsc.png" width={"160px"} />;
    } else if (selectedValue == pol) {
      return <img src="polygonwhite.png" width={"160px"} />;
    } else if (selectedValue == opt) {
      return <img src="optimism.png" width={"160px"} />;
    }
  });

  async function sourceChain() {
    var bsc = "Binance Smart Chain";
    var poly = "Polygon";
    var eth = "Ethereum";
    var mum = "Mumbai";
    var bsct = "Bsctest";
    var goe = "Goerli";
    var opt = "Optimism";
    if (bsc == selectedValue) {
      bscTest();
    } else if (poly == selectedValue) {
      polyTest();
    } else if (eth == selectedValue) {
      ethTest();
      var sNft = goeNFT;
      var sCustody = goeCustody;
    } else if (bsct == selectedValue) {
      bscTest();
    } else if (goe == selectedValue) {
      ethTest();
      var sNft = goeNFT;
      var sCustody = goeCustody;
    } else if (mum == selectedValue) {
      polyTest();
    } else if (opt == selectedValue) {
      optiTest();
      var sNft = opGoeNFT;
      var sCustody = opGoeCustody;
    }
    getSourceNft(sNft);
    getSourceCustody(sCustody);
    return { sourceNft };
  }

  useEffect(() => {
    sourceChain();
  }, [selected]);
  return (
    <NextUIProvider theme={droptheme}>
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
          <Dropdown.Item
            icon={<img src="ethereumlogo.png" width={"130px"} />}
            key="Ethereum"
          ></Dropdown.Item>
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
    </NextUIProvider>
  );
}
