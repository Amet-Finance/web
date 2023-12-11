import Styles from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index.module.css";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {RootState} from "@/store/redux/type";
import {getTokensPurchaseDates} from "@/modules/web3/zcb";
import {formatTime, sleep} from "@/modules/utils/dates";
import {toast} from "react-toastify";
import {TxTypes} from "@/modules/web3/constants";
import * as AccountSlice from "@/store/redux/account";
import Loading from "@/components/utils/loading";
import {nop} from "@/modules/utils/function";
import {toBN} from "@/modules/web3/util";
import {divBigNumber, format} from "@/modules/utils/numbers";
import {useAccount, useNetwork, useSendTransaction, useSwitchNetwork} from "wagmi";
import {getChain} from "@/modules/utils/wallet-connect";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {DetailedBondResponse} from "@/modules/cloud-api/type";
import {Holding} from "@/components/pages/bonds/pages/explore-id/components/bond-actions/types";
import SettingsSVG from "../../../../../../../../public/svg/utils/settings";
import XmarkSVG from "../../../../../../../../public/svg/xmark";
import BigNumber from "bignumber.js";

export default function Redeem({bondInfo, refreshHandler}: { bondInfo: DetailedBondResponse, refreshHandler: any[] }) {
    const [refresh, setRefresh] = refreshHandler;
    const {contractInfo} = bondInfo;

    const {
        _id,
        redeemLockPeriod,
        chainId,
        interestTokenAmount,
        interestTokenInfo,
        interestTokenBalance
    } = contractInfo;
    const {balance} = useSelector((item: RootState) => item.account);
    const {address} = useAccount();
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork()
    const chain = getChain(chainId);
    const {open} = useWeb3Modal()

    const [effectRefresh, setEffectRefresh] = useState(0)

    const inputRef = useRef<any>(null)
    const [tokenIds, setTokenIds] = useState([] as any);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    const advancedInputRef = useRef<any>()
    const [isAdvanced, setAdvanced] = useState(false);
    const [advancedTokenIds, setAdvancedTokenIds] = useState<number[]>([]);

    const contractAddress = _id.toLowerCase() || ""
    const balanceTokenIds = balance[chainId]?.[contractAddress] || [];

    const [holdings, setHoldings] = useState([] as Holding[])
    const validTokenIds = holdings.filter((item: any) => item.isValid);
    const tokenIdsLocal = validTokenIds.map((item: any) => item.id);

    const firstRedeemable = holdings[0]?.timeLeft;

    const config = {
        contractAddress: _id,
        tokenIds: isAdvanced ? advancedTokenIds : tokenIds
    }
    const contractInfoData = getContractInfoByType(chain, TxTypes.RedeemBonds, config)

    const {isLoading, sendTransactionAsync} = useSendTransaction({
        to: contractInfoData.to,
        value: BigInt(contractInfoData.value || 0) || undefined,
        data: contractInfoData.data
    })

    useEffect(() => {
        if (address && chainId) {
            AccountSlice.initBalance(address, chainId).catch(nop);
            const interval = setInterval(() => AccountSlice.initBalance(address, chainId), 15000);
            return () => clearInterval(interval);
        }
    }, [address, chainId, effectRefresh])


    useEffect(() => {
        if (balanceTokenIds.length) {
            if (!holdings.length) {
                setLoading(true);
            }
            getTokensPurchaseDates(chain, contractAddress, balanceTokenIds)
                .then(response => {
                    const utcTimestamp = Date.now() / 1000;
                    const tokensWithDates = response.map((date: string, index: number) => {
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

            if (!config.tokenIds.length) {
                return toast.error("You did not select a bond");
            }

            if (network.chain?.id !== chainId) {
                await switchNetworkAsync?.(chainId)
            }

            const response = await sendTransactionAsync();
            await trackTransaction(chain, response.hash);

            setTokenIds([]);
            setAmount(0);
            setAdvancedTokenIds([]);

            if (inputRef.current?.value) inputRef.current.value = "";
            if (advancedInputRef.current?.value) advancedInputRef.current.value = '';

            await sleep(3000);
            setEffectRefresh(Math.random());
            setRefresh(Math.random());
        } catch (error: any) {
            console.log(error);
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


        const balance = BigNumber(interestTokenBalance?.balanceClean || 0);
        const redeemAmount = divBigNumber(interestTokenAmount, interestTokenInfo.decimals);
        const totalTokens = toBN(config.tokenIds.length).times(redeemAmount)

        if (isAdvanced) {
            if (advancedTokenIds.length) {
                const total = (toBN(config.tokenIds.length).times(redeemAmount)).toNumber();
                totalAmountStyle = "text-green-500 font-medium"
                totalAmountText = `( +${format(total)} ${interestTokenInfo.symbol} )`
            } else {
                onClick = nop
            }
        } else {
            if (!amount || !isFinite(amount)) {
                onClick = nop
            } else if (amount > validTokens.length) {
                className += ` ${Styles.disable}`
                onClick = nop
                title = "Cannot Redeem Yet"
            } else if (balance.lt(totalTokens)) {
                className += ` ${Styles.disable}`
                onClick = nop
                title = "Not enough liquidity"
            } else if (config.tokenIds.length) {
                const total = (toBN(config.tokenIds.length).times(redeemAmount)).toNumber();
                totalAmountStyle = "text-green-500 font-medium"
                totalAmountText = `( +${format(total)} ${interestTokenInfo.symbol} )`
            }

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

    if (!holdings.length && !isAdvanced) {
        return <>
            <div className='flex items-center justify-center p-4 md:max-w-sm sm:w-full'>
                <p
                    className='text-g'>There are no bonds to redeem, but you can still use the <span
                    className='text-green-500 cursor-pointer' onClick={openOrCloseAdvanced}>advanced redeem.</span></p>
            </div>
        </>
    }

    function openOrCloseAdvanced() {
        return setAdvanced(!isAdvanced)
    }

    function addTokenIdToAdvanced() {
        const tokenId = Number(advancedInputRef.current.value);
        if (Number.isFinite(tokenId) && !advancedTokenIds.includes(tokenId)) {
            setAdvancedTokenIds([...advancedTokenIds, tokenId])
        }
        advancedInputRef.current.value = ""
    }

    function removeTokenIdFromAdvanced(index: number) {
        const advanced = [...advancedTokenIds];
        advanced.splice(index, 1);
        setAdvancedTokenIds([...advanced])
    }

    return <>
        <div className="flex flex-col w-full gap-4">
            {
                !isAdvanced ?
                    <>
                        <div className='flex flex-col gap-2'>
                            <div
                                className='flex justify-between w-full px-4 p-2.5 rounded border border-solid border-w1'>
                                <input
                                    className="bg-transparent placeholder:text-g text-white text-sm w-full"
                                    type="number"
                                    onChange={onChange}
                                    ref={inputRef}
                                    placeholder="The amount of bonds you want to redeem"/>
                                <SettingsSVG onClick={openOrCloseAdvanced}/>
                            </div>
                            <div className='flex justify-between items-center w-full'>
                                <div className='flex gap-2 items-center'>
                                    <button
                                        className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:border-w2'
                                        onClick={() => setPercent(5)}>5%
                                    </button>
                                    <button
                                        className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:border-w2'
                                        onClick={() => setPercent(10)}>10%
                                    </button>
                                    <button
                                        className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:border-w2'
                                        onClick={() => setPercent(25)}>25%
                                    </button>
                                    <button
                                        className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:border-w2'
                                        onClick={() => setPercent(50)}>50%
                                    </button>
                                    <button
                                        className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm hover:border-w2'
                                        onClick={() => setPercent(100)}>100%
                                    </button>
                                </div>
                                {
                                    Boolean(firstRedeemable) &&
                                    <span className='text-xs text-g text-end'>Redeem after {firstRedeemable}</span>
                                }
                            </div>
                        </div>
                    </> :
                    <>
                        <div className='flex flex-col gap-2'>

                            <div className='flex flex-col gap-2'>
                                <div className='flex items-center justify-between gap-1'>
                                    <span className='text-sm text-g'>Select the bonds manually</span>
                                    <XmarkSVG isMedium onClick={openOrCloseAdvanced}/>
                                </div>
                                <div className='grid grid-cols-4 gap-2 items-center max-w-[500px]'>
                                    {advancedTokenIds.map((id: string | number, index: number) => (
                                        <div key={index}
                                             className='flex items-center justify-between gap-1 px-2 border border-w1 rounded overflow-x-auto'>
                                            <span className='text-sm'>{id}</span>
                                            <XmarkSVG isSmall onClick={() => removeTokenIdFromAdvanced(index)}/>
                                        </div>))}
                                </div>
                            </div>
                            <div className='flex justify-between  border border-w1 rounded w-full'>
                                <input type="text" className='px-4 py-1 bg-transparent placeholder:text-sm w-full'
                                       ref={advancedInputRef} placeholder='Bond(Token) Id'/>
                                <button className='rounded px-2 text-sm bg-white text-black whitespace-nowrap'
                                        onClick={addTokenIdToAdvanced}>Add Token Id
                                </button>
                            </div>
                        </div>
                    </>
            }
            <div className='flex flex-col gap-2'>
                <span className='text-xs text-g2'>You confirm that you have read and understood the Terms and Conditions.</span>
                <SubmitButton/>
            </div>
        </div>
    </>
}
