import {useEffect, useRef, useState} from "react";
import {getAllowance} from "@/modules/web3/tokens";
import Styles from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index.module.css";
import Loading from "@/components/utils/loading";
import {TxTypes} from "@/modules/web3/constants";
import * as AccountSlice from "@/store/redux/account";
import {sleep} from "@/modules/utils/dates";
import {toBN} from "@/modules/web3/util";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {divBigNumber, format} from "@/modules/utils/numbers";
import {BondInfoDetailed} from "@/modules/web3/type";
import {getChain} from "@/modules/utils/wallet-connect";
import {useAccount, useNetwork, useSendTransaction, useSwitchNetwork} from "wagmi";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {TokensResponse} from "@/modules/cloud-api/type";

export default function Purchase({info, tokens}: { info: BondInfoDetailed, tokens: TokensResponse }) {

    const {
        _id,
        chainId,
        investmentTokenAmount,
        total,
        purchased,
        investmentToken
    } = info;

    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork()
    const {address} = useAccount()
    const {open} = useWeb3Modal()


    const chain = getChain(chainId)

    const investmentTokenInfo = tokens[investmentToken.toLowerCase()];
    const bondsLeft = Number(total) - Number(purchased);

    const [effectRefresher, setEffectRefresher] = useState(0);
    const inputRef = useRef<any>();
    const [amount, setAmount] = useState(0);
    const [allowance, setAllowance] = useState("0")

    useEffect(() => {
        if (chain && address) {
            getAllowance(chain, investmentToken, address, _id)
                .then(response => setAllowance(response.toString()))
                .catch(() => null);
        }
    }, [chain, _id, investmentToken, address, effectRefresher])


    const investmentAmountClean = divBigNumber(investmentTokenAmount, investmentTokenInfo?.decimals)
    const totalPrice = toBN(amount).times(investmentAmountClean);
    const allowanceDivided = divBigNumber(allowance, investmentTokenInfo?.decimals)
    const isApproval = totalPrice.gt(allowanceDivided);
    const isSold = total - purchased === 0

    const onChange = (event: any) => setAmount(Number(event.target.value) || 0);

    const txType = isApproval ? TxTypes.ApproveToken : TxTypes.PurchaseBonds;
    const config = isApproval ? {
        contractAddress: investmentToken,
        spender: _id,
        value: toBN(amount).times(toBN(investmentTokenAmount)).toNumber()
    } : {
        contractAddress: _id,
        count: amount
    }

    const contractInfo = getContractInfoByType(chain, txType, config)
    const {isLoading, sendTransactionAsync, status} = useSendTransaction({
        to: contractInfo.to,
        value: BigInt(contractInfo.value || 0),
        data: contractInfo.data
    })


    if (isSold) {
        return <>
            <div className='flex flex-col gap-2 justify-center items-center py-5 rounded cursor-pointer w-full'>
                <span className='font-bold text-5xl'>SOLD OUT</span>
                <p className='text-g text-sm text-center'>All available bonds for this offering have been
                    purchased.</p>
            </div>
        </>
    }

    if (!investmentTokenInfo) {
        return <>
            <div className='flex justify-center items-center w-full'>
                <Loading/>
            </div>
        </>;
    }

    async function submit() {
        try {
            if (!address) {
                return open()
            }

            if (network.chain?.id !== chain?.id) {
                await switchNetworkAsync?.(chain?.id)
            }

            if (isApproval) {

                if (!investmentTokenInfo?.decimals || !investmentTokenAmount) {
                    return;
                }

                const response = await sendTransactionAsync();
                await trackTransaction(chain, response.hash)
            } else {
                if (!Number(amount) || !isFinite(amount)) {
                    return;
                }

                if (!localStorage.getItem('quizPassed')) {
                    return openModal(ModalTypes.Quiz)
                }

                const response = await sendTransactionAsync();
                await trackTransaction(chain, response.hash);

                await sleep(4000);
                await AccountSlice.initBalance(address, chainId);
            }

            setEffectRefresher(Math.random());
        } catch (error: any) {

        }
    }

    function SubmitButton() {
        let title = "Purchase"
        let totalAmount = totalPrice;
        let totalAmountText = ''
        let totalAmountStyle = ''
        let className = `flex items-center justify-center gap-2 bg-transparent text-white  px-5 p-3 rounded border border-solid border-w1 hover:bg-white hover:text-black font-medium`;
        let onClick: any = submit

        if (!Number(bondsLeft)) {
            title = `SOLD OUT`
            className += ` ${Styles.disable}`
            onClick = async () => {
            };
        } else if (Number(amount) > Number(bondsLeft)) {
            title = `Not Enough Bonds`
            className += ` ${Styles.disable}`
            onClick = async () => {
            };
        } else if (isApproval) {
            title = `Approve`
            totalAmountStyle = "text-red-500 font-medium"
            totalAmountText = `( ${format(totalPrice.toNumber())} ${investmentTokenInfo?.symbol} )`
        } else if (totalAmount.toNumber()) {
            totalAmountStyle = "text-red-500 font-medium"
            totalAmountText = `( -${format(totalPrice.toNumber())} ${investmentTokenInfo?.symbol} )`
        }


        return <>
            <button className={className} onClick={onClick}>
                {isLoading && <Loading percent={70}/>}
                {title}
                {Boolean(totalAmount) && <span className={totalAmountStyle}>{totalAmountText}</span>}
            </button>
        </>
    }

    function setPercent(percent: number) {
        const total = Math.floor((bondsLeft * percent) / 100)
        inputRef.current.value = total
        setAmount(total)
    }

    return <>
        <div className="flex flex-col gap-4">
            <div className='flex flex-col gap-2'>
                <input
                    className="bg-transparent placeholder:text-g text-white text-sm px-5 p-2.5 rounded border border-solid border-w1"
                    type="number"
                    disabled={!bondsLeft}
                    ref={inputRef}
                    onChange={onChange}
                    placeholder="The amount of bonds you want to purchase"/>
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
            </div>
            <div className='flex flex-col gap-2'>
                <span className='text-xs text-g2'>You confirm that you have read and understood the Terms and Conditions.</span>
                <SubmitButton/>
            </div>
        </div>
    </>
}
