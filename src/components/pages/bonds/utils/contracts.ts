import {useEffect, useState} from "react";
import {ContractCoreDetails, ContractQuery} from "@/modules/api/contract-type";
import {nop} from "@/modules/utils/function";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import GraphqlAPI from "@/modules/api/graphql";

function useContracts(params: ContractQuery, intervalMs = UPDATE_INTERVAL) {

    const [isLoading, setIsLoading] = useState(false)
    const [contracts, setContracts] = useState<ContractCoreDetails[]>([])


    useEffect(() => {
        const updater = () => {
            GraphqlAPI.getContracts(params)
                .then(result => {
                    if (result?.length) {
                        setContracts(result)
                        setIsLoading(false)
                    }
                }).catch(nop)
        }

        setIsLoading(true);
        updater()

        const interval = setInterval(updater, intervalMs)
        return () => clearInterval(interval);
    }, [intervalMs, params.chainId, params.skip, params.limit, params]);


    return {
        isLoading,
        contracts
    }
}

export {
    useContracts
}
