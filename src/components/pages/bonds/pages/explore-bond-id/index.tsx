import {useEffect, useState} from "react";
import {ContractExtendedFormat} from "@/modules/api/contract-type";
import {ExploreBondIdType} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {fetchContractExtended} from "@/components/pages/bonds/pages/explore-bond-id/utils";
import GeneralStatisticsContainer from "@/components/pages/bonds/pages/explore-bond-id/components/general-statistics";
import ActionsContainer from "@/components/pages/bonds/pages/explore-bond-id/components/actions/index";
import DescriptionContainer from "@/components/pages/bonds/pages/explore-bond-id/components/description";
import HeadlineContainer from "@/components/pages/bonds/pages/explore-bond-id/components/headline";
import StatisticsContainer from "@/components/pages/bonds/pages/explore-bond-id/components/statistics";
import MainDetailsContainer from "@/components/pages/bonds/pages/explore-bond-id/components/main-details";
import LoadingScreen from "@/components/pages/bonds/pages/explore-bond-id/components/loading-screen";
import {nop} from "@/modules/utils/function";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import FinishedComponent from "@/components/pages/bonds/pages/explore-bond-id/components/finished";
import {GeneralContainer} from "@/components/utils/container";
import {useFinancialAttributeExtended} from "@/modules/utils/token";
import Insights from "@/components/pages/bonds/pages/explore-bond-id/components/insights";

export default function ExploreBondId(params: Readonly<ExploreBondIdType>) {

    const {
        refreshDate,
        setUpdateIndex,
        isLoading,
        refreshLoader,
        bondDetailed,
        setBondDetailed
    } = useExtendedFetch(params);
    const refreshHandler = [refreshDate, setUpdateIndex];

    if (isLoading) return <LoadingScreen/>

    return (
        <GeneralContainer className='flex flex-col gap-4 w-full md:py-24 py-16' isPadding>
            <HeadlineContainer contractInfo={bondDetailed.contractInfo} refreshHandler={refreshHandler} refreshLoader={refreshLoader}/>
            <FinishedComponent contractInfo={bondDetailed.contractInfo}/>
            <StatisticsContainer contractInfo={bondDetailed.contractInfo}/>
            <div className='grid grid-cols-12 w-full gap-4 h-full'>
                <MainDetailsContainer bondDetailed={bondDetailed}/>
                <ActionsContainer contractInfo={bondDetailed.contractInfo}/>
            </div>
            <Insights bondDetailed={bondDetailed}/>
            <DescriptionContainer bondDetailed={bondDetailed} setBondDetailed={setBondDetailed}/>
            <GeneralStatisticsContainer bondDetailed={bondDetailed}/>
        </GeneralContainer>
    )
}

function useExtendedFetch({bondDetailedTmp, queryParams}: Readonly<ExploreBondIdType>) {
    const [bondDetailed, setBondDetailed] = useState<ContractExtendedFormat>({...(bondDetailedTmp || {})})
    const [updateIndex, setUpdateIndex] = useState(0);
    const [refreshDate, setRefreshDate] = useState<Date>();
    const [refreshLoader, setRefreshLoader] = useState(false);
    const [isLoading, setIsLoading] = useState(!bondDetailedTmp)

    const purchase = useFinancialAttributeExtended(bondDetailed?.contractInfo?.purchase || {});
    const payout = useFinancialAttributeExtended(bondDetailed?.contractInfo?.payout || {});

    useEffect(() => {
        const updater = () => {
            setRefreshLoader(true);
            fetchContractExtended(queryParams)
                .then(contract => {
                    setRefreshDate(new Date())

                    if (contract) {
                        setBondDetailed({...contract});
                        setIsLoading(false);
                    }
                })
                .catch(nop)
                .finally(() => setRefreshLoader(false))
        }


        updater();
        const interval = setInterval(updater, UPDATE_INTERVAL)
        return () => clearInterval(interval);
    }, [updateIndex, queryParams])

    return {
        bondDetailed: {
            contractDescription: bondDetailed.contractDescription,
            contractInfo: {
                ...bondDetailed.contractInfo,
                purchase,
                payout
            },
            actionLogs: bondDetailed.actionLogs,
            lastUpdated: bondDetailed.lastUpdated
        },
        setBondDetailed,
        refreshDate,
        refreshLoader,
        setUpdateIndex,
        isLoading,
    }
}
