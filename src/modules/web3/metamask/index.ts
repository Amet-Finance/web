import {CHAIN_INFO, DEFAULT_CHAIN_ID, WalletTypes} from "@/modules/web3/constants";
import {TransactionConfig} from "web3-core";
import {isMobile} from "@/modules/utils/agent";
import {ConnectWallet} from "@/modules/web3/type";
import {toast} from "react-toastify";
import provider from "react-redux/src/components/Provider";

function getProvider() {
    if (typeof window !== "undefined") {
        return (window as any).ethereum
    }
}

async function connectWalletAndSwitchChain(config: ConnectWallet): Promise<{ address: string, chainId: string }> {
    const address = await connectWallet(config);
    const chainId = await switchChain(config)

    if (!address) {
        throw Error('Wallet address is undefined')
    }

    if (!chainId) {
        throw Error('Chain was not switched')
    }

    return {
        address,
        chainId
    };
}

async function connectWallet({requestAccounts}: ConnectWallet): Promise<string | undefined> {
    const deeplink = 'https://metamask.app.link/dapp/amet.finance'
    if (isMobile()) {
        location.replace(deeplink);
        return undefined;
    }

    const provider = getProvider();
    if (!provider) {
        if (requestAccounts) {
            throw Error("Metamask was not found")
        }

        return;
    }

    const addresses = await provider.request({
        method: requestAccounts ? "eth_requestAccounts" : "eth_accounts"
    });

    return addresses?.[0]
}

function getChain() {
    const ethereum = getProvider()
    if (!ethereum) {
        return;
    }

    return ethereum.chainId;
}

async function switchChain({chainId, requestChain}: ConnectWallet): Promise<string | undefined> {

    const ethereum = getProvider();
    if (!ethereum) {
        return undefined;
    }

    try {
        if (getChain() === chainId) {
            return chainId;
        }

        if (requestChain) {
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{chainId: chainId}],
            });
            return chainId;
        }
    } catch (switchError: any) {

        // info: This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902 || switchError.code === -32603) {
            try {
                await ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [CHAIN_INFO[chainId]],
                });
            } catch (addError: any) {
                console.error(`addError`, addError)
                if (requestChain) throw Error(addError)
            }
        }
        console.error(switchError.message);
        if (requestChain) throw Error(switchError)
    }

    return getChain();
}

async function submitTransaction(transactionConfig: TransactionConfig) {
    try {
        const ethereum = getProvider();
        if (!ethereum) {
            return;
        }

        const {address} = await connectWalletAndSwitchChain({
            requestAccounts: true,
            requestChain: true,
            chainId: DEFAULT_CHAIN_ID
        })

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
    connectWalletAndSwitchChain,
    connectWallet,
    getChain,
    switchChain,
    submitTransaction
}