//@ts-nocheck

import React, { useState } from "react";
import { ethers } from "ethers";

// Hardcoded ABIs and Bytecodes
const CONTRACT_TEMPLATES = {
  ERC20: {
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "initialSupply",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "decimals",
            type: "uint8",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "allowance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256",
          },
        ],
        name: "ERC20InsufficientAllowance",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256",
          },
        ],
        name: "ERC20InsufficientBalance",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address",
          },
        ],
        name: "ERC20InvalidApprover",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
        ],
        name: "ERC20InvalidReceiver",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "ERC20InvalidSender",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
        ],
        name: "ERC20InvalidSpender",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
        ],
        name: "allowance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "transferFrom",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    bytecode:
      "608060405234801561000f575f80fd5b50604051611905380380611905833981810160405281019061003191906104d9565b838381600390816100429190610779565b5080600490816100529190610779565b50505061007c3382600a61006691906109a4565b8461007191906109ee565b61008560201b60201c565b50505050610b17565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036100f5575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016100ec9190610a6e565b60405180910390fd5b6101065f838361010a60201b60201c565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361015a578060025f82825461014e9190610a87565b92505081905550610228565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050818110156101e3578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016101da93929190610ac9565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361026f578060025f82825403925050819055506102b9565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516103169190610afe565b60405180910390a3505050565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6103828261033c565b810181811067ffffffffffffffff821117156103a1576103a061034c565b5b80604052505050565b5f6103b3610323565b90506103bf8282610379565b919050565b5f67ffffffffffffffff8211156103de576103dd61034c565b5b6103e78261033c565b9050602081019050919050565b8281835e5f83830152505050565b5f61041461040f846103c4565b6103aa565b9050828152602081018484840111156104305761042f610338565b5b61043b8482856103f4565b509392505050565b5f82601f83011261045757610456610334565b5b8151610467848260208601610402565b91505092915050565b5f819050919050565b61048281610470565b811461048c575f80fd5b50565b5f8151905061049d81610479565b92915050565b5f60ff82169050919050565b6104b8816104a3565b81146104c2575f80fd5b50565b5f815190506104d3816104af565b92915050565b5f805f80608085870312156104f1576104f061032c565b5b5f85015167ffffffffffffffff81111561050e5761050d610330565b5b61051a87828801610443565b945050602085015167ffffffffffffffff81111561053b5761053a610330565b5b61054787828801610443565b93505060406105588782880161048f565b9250506060610569878288016104c5565b91505092959194509250565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806105c357607f821691505b6020821081036105d6576105d561057f565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026106387fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826105fd565b61064286836105fd565b95508019841693508086168417925050509392505050565b5f819050919050565b5f61067d61067861067384610470565b61065a565b610470565b9050919050565b5f819050919050565b61069683610663565b6106aa6106a282610684565b848454610609565b825550505050565b5f90565b6106be6106b2565b6106c981848461068d565b505050565b5b818110156106ec576106e15f826106b6565b6001810190506106cf565b5050565b601f82111561073157610702816105dc565b61070b846105ee565b8101602085101561071a578190505b61072e610726856105ee565b8301826106ce565b50505b505050565b5f82821c905092915050565b5f6107515f1984600802610736565b1980831691505092915050565b5f6107698383610742565b9150826002028217905092915050565b61078282610575565b67ffffffffffffffff81111561079b5761079a61034c565b5b6107a582546105ac565b6107b08282856106f0565b5f60209050601f8311600181146107e1575f84156107cf578287015190505b6107d9858261075e565b865550610840565b601f1984166107ef866105dc565b5f5b82811015610816578489015182556001820191506020850194506020810190506107f1565b86831015610833578489015161082f601f891682610742565b8355505b6001600288020188555050505b505050505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f8160011c9050919050565b5f808291508390505b60018511156108ca578086048111156108a6576108a5610848565b5b60018516156108b55780820291505b80810290506108c385610875565b945061088a565b94509492505050565b5f826108e2576001905061099d565b816108ef575f905061099d565b8160018114610905576002811461090f5761093e565b600191505061099d565b60ff84111561092157610920610848565b5b8360020a91508482111561093857610937610848565b5b5061099d565b5060208310610133831016604e8410600b84101617156109735782820a90508381111561096e5761096d610848565b5b61099d565b6109808484846001610881565b9250905081840481111561099757610996610848565b5b81810290505b9392505050565b5f6109ae82610470565b91506109b9836104a3565b92506109e67fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff84846108d3565b905092915050565b5f6109f882610470565b9150610a0383610470565b9250828202610a1181610470565b91508282048414831517610a2857610a27610848565b5b5092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610a5882610a2f565b9050919050565b610a6881610a4e565b82525050565b5f602082019050610a815f830184610a5f565b92915050565b5f610a9182610470565b9150610a9c83610470565b9250828201905080821115610ab457610ab3610848565b5b92915050565b610ac381610470565b82525050565b5f606082019050610adc5f830186610a5f565b610ae96020830185610aba565b610af66040830184610aba565b949350505050565b5f602082019050610b115f830184610aba565b92915050565b610de180610b245f395ff3fe608060405234801561000f575f80fd5b5060043610610091575f3560e01c8063313ce56711610064578063313ce5671461013157806370a082311461014f57806395d89b411461017f578063a9059cbb1461019d578063dd62ed3e146101cd57610091565b806306fdde0314610095578063095ea7b3146100b357806318160ddd146100e357806323b872dd14610101575b5f80fd5b61009d6101fd565b6040516100aa9190610a5a565b60405180910390f35b6100cd60048036038101906100c89190610b0b565b61028d565b6040516100da9190610b63565b60405180910390f35b6100eb6102af565b6040516100f89190610b8b565b60405180910390f35b61011b60048036038101906101169190610ba4565b6102b8565b6040516101289190610b63565b60405180910390f35b6101396102e6565b6040516101469190610c0f565b60405180910390f35b61016960048036038101906101649190610c28565b6102ee565b6040516101769190610b8b565b60405180910390f35b610187610333565b6040516101949190610a5a565b60405180910390f35b6101b760048036038101906101b29190610b0b565b6103c3565b6040516101c49190610b63565b60405180910390f35b6101e760048036038101906101e29190610c53565b6103e5565b6040516101f49190610b8b565b60405180910390f35b60606003805461020c90610cbe565b80601f016020809104026020016040519081016040528092919081815260200182805461023890610cbe565b80156102835780601f1061025a57610100808354040283529160200191610283565b820191905f5260205f20905b81548152906001019060200180831161026657829003601f168201915b5050505050905090565b5f80610297610467565b90506102a481858561046e565b600191505092915050565b5f600254905090565b5f806102c2610467565b90506102cf858285610480565b6102da858585610512565b60019150509392505050565b5f6012905090565b5f805f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b60606004805461034290610cbe565b80601f016020809104026020016040519081016040528092919081815260200182805461036e90610cbe565b80156103b95780601f10610390576101008083540402835291602001916103b9565b820191905f5260205f20905b81548152906001019060200180831161039c57829003601f168201915b5050505050905090565b5f806103cd610467565b90506103da818585610512565b600191505092915050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b5f33905090565b61047b8383836001610602565b505050565b5f61048b84846103e5565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461050c57818110156104fd578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016104f493929190610cfd565b60405180910390fd5b61050b84848484035f610602565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610582575f6040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016105799190610d32565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036105f2575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016105e99190610d32565b60405180910390fd5b6105fd8383836107d1565b505050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610672575f6040517fe602df050000000000000000000000000000000000000000000000000000000081526004016106699190610d32565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036106e2575f6040517f94280d620000000000000000000000000000000000000000000000000000000081526004016106d99190610d32565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f208190555080156107cb578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516107c29190610b8b565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610821578060025f8282546108159190610d78565b925050819055506108ef565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050818110156108aa578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016108a193929190610cfd565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610936578060025f8282540392505081905550610980565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516109dd9190610b8b565b60405180910390a3505050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f610a2c826109ea565b610a3681856109f4565b9350610a46818560208601610a04565b610a4f81610a12565b840191505092915050565b5f6020820190508181035f830152610a728184610a22565b905092915050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610aa782610a7e565b9050919050565b610ab781610a9d565b8114610ac1575f80fd5b50565b5f81359050610ad281610aae565b92915050565b5f819050919050565b610aea81610ad8565b8114610af4575f80fd5b50565b5f81359050610b0581610ae1565b92915050565b5f8060408385031215610b2157610b20610a7a565b5b5f610b2e85828601610ac4565b9250506020610b3f85828601610af7565b9150509250929050565b5f8115159050919050565b610b5d81610b49565b82525050565b5f602082019050610b765f830184610b54565b92915050565b610b8581610ad8565b82525050565b5f602082019050610b9e5f830184610b7c565b92915050565b5f805f60608486031215610bbb57610bba610a7a565b5b5f610bc886828701610ac4565b9350506020610bd986828701610ac4565b9250506040610bea86828701610af7565b9150509250925092565b5f60ff82169050919050565b610c0981610bf4565b82525050565b5f602082019050610c225f830184610c00565b92915050565b5f60208284031215610c3d57610c3c610a7a565b5b5f610c4a84828501610ac4565b91505092915050565b5f8060408385031215610c6957610c68610a7a565b5b5f610c7685828601610ac4565b9250506020610c8785828601610ac4565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680610cd557607f821691505b602082108103610ce857610ce7610c91565b5b50919050565b610cf781610a9d565b82525050565b5f606082019050610d105f830186610cee565b610d1d6020830185610b7c565b610d2a6040830184610b7c565b949350505050565b5f602082019050610d455f830184610cee565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610d8282610ad8565b9150610d8d83610ad8565b9250828201905080821115610da557610da4610d4b565b5b9291505056fea26469706673582212203553f885704a8a2b2446662df71565d10d60c9a521d695287130b5f39c86514764736f6c634300081a0033", // Replace with actual ERC20 bytecode
  },
  ERC721: {
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "address",
            name: "initialOwner",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "ERC721IncorrectOwner",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ERC721InsufficientApproval",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address",
          },
        ],
        name: "ERC721InvalidApprover",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "ERC721InvalidOperator",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "ERC721InvalidOwner",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
        ],
        name: "ERC721InvalidReceiver",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "ERC721InvalidSender",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ERC721NonexistentToken",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "OwnableInvalidOwner",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "getApproved",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ownerOf",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "tokenURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    bytecode:
      "608060405234801561000f575f80fd5b5060405161272038038061272083398181016040528101906100319190610347565b808383815f908161004291906105dc565b50806001908161005291906105dc565b5050505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100c5575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016100bc91906106ba565b60405180910390fd5b6100d4816100dd60201b60201c565b505050506106d3565b5f60065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160065f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6101ff826101b9565b810181811067ffffffffffffffff8211171561021e5761021d6101c9565b5b80604052505050565b5f6102306101a0565b905061023c82826101f6565b919050565b5f67ffffffffffffffff82111561025b5761025a6101c9565b5b610264826101b9565b9050602081019050919050565b8281835e5f83830152505050565b5f61029161028c84610241565b610227565b9050828152602081018484840111156102ad576102ac6101b5565b5b6102b8848285610271565b509392505050565b5f82601f8301126102d4576102d36101b1565b5b81516102e484826020860161027f565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610316826102ed565b9050919050565b6103268161030c565b8114610330575f80fd5b50565b5f815190506103418161031d565b92915050565b5f805f6060848603121561035e5761035d6101a9565b5b5f84015167ffffffffffffffff81111561037b5761037a6101ad565b5b610387868287016102c0565b935050602084015167ffffffffffffffff8111156103a8576103a76101ad565b5b6103b4868287016102c0565b92505060406103c586828701610333565b9150509250925092565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061041d57607f821691505b6020821081036104305761042f6103d9565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026104927fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610457565b61049c8683610457565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f6104e06104db6104d6846104b4565b6104bd565b6104b4565b9050919050565b5f819050919050565b6104f9836104c6565b61050d610505826104e7565b848454610463565b825550505050565b5f90565b610521610515565b61052c8184846104f0565b505050565b5b8181101561054f576105445f82610519565b600181019050610532565b5050565b601f8211156105945761056581610436565b61056e84610448565b8101602085101561057d578190505b61059161058985610448565b830182610531565b50505b505050565b5f82821c905092915050565b5f6105b45f1984600802610599565b1980831691505092915050565b5f6105cc83836105a5565b9150826002028217905092915050565b6105e5826103cf565b67ffffffffffffffff8111156105fe576105fd6101c9565b5b6106088254610406565b610613828285610553565b5f60209050601f831160018114610644575f8415610632578287015190505b61063c85826105c1565b8655506106a3565b601f19841661065286610436565b5f5b8281101561067957848901518255600182019150602085019450602081019050610654565b868310156106965784890151610692601f8916826105a5565b8355505b6001600288020188555050505b505050505050565b6106b48161030c565b82525050565b5f6020820190506106cd5f8301846106ab565b92915050565b612040806106e05f395ff3fe608060405234801561000f575f80fd5b5060043610610109575f3560e01c806370a08231116100a0578063a22cb4651161006f578063a22cb465146102a1578063b88d4fde146102bd578063c87b56dd146102d9578063e985e9c514610309578063f2fde38b1461033957610109565b806370a082311461022b578063715018a61461025b5780638da5cb5b1461026557806395d89b411461028357610109565b806323b872dd116100dc57806323b872dd146101a757806342842e0e146101c35780636352211e146101df5780636a6278421461020f57610109565b806301ffc9a71461010d57806306fdde031461013d578063081812fc1461015b578063095ea7b31461018b575b5f80fd5b61012760048036038101906101229190611877565b610355565b60405161013491906118bc565b60405180910390f35b610145610436565b6040516101529190611945565b60405180910390f35b61017560048036038101906101709190611998565b6104c5565b6040516101829190611a02565b60405180910390f35b6101a560048036038101906101a09190611a45565b6104e0565b005b6101c160048036038101906101bc9190611a83565b6104f6565b005b6101dd60048036038101906101d89190611a83565b6105f5565b005b6101f960048036038101906101f49190611998565b610614565b6040516102069190611a02565b60405180910390f35b61022960048036038101906102249190611ad3565b610625565b005b61024560048036038101906102409190611ad3565b610653565b6040516102529190611b0d565b60405180910390f35b610263610709565b005b61026d61071c565b60405161027a9190611a02565b60405180910390f35b61028b610744565b6040516102989190611945565b60405180910390f35b6102bb60048036038101906102b69190611b50565b6107d4565b005b6102d760048036038101906102d29190611cba565b6107ea565b005b6102f360048036038101906102ee9190611998565b61080f565b6040516103009190611945565b60405180910390f35b610323600480360381019061031e9190611d3a565b610875565b60405161033091906118bc565b60405180910390f35b610353600480360381019061034e9190611ad3565b610903565b005b5f7f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061041f57507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061042f575061042e82610987565b5b9050919050565b60605f805461044490611da5565b80601f016020809104026020016040519081016040528092919081815260200182805461047090611da5565b80156104bb5780601f10610492576101008083540402835291602001916104bb565b820191905f5260205f20905b81548152906001019060200180831161049e57829003601f168201915b5050505050905090565b5f6104cf826109f0565b506104d982610a76565b9050919050565b6104f282826104ed610aaf565b610ab6565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610566575f6040517f64a0ae9200000000000000000000000000000000000000000000000000000000815260040161055d9190611a02565b60405180910390fd5b5f6105798383610574610aaf565b610ac8565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146105ef578382826040517f64283d7b0000000000000000000000000000000000000000000000000000000081526004016105e693929190611dd5565b60405180910390fd5b50505050565b61060f83838360405180602001604052805f8152506107ea565b505050565b5f61061e826109f0565b9050919050565b61062d610cd3565b61063981600754610d5a565b60075f81548092919061064b90611e37565b919050555050565b5f8073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036106c4575f6040517f89c62b640000000000000000000000000000000000000000000000000000000081526004016106bb9190611a02565b60405180910390fd5b60035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b610711610cd3565b61071a5f610d77565b565b5f60065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606001805461075390611da5565b80601f016020809104026020016040519081016040528092919081815260200182805461077f90611da5565b80156107ca5780601f106107a1576101008083540402835291602001916107ca565b820191905f5260205f20905b8154815290600101906020018083116107ad57829003601f168201915b5050505050905090565b6107e66107df610aaf565b8383610e3a565b5050565b6107f58484846104f6565b610809610800610aaf565b85858585610fa3565b50505050565b606061081a826109f0565b505f61082461114f565b90505f8151116108425760405180602001604052805f81525061086d565b8061084c84611165565b60405160200161085d929190611eb8565b6040516020818303038152906040525b915050919050565b5f60055f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16905092915050565b61090b610cd3565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361097b575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016109729190611a02565b60405180910390fd5b61098481610d77565b50565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f806109fb8361122f565b90505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610a6d57826040517f7e273289000000000000000000000000000000000000000000000000000000008152600401610a649190611b0d565b60405180910390fd5b80915050919050565b5f60045f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b5f33905090565b610ac38383836001611268565b505050565b5f80610ad38461122f565b90505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614610b1457610b13818486611427565b5b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610b9f57610b535f855f80611268565b600160035f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825403925050819055505b5f73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614610c1e57600160035f8773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8460025f8681526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4809150509392505050565b610cdb610aaf565b73ffffffffffffffffffffffffffffffffffffffff16610cf961071c565b73ffffffffffffffffffffffffffffffffffffffff1614610d5857610d1c610aaf565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401610d4f9190611a02565b60405180910390fd5b565b610d73828260405180602001604052805f8152506114ea565b5050565b5f60065f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160065f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610eaa57816040517f5b08ba18000000000000000000000000000000000000000000000000000000008152600401610ea19190611a02565b60405180910390fd5b8060055f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610f9691906118bc565b60405180910390a3505050565b5f8373ffffffffffffffffffffffffffffffffffffffff163b1115611148578273ffffffffffffffffffffffffffffffffffffffff1663150b7a02868685856040518563ffffffff1660e01b81526004016110019493929190611f2d565b6020604051808303815f875af192505050801561103c57506040513d601f19601f820116820180604052508101906110399190611f8b565b60015b6110bd573d805f811461106a576040519150601f19603f3d011682016040523d82523d5f602084013e61106f565b606091505b505f8151036110b557836040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016110ac9190611a02565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161461114657836040517f64a0ae9200000000000000000000000000000000000000000000000000000000815260040161113d9190611a02565b60405180910390fd5b505b5050505050565b606060405180602001604052805f815250905090565b60605f60016111738461150d565b0190505f8167ffffffffffffffff81111561119157611190611b96565b5b6040519080825280601f01601f1916602001820160405280156111c35781602001600182028036833780820191505090505b5090505f82602001820190505b600115611224578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a858161121957611218611fb6565b5b0494505f85036111d0575b819350505050919050565b5f60025f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b80806112a057505f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b156113d2575f6112af846109f0565b90505f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561131957508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b801561132c575061132a8184610875565b155b1561136e57826040517fa9fbf51f0000000000000000000000000000000000000000000000000000000081526004016113659190611a02565b60405180910390fd5b81156113d057838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b8360045f8581526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b61143283838361165e565b6114e5575f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036114a657806040517f7e27328900000000000000000000000000000000000000000000000000000000815260040161149d9190611b0d565b60405180910390fd5b81816040517f177e802f0000000000000000000000000000000000000000000000000000000081526004016114dc929190611fe3565b60405180910390fd5b505050565b6114f4838361171e565b6115086114ff610aaf565b5f858585610fa3565b505050565b5f805f90507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611569577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000838161155f5761155e611fb6565b5b0492506040810190505b6d04ee2d6d415b85acef810000000083106115a6576d04ee2d6d415b85acef8100000000838161159c5761159b611fb6565b5b0492506020810190505b662386f26fc1000083106115d557662386f26fc1000083816115cb576115ca611fb6565b5b0492506010810190505b6305f5e10083106115fe576305f5e10083816115f4576115f3611fb6565b5b0492506008810190505b612710831061162357612710838161161957611618611fb6565b5b0492506004810190505b60648310611646576064838161163c5761163b611fb6565b5b0492506002810190505b600a8310611655576001810190505b80915050919050565b5f8073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561171557508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806116d657506116d58484610875565b5b8061171457508273ffffffffffffffffffffffffffffffffffffffff166116fc83610a76565b73ffffffffffffffffffffffffffffffffffffffff16145b5b90509392505050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361178e575f6040517f64a0ae920000000000000000000000000000000000000000000000000000000081526004016117859190611a02565b60405180910390fd5b5f61179a83835f610ac8565b90505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161461180c575f6040517f73c6ac6e0000000000000000000000000000000000000000000000000000000081526004016118039190611a02565b60405180910390fd5b505050565b5f604051905090565b5f80fd5b5f80fd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61185681611822565b8114611860575f80fd5b50565b5f813590506118718161184d565b92915050565b5f6020828403121561188c5761188b61181a565b5b5f61189984828501611863565b91505092915050565b5f8115159050919050565b6118b6816118a2565b82525050565b5f6020820190506118cf5f8301846118ad565b92915050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f611917826118d5565b61192181856118df565b93506119318185602086016118ef565b61193a816118fd565b840191505092915050565b5f6020820190508181035f83015261195d818461190d565b905092915050565b5f819050919050565b61197781611965565b8114611981575f80fd5b50565b5f813590506119928161196e565b92915050565b5f602082840312156119ad576119ac61181a565b5b5f6119ba84828501611984565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6119ec826119c3565b9050919050565b6119fc816119e2565b82525050565b5f602082019050611a155f8301846119f3565b92915050565b611a24816119e2565b8114611a2e575f80fd5b50565b5f81359050611a3f81611a1b565b92915050565b5f8060408385031215611a5b57611a5a61181a565b5b5f611a6885828601611a31565b9250506020611a7985828601611984565b9150509250929050565b5f805f60608486031215611a9a57611a9961181a565b5b5f611aa786828701611a31565b9350506020611ab886828701611a31565b9250506040611ac986828701611984565b9150509250925092565b5f60208284031215611ae857611ae761181a565b5b5f611af584828501611a31565b91505092915050565b611b0781611965565b82525050565b5f602082019050611b205f830184611afe565b92915050565b611b2f816118a2565b8114611b39575f80fd5b50565b5f81359050611b4a81611b26565b92915050565b5f8060408385031215611b6657611b6561181a565b5b5f611b7385828601611a31565b9250506020611b8485828601611b3c565b9150509250929050565b5f80fd5b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b611bcc826118fd565b810181811067ffffffffffffffff82111715611beb57611bea611b96565b5b80604052505050565b5f611bfd611811565b9050611c098282611bc3565b919050565b5f67ffffffffffffffff821115611c2857611c27611b96565b5b611c31826118fd565b9050602081019050919050565b828183375f83830152505050565b5f611c5e611c5984611c0e565b611bf4565b905082815260208101848484011115611c7a57611c79611b92565b5b611c85848285611c3e565b509392505050565b5f82601f830112611ca157611ca0611b8e565b5b8135611cb1848260208601611c4c565b91505092915050565b5f805f8060808587031215611cd257611cd161181a565b5b5f611cdf87828801611a31565b9450506020611cf087828801611a31565b9350506040611d0187828801611984565b925050606085013567ffffffffffffffff811115611d2257611d2161181e565b5b611d2e87828801611c8d565b91505092959194509250565b5f8060408385031215611d5057611d4f61181a565b5b5f611d5d85828601611a31565b9250506020611d6e85828601611a31565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680611dbc57607f821691505b602082108103611dcf57611dce611d78565b5b50919050565b5f606082019050611de85f8301866119f3565b611df56020830185611afe565b611e0260408301846119f3565b949350505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f611e4182611965565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611e7357611e72611e0a565b5b600182019050919050565b5f81905092915050565b5f611e92826118d5565b611e9c8185611e7e565b9350611eac8185602086016118ef565b80840191505092915050565b5f611ec38285611e88565b9150611ecf8284611e88565b91508190509392505050565b5f81519050919050565b5f82825260208201905092915050565b5f611eff82611edb565b611f098185611ee5565b9350611f198185602086016118ef565b611f22816118fd565b840191505092915050565b5f608082019050611f405f8301876119f3565b611f4d60208301866119f3565b611f5a6040830185611afe565b8181036060830152611f6c8184611ef5565b905095945050505050565b5f81519050611f858161184d565b92915050565b5f60208284031215611fa057611f9f61181a565b5b5f611fad84828501611f77565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601260045260245ffd5b5f604082019050611ff65f8301856119f3565b6120036020830184611afe565b939250505056fea2646970667358221220b79b5b6ac4dc8927fc4651654b0e23bfd1aeff3ab8d438e6c438a73282cc718164736f6c634300081a0033", // Replace with actual ERC721 bytecode
  },
  ERC1155: {
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "uri",
            type: "string",
          },
          {
            internalType: "address",
            name: "initialOwner",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "needed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ERC1155InsufficientBalance",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "approver",
            type: "address",
          },
        ],
        name: "ERC1155InvalidApprover",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "idsLength",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "valuesLength",
            type: "uint256",
          },
        ],
        name: "ERC1155InvalidArrayLength",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "ERC1155InvalidOperator",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
        ],
        name: "ERC1155InvalidReceiver",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "ERC1155InvalidSender",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "ERC1155MissingApprovalForAll",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "OwnableInvalidOwner",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeBatchTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]",
          },
        ],
        name: "TransferBatch",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "TransferSingle",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "value",
            type: "string",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "URI",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address[]",
            name: "accounts",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
        ],
        name: "balanceOfBatch",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "uri",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    bytecode:
      "608060405234801561000f575f80fd5b506040516128c23803806128c283398181016040528101906100319190610347565b8082610042816100ca60201b60201c565b505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100b3575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016100aa91906103b0565b60405180910390fd5b6100c2816100dd60201b60201c565b5050506106a5565b80600290816100d991906105d6565b5050565b5f60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160035f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6101ff826101b9565b810181811067ffffffffffffffff8211171561021e5761021d6101c9565b5b80604052505050565b5f6102306101a0565b905061023c82826101f6565b919050565b5f67ffffffffffffffff82111561025b5761025a6101c9565b5b610264826101b9565b9050602081019050919050565b8281835e5f83830152505050565b5f61029161028c84610241565b610227565b9050828152602081018484840111156102ad576102ac6101b5565b5b6102b8848285610271565b509392505050565b5f82601f8301126102d4576102d36101b1565b5b81516102e484826020860161027f565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610316826102ed565b9050919050565b6103268161030c565b8114610330575f80fd5b50565b5f815190506103418161031d565b92915050565b5f806040838503121561035d5761035c6101a9565b5b5f83015167ffffffffffffffff81111561037a576103796101ad565b5b610386858286016102c0565b925050602061039785828601610333565b9150509250929050565b6103aa8161030c565b82525050565b5f6020820190506103c35f8301846103a1565b92915050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061041757607f821691505b60208210810361042a576104296103d3565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f6008830261048c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610451565b6104968683610451565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f6104da6104d56104d0846104ae565b6104b7565b6104ae565b9050919050565b5f819050919050565b6104f3836104c0565b6105076104ff826104e1565b84845461045d565b825550505050565b5f90565b61051b61050f565b6105268184846104ea565b505050565b5b818110156105495761053e5f82610513565b60018101905061052c565b5050565b601f82111561058e5761055f81610430565b61056884610442565b81016020851015610577578190505b61058b61058385610442565b83018261052b565b50505b505050565b5f82821c905092915050565b5f6105ae5f1984600802610593565b1980831691505092915050565b5f6105c6838361059f565b9150826002028217905092915050565b6105df826103c9565b67ffffffffffffffff8111156105f8576105f76101c9565b5b6106028254610400565b61060d82828561054d565b5f60209050601f83116001811461063e575f841561062c578287015190505b61063685826105bb565b86555061069d565b601f19841661064c86610430565b5f5b828110156106735784890151825560018201915060208501945060208101905061064e565b86831015610690578489015161068c601f89168261059f565b8355505b6001600288020188555050505b505050505050565b612210806106b25f395ff3fe608060405234801561000f575f80fd5b50600436106100b1575f3560e01c8063731133e91161006f578063731133e91461019b5780638da5cb5b146101b7578063a22cb465146101d5578063e985e9c5146101f1578063f242432a14610221578063f2fde38b1461023d576100b1565b8062fdd58e146100b557806301ffc9a7146100e55780630e89341c146101155780632eb2c2d6146101455780634e1273f414610161578063715018a614610191575b5f80fd5b6100cf60048036038101906100ca9190611633565b610259565b6040516100dc9190611680565b60405180910390f35b6100ff60048036038101906100fa91906116ee565b6102ae565b60405161010c9190611733565b60405180910390f35b61012f600480360381019061012a919061174c565b61038f565b60405161013c91906117e7565b60405180910390f35b61015f600480360381019061015a91906119f7565b610421565b005b61017b60048036038101906101769190611b82565b6104c8565b6040516101889190611caf565b60405180910390f35b6101996105cf565b005b6101b560048036038101906101b09190611ccf565b6105e2565b005b6101bf6105fc565b6040516101cc9190611d5e565b60405180910390f35b6101ef60048036038101906101ea9190611da1565b610624565b005b61020b60048036038101906102069190611ddf565b61063a565b6040516102189190611733565b60405180910390f35b61023b60048036038101906102369190611e1d565b6106c8565b005b61025760048036038101906102529190611eb0565b61076f565b005b5f805f8381526020019081526020015f205f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b5f7fd9b67a26000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061037857507f0e89341c000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806103885750610387826107f3565b5b9050919050565b60606002805461039e90611f08565b80601f01602080910402602001604051908101604052809291908181526020018280546103ca90611f08565b80156104155780601f106103ec57610100808354040283529160200191610415565b820191905f5260205f20905b8154815290600101906020018083116103f857829003601f168201915b50505050509050919050565b5f61042a61085c565b90508073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff161415801561046f575061046d868261063a565b155b156104b35780866040517fe237d9220000000000000000000000000000000000000000000000000000000081526004016104aa929190611f38565b60405180910390fd5b6104c08686868686610863565b505050505050565b6060815183511461051457815183516040517f5b05999100000000000000000000000000000000000000000000000000000000815260040161050b929190611f5f565b60405180910390fd5b5f835167ffffffffffffffff8111156105305761052f61180b565b5b60405190808252806020026020018201604052801561055e5781602001602082028036833780820191505090505b5090505f5b84518110156105c45761059a610582828761095790919063ffffffff16565b610595838761096a90919063ffffffff16565b610259565b8282815181106105ad576105ac611f86565b5b602002602001018181525050806001019050610563565b508091505092915050565b6105d761097d565b6105e05f610a04565b565b6105ea61097d565b6105f684848484610ac7565b50505050565b5f60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b61063661062f61085c565b8383610b5c565b5050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16905092915050565b5f6106d161085c565b90508073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff16141580156107165750610714868261063a565b155b1561075a5780866040517fe237d922000000000000000000000000000000000000000000000000000000008152600401610751929190611f38565b60405180910390fd5b6107678686868686610cc5565b505050505050565b61077761097d565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036107e7575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016107de9190611d5e565b60405180910390fd5b6107f081610a04565b50565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b5f33905090565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16036108d3575f6040517f57f447ce0000000000000000000000000000000000000000000000000000000081526004016108ca9190611d5e565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1603610943575f6040517f01a8351400000000000000000000000000000000000000000000000000000000815260040161093a9190611d5e565b60405180910390fd5b6109508585858585610dcb565b5050505050565b5f60208202602084010151905092915050565b5f60208202602084010151905092915050565b61098561085c565b73ffffffffffffffffffffffffffffffffffffffff166109a36105fc565b73ffffffffffffffffffffffffffffffffffffffff1614610a02576109c661085c565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016109f99190611d5e565b60405180910390fd5b565b5f60035f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160035f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610b37575f6040517f57f447ce000000000000000000000000000000000000000000000000000000008152600401610b2e9190611d5e565b60405180910390fd5b5f80610b438585610e77565b91509150610b545f87848487610dcb565b505050505050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610bcc575f6040517fced3e100000000000000000000000000000000000000000000000000000000008152600401610bc39190611d5e565b60405180910390fd5b8060015f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610cb89190611733565b60405180910390a3505050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610d35575f6040517f57f447ce000000000000000000000000000000000000000000000000000000008152600401610d2c9190611d5e565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1603610da5575f6040517f01a83514000000000000000000000000000000000000000000000000000000008152600401610d9c9190611d5e565b60405180910390fd5b5f80610db18585610e77565b91509150610dc28787848487610dcb565b50505050505050565b610dd785858585610ea7565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614610e70575f610e1361085c565b90506001845103610e5f575f610e325f8661096a90919063ffffffff16565b90505f610e485f8661096a90919063ffffffff16565b9050610e58838989858589611237565b5050610e6e565b610e6d8187878787876113e6565b5b505b5050505050565b60608060405191506001825283602083015260408201905060018152826020820152604081016040529250929050565b8051825114610ef157815181516040517f5b059991000000000000000000000000000000000000000000000000000000008152600401610ee8929190611f5f565b60405180910390fd5b5f610efa61085c565b90505f5b83518110156110f6575f610f1b828661096a90919063ffffffff16565b90505f610f31838661096a90919063ffffffff16565b90505f73ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff1614611054575f805f8481526020019081526020015f205f8a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205490508181101561100057888183856040517f03dee4c5000000000000000000000000000000000000000000000000000000008152600401610ff79493929190611fb3565b60405180910390fd5b8181035f808581526020019081526020015f205f8b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff16146110e957805f808481526020019081526020015f205f8973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8282546110e19190612023565b925050819055505b5050806001019050610efe565b5060018351036111b1575f6111145f8561096a90919063ffffffff16565b90505f61112a5f8561096a90919063ffffffff16565b90508573ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6285856040516111a2929190611f5f565b60405180910390a45050611230565b8373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051611227929190612056565b60405180910390a45b5050505050565b5f8473ffffffffffffffffffffffffffffffffffffffff163b11156113de578373ffffffffffffffffffffffffffffffffffffffff1663f23a6e6187878686866040518663ffffffff1660e01b81526004016112979594939291906120dd565b6020604051808303815f875af19250505080156112d257506040513d601f19601f820116820180604052508101906112cf9190612149565b60015b611353573d805f8114611300576040519150601f19603f3d011682016040523d82523d5f602084013e611305565b606091505b505f81510361134b57846040517f57f447ce0000000000000000000000000000000000000000000000000000000081526004016113429190611d5e565b60405180910390fd5b805181602001fd5b63f23a6e6160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916146113dc57846040517f57f447ce0000000000000000000000000000000000000000000000000000000081526004016113d39190611d5e565b60405180910390fd5b505b505050505050565b5f8473ffffffffffffffffffffffffffffffffffffffff163b111561158d578373ffffffffffffffffffffffffffffffffffffffff1663bc197c8187878686866040518663ffffffff1660e01b8152600401611446959493929190612174565b6020604051808303815f875af192505050801561148157506040513d601f19601f8201168201806040525081019061147e9190612149565b60015b611502573d805f81146114af576040519150601f19603f3d011682016040523d82523d5f602084013e6114b4565b606091505b505f8151036114fa57846040517f57f447ce0000000000000000000000000000000000000000000000000000000081526004016114f19190611d5e565b60405180910390fd5b805181602001fd5b63bc197c8160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161461158b57846040517f57f447ce0000000000000000000000000000000000000000000000000000000081526004016115829190611d5e565b60405180910390fd5b505b505050505050565b5f604051905090565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6115cf826115a6565b9050919050565b6115df816115c5565b81146115e9575f80fd5b50565b5f813590506115fa816115d6565b92915050565b5f819050919050565b61161281611600565b811461161c575f80fd5b50565b5f8135905061162d81611609565b92915050565b5f80604083850312156116495761164861159e565b5b5f611656858286016115ec565b92505060206116678582860161161f565b9150509250929050565b61167a81611600565b82525050565b5f6020820190506116935f830184611671565b92915050565b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6116cd81611699565b81146116d7575f80fd5b50565b5f813590506116e8816116c4565b92915050565b5f602082840312156117035761170261159e565b5b5f611710848285016116da565b91505092915050565b5f8115159050919050565b61172d81611719565b82525050565b5f6020820190506117465f830184611724565b92915050565b5f602082840312156117615761176061159e565b5b5f61176e8482850161161f565b91505092915050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f6117b982611777565b6117c38185611781565b93506117d3818560208601611791565b6117dc8161179f565b840191505092915050565b5f6020820190508181035f8301526117ff81846117af565b905092915050565b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6118418261179f565b810181811067ffffffffffffffff821117156118605761185f61180b565b5b80604052505050565b5f611872611595565b905061187e8282611838565b919050565b5f67ffffffffffffffff82111561189d5761189c61180b565b5b602082029050602081019050919050565b5f80fd5b5f6118c46118bf84611883565b611869565b905080838252602082019050602084028301858111156118e7576118e66118ae565b5b835b8181101561191057806118fc888261161f565b8452602084019350506020810190506118e9565b5050509392505050565b5f82601f83011261192e5761192d611807565b5b813561193e8482602086016118b2565b91505092915050565b5f80fd5b5f67ffffffffffffffff8211156119655761196461180b565b5b61196e8261179f565b9050602081019050919050565b828183375f83830152505050565b5f61199b6119968461194b565b611869565b9050828152602081018484840111156119b7576119b6611947565b5b6119c284828561197b565b509392505050565b5f82601f8301126119de576119dd611807565b5b81356119ee848260208601611989565b91505092915050565b5f805f805f60a08688031215611a1057611a0f61159e565b5b5f611a1d888289016115ec565b9550506020611a2e888289016115ec565b945050604086013567ffffffffffffffff811115611a4f57611a4e6115a2565b5b611a5b8882890161191a565b935050606086013567ffffffffffffffff811115611a7c57611a7b6115a2565b5b611a888882890161191a565b925050608086013567ffffffffffffffff811115611aa957611aa86115a2565b5b611ab5888289016119ca565b9150509295509295909350565b5f67ffffffffffffffff821115611adc57611adb61180b565b5b602082029050602081019050919050565b5f611aff611afa84611ac2565b611869565b90508083825260208201905060208402830185811115611b2257611b216118ae565b5b835b81811015611b4b5780611b3788826115ec565b845260208401935050602081019050611b24565b5050509392505050565b5f82601f830112611b6957611b68611807565b5b8135611b79848260208601611aed565b91505092915050565b5f8060408385031215611b9857611b9761159e565b5b5f83013567ffffffffffffffff811115611bb557611bb46115a2565b5b611bc185828601611b55565b925050602083013567ffffffffffffffff811115611be257611be16115a2565b5b611bee8582860161191a565b9150509250929050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b611c2a81611600565b82525050565b5f611c3b8383611c21565b60208301905092915050565b5f602082019050919050565b5f611c5d82611bf8565b611c678185611c02565b9350611c7283611c12565b805f5b83811015611ca2578151611c898882611c30565b9750611c9483611c47565b925050600181019050611c75565b5085935050505092915050565b5f6020820190508181035f830152611cc78184611c53565b905092915050565b5f805f8060808587031215611ce757611ce661159e565b5b5f611cf4878288016115ec565b9450506020611d058782880161161f565b9350506040611d168782880161161f565b925050606085013567ffffffffffffffff811115611d3757611d366115a2565b5b611d43878288016119ca565b91505092959194509250565b611d58816115c5565b82525050565b5f602082019050611d715f830184611d4f565b92915050565b611d8081611719565b8114611d8a575f80fd5b50565b5f81359050611d9b81611d77565b92915050565b5f8060408385031215611db757611db661159e565b5b5f611dc4858286016115ec565b9250506020611dd585828601611d8d565b9150509250929050565b5f8060408385031215611df557611df461159e565b5b5f611e02858286016115ec565b9250506020611e13858286016115ec565b9150509250929050565b5f805f805f60a08688031215611e3657611e3561159e565b5b5f611e43888289016115ec565b9550506020611e54888289016115ec565b9450506040611e658882890161161f565b9350506060611e768882890161161f565b925050608086013567ffffffffffffffff811115611e9757611e966115a2565b5b611ea3888289016119ca565b9150509295509295909350565b5f60208284031215611ec557611ec461159e565b5b5f611ed2848285016115ec565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680611f1f57607f821691505b602082108103611f3257611f31611edb565b5b50919050565b5f604082019050611f4b5f830185611d4f565b611f586020830184611d4f565b9392505050565b5f604082019050611f725f830185611671565b611f7f6020830184611671565b9392505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b5f608082019050611fc65f830187611d4f565b611fd36020830186611671565b611fe06040830185611671565b611fed6060830184611671565b95945050505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61202d82611600565b915061203883611600565b92508282019050808211156120505761204f611ff6565b5b92915050565b5f6040820190508181035f83015261206e8185611c53565b905081810360208301526120828184611c53565b90509392505050565b5f81519050919050565b5f82825260208201905092915050565b5f6120af8261208b565b6120b98185612095565b93506120c9818560208601611791565b6120d28161179f565b840191505092915050565b5f60a0820190506120f05f830188611d4f565b6120fd6020830187611d4f565b61210a6040830186611671565b6121176060830185611671565b818103608083015261212981846120a5565b90509695505050505050565b5f81519050612143816116c4565b92915050565b5f6020828403121561215e5761215d61159e565b5b5f61216b84828501612135565b91505092915050565b5f60a0820190506121875f830188611d4f565b6121946020830187611d4f565b81810360408301526121a68186611c53565b905081810360608301526121ba8185611c53565b905081810360808301526121ce81846120a5565b9050969550505050505056fea2646970667358221220851af07ae40037fe048d62e5438dadb0e2145ad6acfcb27c7cff6780351f6ce464736f6c634300081a0033", // Replace with actual ERC1155 bytecode
  },
};

