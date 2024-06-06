import {useEffect, useState} from "react";
import {getChain} from "@/modules/utils/chain";
import {nop} from "@/modules/utils/function";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import {Erc20Controller} from "amet-utils";

function useTokenBalance(chainId: number | string, contractAddress: string, address: string, intervalMs = UPDATE_INTERVAL) {
    const [balance, setBalance] = useState("0")
    const [isLoading, setIsLoading] = useState(false);

    const chain = getChain(chainId);

    useEffect(() => {
        const updater = () => {
            if (chain) Erc20Controller.getTokenBalance(chain.id, contractAddress, address).then(value => {
                setIsLoading(false);
                setBalance(value)
            }).catch(nop)
        }

        setIsLoading(true)
        updater();
        const interval = setInterval(updater, intervalMs);
        return () => clearInterval(interval);
    }, [address, chain, contractAddress, intervalMs]);


    return {
        balance,
        isLoading
    }
}

export {
    useTokenBalance
}
