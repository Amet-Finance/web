import {CHAIN_INFO, DEFAULT_CHAIN_ID} from "@/modules/web3/constants";
import {TransactionConfig} from "web3-core";

function getProvider() {
    if (typeof window !== "undefined") {
        return (window as any).ethereum
    }
}

async function connectWallet() {
    const provider = getProvider();
    if (!provider) {
        return;
    }

    const addresses = await provider.request({
        method: "eth_requestAccounts"
    });

    await switchChain();

    return addresses?.[0]
}

function getWalletAddress() {
    const provider = getProvider();
    if (!provider) {
        return;
    }

    return provider.selectedAddress;
}

async function switchChain() {
    const ethereum = getProvider();

    if (!ethereum) {
        return;
    }

    try {
        if (ethereum.chainId === DEFAULT_CHAIN_ID) {
            return;
        }

        await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: DEFAULT_CHAIN_ID }],
        });
    } catch (switchError: any) {
        console.error(`switchError`, switchError)
        // info: This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902 || switchError.code === -32603) {
            try {
                await ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [CHAIN_INFO[DEFAULT_CHAIN_ID],
                    ],
                });
            } catch (addError: any) {
                console.error(`addError`, addError)
                throw Error(addError.message);
            }
        }
        throw Error(switchError.message);
    }
}

async function submitTransaction(transactionConfig: TransactionConfig) {
    try {
        const ethereum = getProvider();
        if (!ethereum) {
            return;
        }
        const address = await connectWallet();

        const transactionParameters = {
            to: transactionConfig.to,
            value: transactionConfig.value || "0",
            from: address,
            data: transactionConfig.data
        };

        console.log(`transactionParameters`, transactionParameters)

        const txHash = await ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });

        console.log(txHash)
        return txHash;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export {
    connectWallet,
    getWalletAddress,
    submitTransaction
}