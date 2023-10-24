import {BondInfoDetailed, TokenInfo} from "@/modules/web3/type";
import Styles from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index.module.css";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {RootState} from "@/store/redux/type";
import {getTokensPurchaseDates} from "@/modules/web3/zcb";
import {formatTime} from "@/modules/utils/dates";
import {toast} from "react-toastify";
import * as Web3Service from "@/modules/web3";
import {TxTypes, WalletTypes} from "@/modules/web3/constants";
import * as AccountSlice from "@/store/redux/account";
import Loading from "@/components/utils/loading";
import SelectAllSVG from "../../../../../../../../public/svg/select-all";
import ClearSVG from "../../../../../../../../public/svg/clear";
import {nop} from "@/modules/utils/function";
import {toBN} from "@/modules/web3/util";
import {format} from "@/modules/utils/numbers";

export default function Redeem({info, tokens}: { info: BondInfoDetailed, tokens: { [key: string]: TokenInfo } }) {

    const {_id, redeemLockPeriod, chainId} = info;
    const account = useSelector((item: RootState) => item.account);

    const inputRef = useRef<any>(null)
    const [tokenIds, setTokenIds] = useState([] as any);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    const contractAddress = info._id?.toLowerCase() || ""
    const balanceTokenIds = account.balance[contractAddress] || [];

    const [holdings, setHoldings] = useState([])
    const validTokenIds = holdings.filter((item: any) => item.isValid);
    const tokenIdsLocal = validTokenIds.map((item: any) => item.id);


    useEffect(() => {
        AccountSlice.initBalance(account.address, chainId);
        const interval = setInterval(() => AccountSlice.initBalance(account.address, chainId), 10000);
        return () => clearInterval(interval);

    }, [chainId])


    useEffect(() => {
        if (balanceTokenIds.length) {
            if (!holdings.length) {
                setLoading(true);
            }
            getTokensPurchaseDates(account.chainId, contractAddress, balanceTokenIds)
                .then(response => {
                    const utcTimestamp = Date.now() / 1000;
                    const tokensWithDates = response.map((date: number, index: number) => {
                        const isValid = utcTimestamp - Number(redeemLockPeriod) > Number(date)
                        const timeLeft = Number(date) + Number(redeemLockPeriod) - utcTimestamp
                        return {
                            id: balanceTokenIds[index],
                            purchaseDate: Number(date),
                            isValid,
                            timeLeft: isValid ? "0" : formatTime(timeLeft)
                        }
                    })

                    setHoldings(tokensWithDates);
                })
                .catch(error => console.log(`getTokensPurchaseDates`, error))
                .finally(() => setLoading(false))
        }
    }, [account.address, account.chainId, account.balance[contractAddress]])


    const onChange = (event: any) => {
        const amountLocal = Number(event.target.value)
        setTokenIds(tokenIdsLocal.slice(0, amountLocal));
        setAmount(amountLocal);
    }

    async function submit() {

        if (!tokenIds.length) {
            toast.error("You did not select a bond");
            return;
        }

        await Web3Service.submitTransaction({
            connectionConfig: {
                type: account.connection.type,
                chainId: chainId,
                requestChain: true,
                requestAccounts: true,
            },
            txType: TxTypes.RedeemBonds,
            config: {
                contractAddress: _id,
                ids: tokenIds
            }
        });
        setTimeout(() => {
            AccountSlice.initBalance(account.address, chainId);
        }, 5000);
        setTokenIds([]);
        setAmount(0);
        inputRef.current.value = "";
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

        const token = tokens[info.interestToken]
        const balance = toBN(info.interestTokenBalance).div(toBN(10).pow(toBN(token.decimals))).toNumber()
        const redeemAmount = toBN(info.interestTokenAmount).div(toBN(10).pow(toBN(token.decimals))).toNumber()
        const totalTokens = tokenIds.length * redeemAmount

        if (!amount || !isFinite(amount)) {
            onClick = nop
        } else if (amount > validTokens.length) {
            className += ` ${Styles.disable}`
            onClick = nop
            title = "Max bonds reached"
        } else if (balance < totalTokens) {
            className += ` ${Styles.disable}`
            onClick = nop
            title = "Not enough liquidity"
        } else if (tokenIds.length) {
            const total = tokenIds.length * redeemAmount;
            totalAmountStyle = "text-green-500 font-medium"
            totalAmountText = `( +${format(total)} ${token?.symbol} )`
        }

        return <button className={className} onClick={onClick}>
            {title}
            {totalAmountText && <span className={totalAmountStyle}>{totalAmountText}</span>}
        </button>
    }

    if (loading) {
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
                <div className='flex gap-2 items-center'>
                    <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:bg-green-600'
                            onClick={() => setPercent(5)}>5%
                    </button>
                    <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:bg-green-600'
                            onClick={() => setPercent(10)}>10%
                    </button>
                    <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:bg-green-600'
                            onClick={() => setPercent(25)}>25%
                    </button>
                    <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:bg-green-600'
                            onClick={() => setPercent(50)}>50%
                    </button>
                    <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:bg-green-600'
                            onClick={() => setPercent(100)}>100%
                    </button>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <span className='text-xs text-g2'>You confirm that you have read and understood the Terms and Conditions.</span>
                <SubmitButton/>
            </div>
        </div>
    </>
}