function ContractGenerator() {
  const [contractType, setContractType] = useState("ERC20");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [decimals, setDecimals] = useState("18");
  const [generatedContract, setGeneratedContract] = useState("");
  const [deployedAddress, setDeployedAddress] = useState("");

  const generateContract = () => {
    let contract = "";

    switch (contractType) {
      case "ERC20":
        contract = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ${name} is ERC20 {
    constructor(uint256 initialSupply) ERC20("${name}", "${symbol}") {
        _mint(msg.sender, initialSupply * 10**${decimals});
    }
}`;
        break;
      case "ERC721":
        contract = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${name} is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("${name}", "${symbol}") {}

    function mint(address to) public onlyOwner {
        _safeMint(to, _tokenIdCounter);
        _tokenIdCounter++;
    }
}`;
        break;
      case "ERC1155":
        contract = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${name} is ERC1155, Ownable {
    constructor() ERC1155("") {}

    function mint(address to, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        _mint(to, id, amount, data);
    }
}`;
        break;
      default:
        contract = "Unsupported contract type";
    }

    setGeneratedContract(contract);
  };

  const deployContract = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("signer", signer.address);

      const { abi, bytecode } = CONTRACT_TEMPLATES[contractType];
      const factory = new ethers.ContractFactory(abi, bytecode, signer);

      let contract;

      if (contractType === "ERC20") {
        // Convert initialSupply to the correct format using decimals
        // const parsedSupply = ethers.parseUnits(
        //   initialSupply,
        //   parseInt(decimals)
        // );
        contract = await factory.deploy(name, symbol, initialSupply);
      } else if (contractType === "ERC721") {
        contract = await factory.deploy(name, symbol, signer.address);
      } else if (contractType === "ERC1155") {
        contract = await factory.deploy();
      }

      await contract.waitForDeployment();
      const address = await contract.getAddress();
      setDeployedAddress(address);
      console.log("Contract deployed to:", address);
    } catch (error) {
      console.error("Error deploying contract:", error);
      alert(`Deployment failed: ${error.message}`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-900">
      <div className="flex gap-8">
        {/* Form Section */}
        <div className="w-1/2 space-y-6">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Create New Contract</h2>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  contractType === "ERC20" 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                }`}
                onClick={() => setContractType("ERC20")}
              >
                ERC20 Token
              </button>
              <button 
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  contractType === "ERC721"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                }`}
                onClick={() => setContractType("ERC721")}
              >
                ERC721 NFT
              </button>
              <button
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  contractType === "ERC1155"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                }`}
                onClick={() => setContractType("ERC1155")}
              >
                ERC1155 Multi-Token
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Contract Name</label>
                <input
                  className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
                  placeholder="Enter contract name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Token Symbol</label>
                <input
                  className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
                  placeholder="Enter token symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                />
              </div>

              {contractType === "ERC20" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Initial Supply</label>
                    <input
                      className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
                      placeholder="Enter initial supply"
                      value={initialSupply}
                      onChange={(e) => setInitialSupply(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Decimals</label>
                    <input
                      className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white"
                      placeholder="Enter decimals"
                      value={decimals}
                      onChange={(e) => setDecimals(e.target.value)}
                    />
                  </div>
                </>
              )}

              <button
                className="mt-6 w-full bg-purple-600 text-white p-4 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 focus:ring-4 focus:ring-purple-900 shadow-lg shadow-purple-900/50"
                onClick={generateContract}
              >
                Generate Contract
              </button>
            </div>
          </div>

          {deployedAddress && (
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Deployed Contract Address
              </h3>
              <div className="p-4 bg-gray-700 rounded-lg border border-gray-600 font-mono text-sm break-all text-gray-300">
                {deployedAddress}
              </div>
              <p className="mt-3 text-sm text-gray-400">
                Your contract has been successfully deployed to the blockchain network
              </p>
            </div>
          )}
        </div>

        {/* Generated Contract Section */}
        {generatedContract && (
          <div className="w-full bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Generated Contract Code
              </h3>
              <button
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors focus:ring-4 focus:ring-emerald-900"
                onClick={deployContract}
              >
                Deploy Contract
              </button>
            </div>
            <div className="relative">
              <textarea
                className="w-full h-[600px] p-4 border border-gray-600 rounded-lg font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-gray-300"
                value={generatedContract}
                readOnly
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContractGenerator;
