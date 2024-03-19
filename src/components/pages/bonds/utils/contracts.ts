import {useEffect, useState} from "react";
import ContractAPI from "@/modules/cloud-api/contract-api";
import {ContractCoreDetails, ContractQuery} from "@/modules/cloud-api/contract-type";
import {nop} from "@/modules/utils/function";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";

function useContracts(params: ContractQuery, intervalMs = UPDATE_INTERVAL) {

    const [isLoading, setLoading] = useState(false)
    const [contracts, setContracts] = useState<ContractCoreDetails[]>([])


    useEffect(() => {
        const updater = () => {
            ContractAPI.getContractsBasic(params)
                .then(result => {
                    if (result?.length) {
                        setContracts(result)
                        setLoading(false)
                    }
                }).catch(nop)
        }

        setLoading(true);
        updater()

        const interval = setInterval(updater, intervalMs)
        return () => clearInterval(interval);
    }, [intervalMs, params.chainId]); // todo params can be vulnerable


    return {
        isLoading,
        contracts
    }
}

export {
    useContracts
}
