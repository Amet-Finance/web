import {CHAIN_INFO} from "@/modules/web3/constants";
import {TransactionConfig} from "web3-core";
import {isMobile} from "@/modules/utils/agent";
import {ConnectWallet} from "@/modules/web3/type";
import {URLS} from "@/modules/utils/urls";
import {toast} from "react-toastify";

function getProvider() {
    if (typeof window !== "undefined") {
        return (window as any).ethereum
    }
}

async function connectWalletAndSwitchChain(config: ConnectWallet): Promise<{ address: string, chainId: string }> {
    const ethereum = getProvider()

    const address = await connectWallet(config);
    const chainId = await switchChain(config)

    // ethereum.on('chainChanged', () => window.location.reload());
    // ethereum.on('accountsChanged', handler: (chainId: string) => void);
    // todo listen to address and chain changes and update accordingly

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
    const provider = getProvider();
    if (!provider) {
        if (isMobile() && requestAccounts) {
            location.replace(URLS.MetamaskDeeplink);
            return undefined;
        }

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
            toast.error("Metamask is not connected")
            return;
        }

        const txHash = await ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionConfig],
        });

        console.log(`txHash`, txHash)
        return txHash;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

async function getSignature(address: string) {
    const message = `Please sign this message to confirm your action on Amet Finance. Make sure to review the details before proceeding. Thank you for using Amet Finance!\n\nNonce: ${Date.now()}`;
    const ethereum = getProvider();


    const signature = await ethereum.request({
        method: "personal_sign",
        params: [message, address],
    });

    return {
        signature,
        message
    }
}

export {
    connectWalletAndSwitchChain,
    connectWallet,
    getChain,
    switchChain,
    submitTransaction,
    getSignature
}
