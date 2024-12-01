import React from "react";
import WalletConnector from "./WalletConnector";
import ContractGenerator from "./ContractGenerator";

function App() {
  return (
    <div className="App">
      <h1>Token Contract Generator and Deployer</h1>
      <WalletConnector />
      <ContractGenerator />
    </div>
  );
}

export default App;
