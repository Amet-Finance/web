import {useEffect, useState} from "react";
import {getChain} from "@/modules/utils/wallet-connect";
import {nop} from "@/modules/utils/function";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import {Erc20Controller} from "amet-utils";

function useTokenBalance(chainId: number | string, contractAddress: string, address: string, intervalMs = UPDATE_INTERVAL) {
    const [balance, setBalance] = useState("0")

    const chain = getChain(chainId);

    useEffect(() => {
        const updater = () => {
            if (chain) Erc20Controller.getTokenBalance(chain.id, contractAddress, address).then(value => setBalance(value)).catch(nop)
        }

        updater();
        const interval = setInterval(updater, intervalMs);
        return () => clearInterval(interval);
    }, [address, chain, contractAddress, intervalMs]);


    return {
        balance
    }
}

export {
    useTokenBalance
}
