import {useCallback, useEffect, useMemo, useState} from "react";
import {ContractCoreDetails, ContractQuery} from "@/modules/api/contract-type";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import GraphqlAPI from "@/modules/api/graphql";
import {arbitrum, base} from "wagmi/chains";
import {nop} from "@/modules/utils/function";

function useMixedContracts(intervalMs = UPDATE_INTERVAL) {

    type Handler = { isLoading: boolean, contracts: ContractCoreDetails[] }

    const baseHandler = useState<Handler>({
        isLoading: true,
        contracts: []
    });
    const arbHandler = useState<Handler>({
        isLoading: true,
        contracts: []
    });

    const updater = (params: ContractQuery, handler: [Handler, any]) => {
        const [value, setValue] = handler;


        GraphqlAPI.getContracts(params)
            .then(result => {
                if (result?.length) {
                    setValue({
                        ...value,
                        isLoading: false,
                    })

                    const existingContracts = value.contracts.map((item: ContractCoreDetails) => item.contractAddress);
                    const newContracts = result.filter(i => !existingContracts.includes(i.contractAddress))
                    if (newContracts.length) {
                        setValue({
                            isLoading: false,
                            contracts: [...value.contracts, ...newContracts]
                        });
                    }
                }
            })
            .catch(error => {
                console.error(`getContracts: ${params.chainId}: ${error.message}`);
            })
    }

    useEffect(() => {
        const params = {chainId: base.id};
        updater(params, baseHandler);
        const interval = setInterval(() => updater(params, baseHandler), intervalMs);
        return () => clearInterval(interval);
    }, [intervalMs]);


    useEffect(() => {
        const params = {chainId: arbitrum.id};
        updater(params, arbHandler);
        const interval = setInterval(() => updater(params, arbHandler), intervalMs);
        return () => clearInterval(interval);
    }, [intervalMs]);

    return {
        isLoading: baseHandler[0].isLoading || arbHandler[0].isLoading,
        contracts: [...baseHandler[0].contracts, ...arbHandler[0].contracts]
    }

}

function useContracts(params: ContractQuery, intervalMs = UPDATE_INTERVAL) {

    const [isLoading, setIsLoading] = useState(true);
    const [contracts, setContracts] = useState<ContractCoreDetails[]>([]);

    // Memoize the updater function to avoid creating a new function on each render
    const updater = useCallback(() => {
        GraphqlAPI.getContracts(params)
            .then(result => {
                if (result?.length) setContracts(result);
            })
            .catch(error => console.error(`getContracts: ${params.chainId}: ${error.message}`))
            .finally(() => setIsLoading(false))

    }, [params]);

    useEffect(() => {
        setIsLoading(true);
        setContracts([]);
        updater();
        const interval = setInterval(updater, intervalMs);
        return () => clearInterval(interval);
    }, [updater, intervalMs]);

    return {
        isLoading,
        contracts
    };
}

export {
    useMixedContracts,
    useContracts
}
