import {ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {Balance} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {getChain} from "@/modules/utils/wallet-connect";
import {useNetwork, useSendTransaction, useSwitchNetwork} from "wagmi";
import {useEffect, useState} from "react";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {TxTypes} from "@/modules/web3/constants";
import {getTokenBalance} from "@/modules/web3/tokens";
import BigNumber from "bignumber.js";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import {toast} from "react-toastify";
import {BasicButton} from "@/components/utils/buttons";
import Loading from "@/components/utils/loading";
import {Agreement, Percentages} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/utils";

// todo add maturity period block if bond is not mature
// todo add capitulation as well

export default function RedeemTab({contractInfo, balance}: {
    contractInfo: ContractExtendedInfoFormat,
    balance: Balance
}) {

    const {_id, payout} = contractInfo;
    const [contractAddress, chainId] = _id.toLowerCase().split("_")
    const chain = getChain(chainId)

    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork({chainId: chain?.id});

    const [bondIndexes, setBondIndexes] = useState<string[]>([])
    const [redemptionCount, setRedemptionCount] = useState(0);
    const [interestBalance, setInterestBalance] = useState(0);

    const contractBalance = balance[_id] || {}
    const totalBalance = Object.values(contractBalance).reduce((acc: number, value: number) => acc += value, 0);

    const notEnoughLiquidity = interestBalance < redemptionCount * payout.amountClean
    const redeemingMoreThenAvailable = redemptionCount > totalBalance

    const blockClick = redeemingMoreThenAvailable || notEnoughLiquidity || redemptionCount <= 0;
    let title = "Redeem"
    if (notEnoughLiquidity) title = "Not Enough Liquidity"
    if (redeemingMoreThenAvailable) title = "Max Bonds Reached"


    const config = {
        contractAddress,
        bondIndexes,
        redemptionCount,
        isCapitulation: false
    }
    const txConfig = getContractInfoByType(chain, TxTypes.RedeemBonds, config)
    const {sendTransactionAsync, isLoading} = useSendTransaction(txConfig)


    useEffect(() => {
        const getLiquidity = () => {
            if (chain) {
                getTokenBalance(chain, payout.contractAddress, contractAddress)
                    .then(response => {
                        setInterestBalance(BigNumber(response.toString()).div(BigNumber(10).pow(BigNumber(payout.decimals))).toNumber())
                    })
            }
        }

        getLiquidity();
        const interval = setInterval(getLiquidity, UPDATE_INTERVAL);
        return () => clearInterval(interval);
    }, [chain, contractAddress, payout.contractAddress, payout.decimals]);


    console.log(bondIndexes, redemptionCount)

    function onChange(event: any) {
        const value = Number(event.target.value);
        setCount(value);
    }

    function setPercentage(percent: number) {
        const count = totalBalance ? Math.max(Math.floor(totalBalance * percent / 100), 1) : 0;
        setCount(count)
    }

    function setCount(value: number) {

        let valueLeft = value;
        const indexes: string[] = []


        console.log(contractBalance)
        for (const tokenId in contractBalance) {
            if (!valueLeft) break;

            if (Number(contractBalance[tokenId])) {
                valueLeft -= Number(contractBalance[tokenId])
                indexes.push(tokenId)
            }

            if (valueLeft <= 0) {
                break;
            }
        }

        if (valueLeft > 0) {
            // toast.error(`Redeem logic failed. Redeeming insufficient funds. Please contact support via Discord`)
            // return;
        }

        setBondIndexes([...indexes])
        setRedemptionCount(value)
    }

    async function submit() {
        try {
            if (blockClick) return;
            if (!chain) return toast.error("Please select correct chain")
            if (network.chain?.id !== chain.id) await switchNetworkAsync?.(chain.id);

            const response = await sendTransactionAsync();
            const result = await trackTransaction(chain, response.hash);
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        <div className='flex flex-col gap-4 justify-end w-full'>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between border border-neutral-800 rounded-md py-1.5 px-4'>
                    <input type="number"
                           id='amount'
                           className='bg-transparent placeholder:text-neutral-600 w-full'
                           value={redemptionCount || ""}
                           onChange={onChange}
                           placeholder='Enter Number of Bonds to Redeem'/>
                </div>
                <Percentages setter={setPercentage}/>
                <Agreement actionType={"redeeming"}/>
            </div>
            <BasicButton onClick={submit} isBlocked={blockClick}>
                <div className='flex items-center gap-2'>
                    {isLoading && <Loading percent={75} color="#000"/>}
                    {title}
                </div>
            </BasicButton>
        </div>
    </>
}
