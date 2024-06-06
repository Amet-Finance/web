import {ContractCoreDetails} from "@/modules/api/contract-type";
import {TxTypes} from "@/modules/web3/constants";
import {ReactNode, useRef, useState} from "react";
import BigNumber from "bignumber.js";
import {toast} from "react-toastify";
import {Percentages} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/utils";
import {Loading} from "@/components/utils/loading";
import {isAddress} from "viem";
import {useTransaction} from "@/modules/utils/transaction";
import {ConditionalRenderer, useShow} from "@/components/utils/container";
import {DefaultButton} from "@/components/utils/buttons";
import XmarkSVG from "../../../../../../../../public/svg/utils/xmark";
import {StringKeyedObject} from "@/components/utils/types";
import {InfoBox} from "@/components/utils/info-box";
import {InfoData} from "@/components/utils/types";
import {URLS} from "@/modules/utils/urls";
import {formatLargeNumber} from "@/modules/utils/numbers";

// todo make this section cleaner and add visualisation(icons)


const ACTION_CONSTANTS: StringKeyedObject<{ title: string, infoData: InfoData, placeholder?: string, }> = {
    DepositPayout: {
        title: "Add Payout",
        infoData: {
            text: "Add funds to the payout pool to ensure bondholders can withdraw their expected returns.",
            link: URLS.AddPayout,
            isBlank: true
        },
        placeholder: "Enter payout amount"
    },
    SettleBonds: {
        title: "Settle All Bonds",
        infoData: {
            text: "Finalize all outstanding bonds and prepare for closure of the bond series.",
            link: URLS.SettleBonds,
            isBlank: true
        }
    },
    WithdrawExcessPayout: {
        title: "Withdraw Excess",
        infoData: {
            text: "Remove excess funds from the payout pool not required for current bond obligations.",
            link: URLS.WithdrawExcessPayout,
            isBlank: true
        }
    },
    UpdateBondSupply: {
        title: "Modify Bond Supply",
        infoData: {
            text: "Adjust the total supply of bonds available for purchase to reflect changes in strategy or demand.",
            link: URLS.UpdateBondSupply,
            isBlank: true
        },
        placeholder: "Set new bond supply"
    },
    DecreaseMaturityPeriod: {
        title: "Shorten Maturity",
        infoData: {
            text: "Reduce the maturity period, accelerating the timeline for bond settlement.",
            link: URLS.DecreaseMaturityPeriod,
            isBlank: true
        },
        placeholder: "Maturity period in blocks"
    },
    ChangeOwner: {
        title: "Transfer Ownership",
        infoData: {
            text: "Change the ownership of the bond contract to a new address.",
            link: URLS.ChangeOwner,
            isBlank: true
        },
        placeholder: "Enter new owner address"
    }
}

