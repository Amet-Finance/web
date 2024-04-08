import {getChain} from "@/modules/utils/wallet-connect";
import {useState} from "react";
import {TxTypes} from "@/modules/web3/constants";
import BigNumber from "bignumber.js";
import {toast} from "react-toastify";
import {Loading} from "@/components/utils/loading";
import {Agreement, Percentages} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/utils";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {ContractBalance} from "@/modules/api/type";
import {useTransaction} from "@/modules/utils/transaction";
import {ConditionalRenderer} from "@/components/utils/container";
import XmarkSVG from "../../../../../../../../public/svg/utils/xmark";
import {DefaultButton} from "@/components/utils/buttons";
import {ContractCoreDetails} from "@/modules/api/contract-type";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";

// todo add capitulation as well

export default function RedeemTab({contractInfo}: Readonly<{
    contractInfo: ContractCoreDetails
}>) {

    const {contractAddress, chainId, payout} = contractInfo;

    const chain = getChain(chainId);

    const [bondIndexes, setBondIndexes] = useState([] as Array<number>)

    const balancesStore = useSelector((item: RootState) => item.account).balances;
    const balances: ContractBalance[] = balancesStore[contractAddress.toLowerCase()] || []

    const [redemptionCount, setRedemptionCount] = useState(0);

    const interestBalance = BigNumber(contractInfo.payoutBalance).div(BigNumber(10).pow(BigNumber(payout.decimals))).toNumber();

    const totalQuantity = balances.reduce((acc: number, value: ContractBalance) => acc + value.balance, 0);
    const matureTokenIds = getMatureTokenIds(contractInfo, balances);
    const matureQuantity = matureTokenIds.reduce((acc: number, tokenId: number) => acc + (balances.find(item => item.tokenId === tokenId)?.balance ?? 0), 0)

    const totalRedeemAmount = redemptionCount * payout.amountClean
    const notEnoughLiquidity = totalRedeemAmount > interestBalance
    const redeemingMoreThenAvailable = redemptionCount > totalQuantity


    const blockClick = redeemingMoreThenAvailable || notEnoughLiquidity || redemptionCount <= 0;
    let title = "Redeem"
    if (notEnoughLiquidity) title = "Not Enough Liquidity"
    if (redeemingMoreThenAvailable) title = "Max Bonds Reached"
    if (redemptionCount > matureQuantity) title = "Not Mature"


    const config = {
        contractAddress,
        bondIndexes,
        redemptionCount,
        isCapitulation: false
    }

    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.RedeemBonds, config)

    function onChange(event: any) {
        const value = Number(event.target.value);
        setCount(value);
    }

    function setPercentage(percent: number) {
        const count = totalQuantity ? Math.max(Math.floor(totalQuantity * percent / 100), 1) : 0;
        setCount(count)
    }

    function setCount(value: number) {

        let valueLeft = value;
        const indexes: number[] = []

        for (const balanceInfo of balances) {
            if (!valueLeft) break;

            valueLeft -= balanceInfo.balance;
            indexes.push(balanceInfo.tokenId)

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

            await submitTransaction();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex flex-col gap-1 justify-end w-full'>
            <ConditionalRenderer isOpen={Boolean(totalRedeemAmount)}>
                <div
                    className='flex flex-col justify-center items-center rounded-md px-4 py-1 bg-green-500 h-full whitespace-nowrap'>
                    <span
                        className='text-4xl font-bold'>-{formatLargeNumber(totalRedeemAmount, false, 2)} {payout.symbol}</span>
                    <span className='text-xs'>Total Redeem Amount:</span>
                </div>
            </ConditionalRenderer>
            <div className='flex flex-col gap-2'>
                <div
                    className='flex flex-col items-center justify-between  rounded-md py-1 w-full border border-neutral-900 px-2'>
                    <div className='flex items-center justify-between w-full'>
                        <input type="number"
                               id='amount'
                               className='bg-transparent placeholder:text-neutral-600 w-full text-sm'
                               value={redemptionCount || ""}
                               onChange={onChange}
                               placeholder='Enter Number of Bonds to Redeem'/>
                        <ConditionalRenderer isOpen={Boolean(redemptionCount)}>
                            <XmarkSVG isSmall onClick={setCount.bind(null, 0)}/>
                        </ConditionalRenderer>
                    </div>
                </div>
                <Percentages setter={setPercentage}/>
                <Agreement actionType={"redeeming"}/>
                <DefaultButton onClick={submit} disabled={blockClick} classType='1'>
                        <div className='flex items-center gap-2'>
                            <ConditionalRenderer isOpen={isLoading}>
                                <Loading percent={75} color="#000"/>
                            </ConditionalRenderer>
                            {title}
                        </div>
                </DefaultButton>
            </div>
        </div>
    )
}


function getMatureTokenIds(contractInfo: ContractCoreDetails, balances: ContractBalance[]): number[] {

    const {block, maturityPeriodInBlocks} = contractInfo;
    const matureTokenIds = []

    for (const balanceInfo of balances) {
        if (block - maturityPeriodInBlocks > balanceInfo.purchaseBlock) {
            matureTokenIds.push(balanceInfo.tokenId);
        }
    }

    return matureTokenIds
}
