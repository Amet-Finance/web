import {useEffect, useState} from "react";
import {ContractExtendedFormatV2} from "@/modules/cloud-api/contract-type";
import {ExploreBondIdType} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {fetchContractExtended} from "@/components/pages/bonds/pages/explore-bond-id/utils";
import GeneralStatisticsContainer from "@/components/pages/bonds/pages/explore-bond-id/components/general-statistics";
import ActionsContainer from "@/components/pages/bonds/pages/explore-bond-id/components/actions";
import DescriptionContainer from "@/components/pages/bonds/pages/explore-bond-id/components/description";
import HeadlineContainer from "@/components/pages/bonds/pages/explore-bond-id/components/headline";
import StatisticsContainer from "@/components/pages/bonds/pages/explore-bond-id/components/statistics";
import MainDetailsContainer from "@/components/pages/bonds/pages/explore-bond-id/components/main-details";
import LoadingScreen from "@/components/pages/bonds/pages/explore-bond-id/components/loading-screen";
import {nop} from "@/modules/utils/function";

const UPDATE_INTERVAL = 25000;

export default function ExploreBondId({bondDetailedTmp, queryParams}: ExploreBondIdType) {

    const [bondDetailed, setBondDetailed] = useState<ContractExtendedFormatV2>({...(bondDetailedTmp || {})})
    const [updateIndex, setUpdateIndex] = useState(0);
    const [refreshDate, setRefreshDate] = useState<Date>();
    const [isLoading, setLoading] = useState(!Boolean(bondDetailedTmp))


    useEffect(() => {
        const updater = () => fetchContractExtended(queryParams)
            .then(contract => {
                setRefreshDate(new Date())
                if (contract && JSON.stringify(contract) !== JSON.stringify(bondDetailed)) {
                    setBondDetailed({...contract});
                    setLoading(false);
                }
            })

        updater().catch(nop)
        const interval = setInterval(updater, UPDATE_INTERVAL)
        return () => clearInterval(interval);
    }, [bondDetailed, updateIndex, queryParams])

    if (isLoading) return <LoadingScreen/>

    const refreshHandler = [refreshDate, setUpdateIndex]
    console.log('Rendering')

    return <>
        <div className='flex flex-col gap-4 w-full xl1:px-52 lg:px-24 md:px-12 sm:px-8 py-24'>
            <HeadlineContainer refreshHandler={refreshHandler}/>
            <StatisticsContainer bondDetailed={bondDetailed}/>
            <div className='grid grid-cols-12 w-full gap-4 h-full'>
                <MainDetailsContainer bondDetailed={bondDetailed}/>
                <ActionsContainer contractInfo={bondDetailed.contractInfo}/>
            </div>
            <DescriptionContainer bondDetailed={bondDetailed} setBondDetailed={setBondDetailed}/>
            <GeneralStatisticsContainer contractInfo={bondDetailed.contractInfo}/>
        </div>
    </>
}