export default function ManageTab({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {

    return (
        <div className='relative flex flex-col gap-2 w-full overflow-y-scroll h-72'>
            <DepositPayout contractInfo={contractInfo}/>
            <Settle contractInfo={contractInfo}/>
            <WithdrawExcessPayout contractInfo={contractInfo}/>
            <UpdateBondSupply contractInfo={contractInfo}/>
            <DecreaseMaturityPeriod contractInfo={contractInfo}/>
            <ChangeOwner contractInfo={contractInfo}/>
        </div>
    )
}

function DepositPayout({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {
    const {contractAddress, chainId, payout, totalBonds, redeemed, payoutBalance} = contractInfo;

    const {isOpen, openOrClose} = useShow();
    const [amount, setAmount] = useState(0);

    const handler = [amount, setAmount];
    const payoutBalanceClean = BigNumber(payoutBalance).div(BigNumber(10).pow(BigNumber(payout.decimals))).toNumber()
    const maxPayout = ((totalBonds - redeemed) * payout.amountClean);
    const maxPayoutDeposit = Math.max(maxPayout - payoutBalanceClean, 0)

    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.TransferERC20, {
        contractAddress: payout.contractAddress,
        toAddress: contractAddress,
        amount: `0x${BigNumber(amount).times(BigNumber(10).pow(BigNumber(payout.decimals))).toString(16)}`
    })


    async function submit() {
        try {
            if (amount <= 0) return toast.error("Invalid amount");
            await submitTransaction();
        } catch (error: any) {

        }
    }

    return (
        <ActionContainer isOpen={isOpen}>
            <ContentContainer info={ACTION_CONSTANTS.DepositPayout}
                              additionalChildren={<ConditionalRenderer isOpen={maxPayoutDeposit > 0}>
                                  <span className='text-mm text-red-500 whitespace-nowrap'
                                        title={maxPayoutDeposit.toString()}>Payout Deficit: {formatLargeNumber(maxPayoutDeposit)} {payout.symbol}</span>
                              </ConditionalRenderer>}
                              isOpen={isOpen} isLoading={isLoading}
                              openOrClose={openOrClose}/>
            <ConditionalRenderer isOpen={isOpen}>
                <InputContainer handler={handler}
                                placeholder={ACTION_CONSTANTS.DepositPayout.placeholder}
                                maxValue={maxPayoutDeposit}
                                symbol={payout.symbol}
                                submit={submit}/>
            </ConditionalRenderer>
        </ActionContainer>
    )
}

function Settle({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {
    const {contractAddress, chainId} = contractInfo;
    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.Settle, {contractAddress})

    function submit() {
        if (contractInfo.isSettled) return toast.error("Bond is already settled")
        return submitTransaction();
    }

    return (
        <ActionContainer onClick={submit}>
            <ContentContainer info={ACTION_CONSTANTS.SettleBonds} isLoading={isLoading}/>
        </ActionContainer>
    )
}

function WithdrawExcessPayout({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {

    const {contractAddress, chainId, payoutBalance, totalBonds, redeemed, payout} = contractInfo;
    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.WithdrawExcessPayout, {contractAddress})

    const excessPayout = BigNumber(payoutBalance).minus(BigNumber(totalBonds - redeemed).times(BigNumber(payout.amount)))
    const excessPayoutClean = excessPayout.div(BigNumber(10).pow(BigNumber(payout.decimals))).toNumber()
    const showExcess = Boolean(excessPayoutClean) && excessPayoutClean > 0

    return (
        <ActionContainer onClick={submitTransaction}>
            <ContentContainer info={ACTION_CONSTANTS.WithdrawExcessPayout} isLoading={isLoading}
                              additionalChildren={
                                  <ConditionalRenderer isOpen={showExcess}>
                                      <span
                                          className='text-green-500 whitespace-nowrap text-mm'>Excess Available: +{formatLargeNumber(excessPayoutClean)} {payout.symbol}</span>
                                  </ConditionalRenderer>
                              }/>
        </ActionContainer>
    )
}

function UpdateBondSupply({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {
    const {contractAddress, chainId} = contractInfo;

    const {isOpen, openOrClose} = useShow();
    const [amount, setAmount] = useState(0);

    const handler = [amount, setAmount];

    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.UpdateBondSupply, {
        contractAddress: contractAddress,
        count: BigInt(amount)
    })

    async function submit() {
        if (amount <= 0) return toast.error("Invalid amount");
        await submitTransaction();
    }

    return (
        <ActionContainer isOpen={isOpen}>
            <ContentContainer info={ACTION_CONSTANTS.UpdateBondSupply} isOpen={isOpen} isLoading={isLoading}
                              openOrClose={openOrClose}/>
            <ConditionalRenderer isOpen={isOpen}>
                <InputContainer handler={handler}
                                placeholder={ACTION_CONSTANTS.UpdateBondSupply.placeholder}
                                submit={submit}/>
            </ConditionalRenderer>
        </ActionContainer>
    )
}

function DecreaseMaturityPeriod({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {
    const {contractAddress, chainId,} = contractInfo;

    const {isOpen, openOrClose} = useShow();
    const [amount, setAmount] = useState(0);

    const handler = [amount, setAmount];

    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.DecreaseMaturityPeriod, {
        contractAddress: contractAddress,
        period: BigInt(amount)
    })


    async function submit() {
        if (amount <= 0) return toast.error("Invalid amount");
        await submitTransaction();
    }

    return (
        <ActionContainer isOpen={isOpen}>
            <ContentContainer info={ACTION_CONSTANTS.DecreaseMaturityPeriod} isOpen={isOpen} isLoading={isLoading}
                              openOrClose={openOrClose}/>
            <ConditionalRenderer isOpen={isOpen}>
                <InputContainer handler={handler}
                                placeholder={ACTION_CONSTANTS.DecreaseMaturityPeriod.placeholder}
                                submit={submit}/>
            </ConditionalRenderer>
        </ActionContainer>
    )
}

function ChangeOwner({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {

    const {contractAddress, chainId} = contractInfo;

    const {isOpen, openOrClose} = useShow()
    const [owner, setOwner] = useState();

    const handler = [owner, setOwner];

    console.log(`owner`, owner)

    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.ChangeOwner, {contractAddress, owner})

    async function submit() {
        if (!owner || !isAddress(owner)) return toast.error("Invalid owner");
        await submitTransaction()
    }

    return (
        <ActionContainer isOpen={isOpen}>
            <ContentContainer info={ACTION_CONSTANTS.ChangeOwner} isOpen={isOpen} isLoading={isLoading}
                              openOrClose={openOrClose}/>
            <ConditionalRenderer isOpen={isOpen}>
                <InputContainer handler={handler}
                                type="string"
                                placeholder={ACTION_CONSTANTS.ChangeOwner.placeholder}
                                submit={submit}/>
            </ConditionalRenderer>
        </ActionContainer>
    )
}

function InputContainer({handler, maxValue, symbol, submit, placeholder, type}: Readonly<{
    handler: Array<any>,
    type?: string,
    maxValue?: number,
    symbol?: string,
    placeholder?: string
    submit: any
}>) {

    const ref = useRef<any>();
    const [value, setValue] = handler;

    function change(event: any) {
        if (type === "string") {
            setValue(event.target.value)
        } else {
            setValue(Number(event.target.value))
        }

    }

    function setPercentage(percent: number) {
        if (!maxValue) return;

        const value = Math.floor(maxValue * percent / 100)
        setValue(value);
        ref.current.value = value;
    }

    return (
        <div className='flex flex-col gap-2 w-full bg-black rounded-md'>
            <div className='flex justify-between items-center gap-2 rounded-md w-full py-1 px-1'>
                <div className='flex justify-between w-full items-center gap-2 px-1'>
                    <input type="text"
                           ref={ref}
                           className='bg-transparent w-full placeholder:text-sm placeholder:text-neutral-600 text-xs'
                           onChange={change}
                           placeholder={placeholder}/>
                    <ConditionalRenderer isOpen={Boolean(symbol)}>
                        <span className='text-xs text-neutral-400 font-medium'>{symbol}</span>
                    </ConditionalRenderer>
                </div>
                <DefaultButton classType='1' onClick={submit}>Submit</DefaultButton>
            </div>
            <ConditionalRenderer isOpen={Boolean(maxValue)}>
                <Percentages setter={setPercentage}/>
            </ConditionalRenderer>
        </div>
    )
}


function ContentContainer({info, isLoading, additionalChildren, isOpen, openOrClose}: Readonly<{
    info: { title: string, infoData: InfoData },
    isLoading: boolean,
    additionalChildren?: ReactNode
    isOpen?: boolean,
    openOrClose?: () => any
}>) {

    const {infoData, title} = info;
    return (
        <button className='flex items-center justify-between gap-2 w-full' onClick={openOrClose}>
            <div className='flex items-center justify-between gap-2 w-full'>
                <div className='flex items-center gap-1 w-full'>
                    <p className='whitespace-nowrap text-sm'>{title}</p>
                    <ConditionalRenderer isOpen={isLoading}><Loading percent={80}/></ConditionalRenderer>
                </div>
                {additionalChildren}
                <ConditionalRenderer isOpen={!Boolean(isOpen)}>
                    <InfoBox info={infoData} isRight className='w-[1000%]'/>
                </ConditionalRenderer>
            </div>
            <ConditionalRenderer isOpen={Boolean(isOpen)}>
                <XmarkSVG onClick={openOrClose} isSmall/>
            </ConditionalRenderer>
        </button>
    )
}

function ActionContainer({children, isOpen, onClick}: { children: ReactNode, isOpen?: boolean, onClick?: () => any }) {
    return (
        <button
            className={`relative flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-900 ${Boolean(isOpen) ? "" : "hover:bg-neutral-800"} px-4 w-full`}
            onClick={onClick}>
            {children}
        </button>
    )
}
