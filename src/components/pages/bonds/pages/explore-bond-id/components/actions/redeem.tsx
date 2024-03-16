import {ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {getChain} from "@/modules/utils/wallet-connect";
import {useEffect, useState} from "react";
import {getBlockNumber} from "@/modules/web3";
import {TxTypes} from "@/modules/web3/constants";
import BigNumber from "bignumber.js";
import {toast} from "react-toastify";
import {BasicButton} from "@/components/utils/buttons";
import {Loading} from "@/components/utils/loading";
import {Agreement, Percentages} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/utils";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import FixedFlexController from "@/modules/web3/fixed-flex/v2";
import {ContractBalances} from "@/modules/cloud-api/type";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import {useTransaction} from "@/modules/utils/transaction";
import {ShowContainer} from "@/components/utils/container";

// todo see if bond is mature, and if not show button
// todo add capitulation as well


export default function RedeemTab({contractInfo}: Readonly<{ contractInfo: ContractExtendedInfoFormat }>) {

    const {_id, payout} = contractInfo;
    const [contractAddress, chainId] = _id.toLowerCase().split("_")

    const chain = getChain(chainId)

    const balances = useSelector((item: RootState) => item.account).balances;
    const contractBalance = balances[_id] || {}

    const [currentBlock, setCurrentBlock] = useState(BigInt(0));
    const [purchaseBlocks, setPurchaseBlocks] = useState({})
    const [bondIndexes, setBondIndexes] = useState([] as Array<string>)
    const [redemptionCount, setRedemptionCount] = useState(0);

    const interestBalance = BigNumber(contractInfo.payoutBalance).div(BigNumber(10).pow(BigNumber(payout.decimals))).toNumber();

    const totalQuantity = Object.values(contractBalance).reduce((acc: number, value: number) => acc += value, 0);
    const totalMatureQuantity = getMatureTokenIds(currentBlock, contractInfo.maturityPeriodInBlocks, contractBalance, purchaseBlocks);
    console.log(totalMatureQuantity)

    const totalRedeemAmount = redemptionCount * payout.amountClean
    const notEnoughLiquidity = totalRedeemAmount > interestBalance
    const redeemingMoreThenAvailable = redemptionCount > totalQuantity


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

    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.RedeemBonds, config)


    useEffect(() => {
        if (chain) {
            const request = () => {
                getBlockNumber(chain)
                    .then(block => {
                        if (block) setCurrentBlock(block)
                    })
            }

            request();
            const interval = setInterval(request, UPDATE_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [chain]);

    useEffect(() => {
        if (chain) {
            for (const tokenId in contractBalance) {
                FixedFlexController.purchaseBlocks(chain, contractAddress, tokenId)
                    .then(purchaseBlock => {
                        setPurchaseBlocks({
                            ...purchaseBlocks,
                            [tokenId]: purchaseBlock
                        })
                    })
            }
        }
    }, [chain, contractAddress, contractBalance]);

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
        const indexes: string[] = []

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

            await submitTransaction();
        } catch (error) {
            console.log(error)
        }
    }

    return <div className='flex flex-col gap-1 justify-end w-full'>
        <ShowContainer isOpen={Boolean(totalRedeemAmount)}>
            <div
                className='flex flex-col justify-center items-center border border-neutral-900 rounded-md px-4 py-1 bg-green-500 h-full'>
                    <span
                        className='text-4xl font-bold whitespace-nowrap'>+{formatLargeNumber(totalRedeemAmount, false, 2)} {payout.symbol}</span>
                <span className='text-xs whitespace-nowrap'>Total Redeem Amount:</span>
            </div>
        </ShowContainer>
        <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between border border-neutral-800 rounded-md py-1 px-4'>
                    <input type="number"
                           id='amount'
                           className='bg-transparent placeholder:text-neutral-600 w-full placeholder:text-sm text-sm'
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
    </div>
}


function getMatureTokenIds(currentBlock: bigint, maturityPeriodInBlocks: number, balances: ContractBalances, purchasedBlocks: any): string[] {

    const matureTokenIds = []

    for (const tokenId in balances) {
        const purchasedBlock = purchasedBlocks[tokenId];
        if (purchasedBlock && BigInt(purchasedBlock) + BigInt(maturityPeriodInBlocks) <= currentBlock) {
            matureTokenIds.push(tokenId);
        }
    }

    return matureTokenIds
}
