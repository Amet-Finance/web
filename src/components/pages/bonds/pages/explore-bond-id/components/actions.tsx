import {ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {useAccount, useNetwork, useSendTransaction, useSwitchNetwork} from "wagmi";
import {useEffect, useState} from "react";
import {Balance} from "@/components/pages/bonds/pages/explore-bond-id/type";
import CloudAPI from "@/modules/cloud-api";
import ArrowBasicSVG from "../../../../../../../public/svg/utils/arrow-basic";
import {getChain} from "@/modules/utils/wallet-connect";
import BigNumber from "bignumber.js";
import {TxTypes} from "@/modules/web3/constants";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {getAllowance, getTokenBalance} from "@/modules/web3/tokens";
import {toast} from "react-toastify";
import Link from "next/link";
import {URLS} from "@/modules/utils/urls";
import {BasicButton} from "@/components/utils/buttons";
import Loading from "@/components/utils/loading";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import {useRouter} from "next/router";

export default function ActionsContainer({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {

    const Tabs = {
        Purchase: "Purchase",
        Redeem: "Redeem",
        More: {
            Manage: "Manage",
            ReferralRewards: "Referral Rewards"
        }
    }

    const {address} = useAccount();
    const [balance, setBalance] = useState({} as Balance);
    const [selected, setSelected] = useState(Tabs.Purchase);

    const total = Object.values(balance[contractInfo._id] || {}).reduce((acc: number, value: number) => acc += value, 0);

    // todo can optimize here as well, get only for that _id
    useEffect(() => {
        const getBalances = () => {
            if (address) {
                CloudAPI.getBalance(address)
                    .then(response => {
                        if (response?.[contractInfo._id]) {
                            setBalance({
                                [contractInfo._id]: response[contractInfo._id]
                            })
                        }
                    })
            }
        }

        getBalances();
        const interval = setInterval(getBalances, UPDATE_INTERVAL);
        return () => clearInterval(interval);
    }, [address, contractInfo._id]);


    function Tab({title, titleSecondary, className}: { title: string, titleSecondary?: string, className?: string }) {
        return <>
            <span
                className={`cursor-pointer text-neutral-400 whitespace-nowrap first-letter:uppercase hover:text-white ${className} ${selected === title && "text-white"}`}
        onClick={() => setSelected(title)}>{title}{titleSecondary}</span></>
    }

    function TabSelector({title}: { title: string }) {
        switch (title) {
            case Tabs.Purchase:
                return <PurchaseTab contractInfo={contractInfo}/>
            case Tabs.Redeem:
                return <RedeemTab contractInfo={contractInfo} balance={balance}/>
            case Tabs.More.Manage:
                return <ManageTab/>
            case Tabs.More.ReferralRewards:
                return <ReferralRewardsTab/>
            default:
                return <></>
        }
    }

    return <>
        <div
            className='lg:col-span-4 sm:col-span-12 flex flex-col gap-12 rounded-3xl p-8 py-4 border border-neutral-900 w-full h-full'>
    <div className='flex gap-4 items-center'>
    <Tab title={Tabs.Purchase}/>
    <Tab title={Tabs.Redeem} titleSecondary={`(${total})`}/>
    <div className='group relative'>
    <div className='group flex gap-1 items-center cursor-pointer'>
    <span className='text-neutral-400 group-hover:text-white'>More</span>
        <ArrowBasicSVG sPercentage={-25} classname='stroke-neutral-400 group-hover:stroke-white'/>
        </div>
        <div
    className='group-hover:flex absolute top-full right-0 hidden flex-col bg-neutral-900 p-2 gap-2 rounded-lg'>
        {Object.values(Tabs.More).map(title => <Tab title={title} key={title}
            className="hover:bg-neutral-800 px-2 rounded-md"/>)}
    </div>
    </div>
    </div>
    <div className='flex w-full h-full'>
    <TabSelector title={selected}/>
    </div>
    </div>
    </>
}

function PurchaseTab({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {
    // todo add referrer when purchasing from query param

    const {_id, investment, total, purchased} = contractInfo;
    const [contractAddress, chainId] = _id.toLowerCase().split("_");
    const {address} = useAccount();
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork({chainId: Number(chainId)});
    const chain = getChain(chainId)
    const router = useRouter();

    const TitleTypes = {
        Purchase: "Purchase",
        Approve: "Approve",
        NotEnough: "Not Enough Bonds to Purchas",
        SoldOut: "Sold Out"
    }

    const [isLoadingEffect, setLoadingEffect] = useState(false)
    const [allowance, setAllowance] = useState("0")
    const [amount, setAmount] = useState(0);

    const currentAllowance = BigNumber(allowance.toString())
    const required = BigNumber(amount).times(BigNumber(investment.amount))
    const needed = currentAllowance.minus(required);

    const isApprove = needed.isLessThan(BigNumber(0))
    const isSoldOut = total === purchased;


    const purchasingMoreThenAllowed = purchased + amount > total
    let blockClick = purchasingMoreThenAllowed || amount <= 0

    let title = TitleTypes.Purchase
    if (isApprove) title = TitleTypes.Approve
    if (purchasingMoreThenAllowed) title = TitleTypes.NotEnough
    if (isSoldOut) title = TitleTypes.SoldOut

    const initialReferrer = `${router.query.ref}`
    const referrer = initialReferrer.toLowerCase() !== address?.toLowerCase() ? initialReferrer : undefined;
    const transactionType = isApprove ? TxTypes.ApproveToken : TxTypes.PurchaseBonds;
    const config = isApprove ?
        {contractAddress: investment.contractAddress, spender: contractAddress, value: `0x${required.toString(16)}`} :
        {contractAddress: contractAddress, count: amount, referrer: referrer}

    const txConfig = getContractInfoByType(chain, transactionType, config)
    const {sendTransactionAsync, isLoading} = useSendTransaction(txConfig)

    console.log(config)
    useEffect(() => {
        if (chain && address) {
            setLoadingEffect(true)
            getAllowance(chain, investment.contractAddress, address, contractAddress)
                .then(response => setAllowance(response.toString()))
                .finally(() => setLoadingEffect(false))
        }
    }, [amount, chain, address, contractAddress, investment.contractAddress]);

    function onChange(event: any) {
        const {value} = event.target;
        setAmount(Number(value))
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
        <div className='flex flex-col gap-4 justify-between w-full'>
    <div className='flex flex-col'>

        </div>
        <div className='flex flex-col gap-4'>
    <div className='flex flex-col gap-2'>
    <div className='flex items-center justify-between border border-neutral-800 rounded-md py-1.5 px-4'>
    <input type="number"
    id='amount'
    className='bg-transparent placeholder:text-neutral-600 w-full'
    onChange={onChange}
    placeholder='Enter Number of Bonds to Purchase'/>
        </div>
        <p className='text-xs text-neutral-600'>You confirm that you have read and understood the <Link
    href={URLS.TermsOfService} target="_blank"><u>Terms and Conditions.</u></Link></p>
    </div>
    <BasicButton onClick={submit} isBlocked={blockClick}>
    <div className='flex items-center gap-2'>
    {(isLoading) && <Loading percent={75} color="#000"/>}
    {title}
    </div>
    </BasicButton>
    </div>
    </div>
    </>
}

function RedeemTab({contractInfo, balance}: { contractInfo: ContractExtendedInfoFormat, balance: Balance }) {

    const {_id, interest} = contractInfo;
    const [contractAddress, chainId] = _id.toLowerCase().split("_")
    const chain = getChain(chainId)

    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork({chainId: chain?.id});

    const [bondIndexes, setBondIndexes] = useState<string[]>([])
    const [redemptionCount, setRedemptionCount] = useState(0);
    const [interestBalance, setInterestBalance] = useState(0);

    const contractBalance = balance[_id] || {}
    const totalBalance = Object.values(contractBalance).reduce((acc: number, value: number) => acc += value, 0);
    const notEnoughLiquidity = interestBalance < redemptionCount * interest.amountClean
    const redeemingMoreThenAvailable = redemptionCount > totalBalance

    const blockClick = redeemingMoreThenAvailable || notEnoughLiquidity || redemptionCount <= 0;
    let title = "Redeem"
    if (notEnoughLiquidity) title = "Not Enough Liquidity"
    if (redeemingMoreThenAvailable) title = "Max Bonds Reached"


    const config = {
        contractAddress,
        bondIndexes,
        redemptionCount,
        isCapitulation: false // todo add capitulation as well
    }
    const txConfig = getContractInfoByType(chain, TxTypes.RedeemBonds, config)
    const {sendTransactionAsync, isLoading} = useSendTransaction(txConfig)

    useEffect(() => {
        const getLiquidity = () => {
            if (chain) {
                getTokenBalance(chain, interest.contractAddress, contractAddress)
                    .then(response => {
                        setInterestBalance(BigNumber(response.toString()).div(BigNumber(10).pow(BigNumber(interest.decimals))).toNumber())
                    })
            }
        }

        getLiquidity();
        const interval = setInterval(getLiquidity, UPDATE_INTERVAL);
        return () => clearInterval(interval);
    }, [chain, contractAddress, interest.contractAddress, interest.decimals]);


    console.log(bondIndexes, redemptionCount)
    function onChange(event: any) {
        const value = Number(event.target.value);

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
    onChange={onChange}
    placeholder='Enter Number of Bonds to Redeem'/>
        </div>
        <p className='text-xs text-neutral-600'>You confirm that you have read and understood the <Link
    href={URLS.TermsOfService} target="_blank"><u>Terms and Conditions.</u></Link></p>
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

function ManageTab() {
    return <><span>ManageTab Ping</span></>
}

function ReferralRewardsTab() {
    return <><span>ReferralRewardsTab Ping</span></>
}

