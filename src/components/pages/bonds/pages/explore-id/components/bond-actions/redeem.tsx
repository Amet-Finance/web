import {BondInfoDetailed, TokenInfo} from "@/modules/web3/type";
import Styles from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index.module.css";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {RootState} from "@/store/redux/type";
import {getTokensPurchaseDates} from "@/modules/web3/zcb";
import {formatTime} from "@/modules/utils/dates";
import {toast} from "react-toastify";
import {TxTypes} from "@/modules/web3/constants";
import * as AccountSlice from "@/store/redux/account";
import Loading from "@/components/utils/loading";
import {nop} from "@/modules/utils/function";
import {toBN} from "@/modules/web3/util";
import {divBigNumber, format} from "@/modules/utils/numbers";
import {useAccount, useSendTransaction} from "wagmi";
import {getChain} from "@/modules/utils/wallet-connect";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {TokensResponse} from "@/modules/cloud-api/type";
import {Holding} from "@/components/pages/bonds/pages/explore-id/components/bond-actions/types";

export default function Redeem({info, tokens}: { info: BondInfoDetailed, tokens: TokensResponse }) {

    const {_id, redeemLockPeriod, chainId, interestToken} = info;
    const {balance} = useSelector((item: RootState) => item.account);
    const {address} = useAccount();
    const chain = getChain(chainId);
    const {open} = useWeb3Modal()

    const inputRef = useRef<any>(null)
    const [tokenIds, setTokenIds] = useState([] as any);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    const contractAddress = _id.toLowerCase() || ""
    const balanceTokenIds = balance[chainId]?.[contractAddress] || [];
    const interestTokenInfo = tokens[interestToken.toLowerCase()]

    const [holdings, setHoldings] = useState([] as Holding[])
    const validTokenIds = holdings.filter((item: any) => item.isValid);
    const tokenIdsLocal = validTokenIds.map((item: any) => item.id);

    const firstRedeemable = holdings[0]?.timeLeft;


    const contractInfo = getContractInfoByType(chain, TxTypes.RedeemBonds, {
        contractAddress: _id,
        tokenIds
    })

    const {isLoading, sendTransactionAsync} = useSendTransaction({
        to: contractInfo.to,
        value: BigInt(contractInfo.value || 0) || undefined,
        data: contractInfo.data,
    })

    useEffect(() => {
        if (address && chainId) {
            AccountSlice.initBalance(address, chainId);
            const interval = setInterval(() => AccountSlice.initBalance(address, chainId), 10000);
            return () => clearInterval(interval);
        }
    }, [address, chainId])


    useEffect(() => {
        if (balanceTokenIds.length) {
            if (!holdings.length) {
                setLoading(true);
            }
            getTokensPurchaseDates(chain, contractAddress, balanceTokenIds)
                .then(response => {
                    const utcTimestamp = Date.now() / 1000;
                    const tokensWithDates = response.map((date: number, index: number) => {
                        const isValid = utcTimestamp - Number(redeemLockPeriod) > Number(date)
                        const timeLeft = Number(date) + Number(redeemLockPeriod) - utcTimestamp
                        return {
                            id: balanceTokenIds[index],
                            purchaseDate: Number(date),
                            isValid,
                            timeLeft: isValid ? "" : formatTime(timeLeft, true, true)
                        } as Holding
                    })

                    setHoldings(tokensWithDates);
                })
                .catch(error => console.log(`getTokensPurchaseDates`, error))
                .finally(() => setLoading(false))
        }
    }, [address, balanceTokenIds])

    const onChange = (event: any) => {
        const amountLocal = Number(event.target.value)
        setTokenIds(tokenIdsLocal.slice(0, amountLocal));
        setAmount(amountLocal);
    }

    async function submit() {

        try {
            if (!address) {
                return open();
            }

            if (!tokenIds.length) {
                return toast.error("You did not select a bond");
            }

            const response = await sendTransactionAsync();
            await trackTransaction(chain, response.hash);

            setTokenIds([]);
            setAmount(0);
            inputRef.current.value = "";
        } catch (error: any) {

        }
    }

    function setPercent(percent: number) {
        const tokenIds = Math.floor((tokenIdsLocal.length * percent) / 100)
        inputRef.current.value = tokenIds;

        setAmount(tokenIds)
        setTokenIds(tokenIdsLocal.slice(0, tokenIds));
    }

    const SubmitButton = () => {
        const validTokens = holdings.filter((item: any) => item.isValid);
        let title = "Redeem";
        let className = `flex justify-center items-center gap-2 bg-transparent text-white  px-5 p-3 rounded border border-solid border-w1 hover:bg-white hover:text-black font-medium`;
        let totalAmountStyle = ""
        let totalAmountText = ""
        let onClick: any = submit;


        const balance = divBigNumber(info.interestTokenBalance, interestTokenInfo.decimals);
        const redeemAmount = divBigNumber(info.interestTokenAmount, interestTokenInfo.decimals);
        const totalTokens = toBN(tokenIds.length).mul(redeemAmount)

        if (!amount || !isFinite(amount)) {
            onClick = nop
        } else if (amount > validTokens.length) {
            className += ` ${Styles.disable}`
            onClick = nop
            title = "Max bonds reached"
        } else if (balance.lt(totalTokens)) {
            className += ` ${Styles.disable}`
            onClick = nop
            title = "Not enough liquidity"
        } else if (tokenIds.length) {
            const total = toBN(tokenIds.length).mul(redeemAmount).toNumber();
            totalAmountStyle = "text-green-500 font-medium"
            totalAmountText = `( +${format(total)} ${interestTokenInfo.symbol} )`
        }

        return <button className={className} onClick={onClick}>
            {isLoading && <Loading percent={70}/>}
            {title}
            {totalAmountText && <span className={totalAmountStyle}>{totalAmountText}</span>}
        </button>
    }

    if (loading || !interestTokenInfo) {
        return <div className="flex justify-center items-center w-full"><Loading percent={-25}/></div>
    }

    if (!holdings.length) {
        return <>
            <div className='flex items-center justify-center p-4'>
                <span className='text-g'>There are no bonds to redeem</span>
            </div>
        </>
    }

    return <>
        <div className="flex flex-col w-full gap-4">
            <div className='flex flex-col gap-2'>
                <input
                    className="bg-transparent placeholder:text-g text-white text-sm px-5 p-2.5 rounded border border-solid border-w1"
                    type="number"
                    onChange={onChange}
                    ref={inputRef}
                    placeholder="The amount of bonds you want to redeem"/>
                <div className='flex justify-between items-center w-full'>
                    <div className='flex gap-2 items-center'>
                        <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:border-w2'
                                onClick={() => setPercent(5)}>5%
                        </button>
                        <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:border-w2'
                                onClick={() => setPercent(10)}>10%
                        </button>
                        <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:border-w2'
                                onClick={() => setPercent(25)}>25%
                        </button>
                        <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:border-w2'
                                onClick={() => setPercent(50)}>50%
                        </button>
                        <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:border-w2'
                                onClick={() => setPercent(100)}>100%
                        </button>
                    </div>
                    {
                        Boolean(firstRedeemable) &&
                        <span className='text-xs text-g text-end'>Redeem after {firstRedeemable}</span>
                    }
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <span className='text-xs text-g2'>You confirm that you have read and understood the Terms and Conditions.</span>
                <SubmitButton/>
            </div>
        </div>
    </>
}
