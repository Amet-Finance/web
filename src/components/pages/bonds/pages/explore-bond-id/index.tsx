import {useEffect, useState} from "react";
import {ContractExtendedFormat} from "@/modules/cloud-api/contract-type";
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
import {useTokenBalance} from "@/components/pages/bonds/utils/balance";

// todo add headline component so whenever bond is fully purchased and redeemed (totalBonds === purchased === redeemed and isSettled) add a component
// on top and tell that this bond is officially finished
// todo add "Get purchase token" button on purchase screen
// todo somehow show the USD equivalent for purchase and payout

export default function ExploreBondId({bondDetailedTmp, queryParams}: Readonly<ExploreBondIdType>) {

    const {
        bondDetailed,
        setBondDetailed,
        isLoading,
        refreshDate,
        refreshLoader,
        setUpdateIndex
    } = useUpdater({bondDetailedTmp, queryParams});
    const refreshHandler = [refreshDate, setUpdateIndex];


    if (isLoading) return <LoadingScreen/>

    return (
        <GeneralContainer className='flex flex-col gap-4 w-full py-24' isPadding>
            <HeadlineContainer refreshHandler={refreshHandler} refreshLoader={refreshLoader}/>
            <FinishedComponent contractInfo={bondDetailed.contractInfo}/>
            <StatisticsContainer contractInfo={bondDetailed.contractInfo}/>
            <div className='grid grid-cols-12 w-full gap-4 h-full'>
                <MainDetailsContainer bondDetailed={bondDetailed}/>
                <ActionsContainer contractInfo={bondDetailed.contractInfo}/>
            </div>
            <DescriptionContainer bondDetailed={bondDetailed} setBondDetailed={setBondDetailed}/>
            <GeneralStatisticsContainer contractInfo={bondDetailed.contractInfo}/>
        </GeneralContainer>
    )
}

function useUpdater({bondDetailedTmp, queryParams}: Readonly<ExploreBondIdType>) {

    const {contractInfo} = bondDetailedTmp;
    const {_id, payout} = contractInfo;
    const [contractAddress, chainId] = _id.toLowerCase().split("_");

    const [bondDetailed, setBondDetailed] = useState<ContractExtendedFormat>({...(bondDetailedTmp || {})})
    const [updateIndex, setUpdateIndex] = useState(0);
    const [refreshDate, setRefreshDate] = useState<Date>();
    const [refreshLoader, setRefreshLoader] = useState(false);
    const [isLoading, setIsLoading] = useState(!bondDetailedTmp)

    const {balance} = useTokenBalance(chainId, payout.contractAddress, contractAddress);

    useEffect(() => {
        const updater = () => {
            setRefreshLoader(true);
            fetchContractExtended(queryParams)
                .then(contract => {
                    setRefreshDate(new Date())
                    if (contract && JSON.stringify(contract) !== JSON.stringify(bondDetailed)) {
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
    }, [bondDetailed, updateIndex, queryParams])


    return {
        bondDetailed: {
            contractInfo: {
                ...bondDetailed.contractInfo,
                payoutBalance: balance,
            },
            contractDescription: bondDetailed.contractDescription,
            lastUpdated: bondDetailed.lastUpdated
        },
        setBondDetailed,
        isLoading,
        refreshDate,
        refreshLoader,
        setUpdateIndex
    }
}



