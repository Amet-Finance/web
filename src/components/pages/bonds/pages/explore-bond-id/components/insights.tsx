import {ContractExtendedFormat} from "@/modules/api/contract-type";
import {ConditionalRenderer} from "@/components/utils/container";
import {priorityBonds} from "@/modules/web3/featured";
import {BondContractTypes} from "@/modules/web3/constants";
import {InfoDescription} from "@/components/utils/info-box";
import {TagTexts} from "@/components/pages/bonds/utils/constants";
import {useEffect, useState} from "react";
import CloudAPI from "@/modules/api/cloud";
import {User} from "@/modules/api/type";
import {nop} from "@/modules/utils/function";
import {format, formatLargeNumber} from "@/modules/utils/numbers";

export default function Insights({bondDetailed}: { bondDetailed: ContractExtendedFormat }) {
    const {contractInfo} = bondDetailed;

    const {totalBonds, purchased, contractAddress, chainId} = contractInfo
    const additionalInfo = priorityBonds[chainId][contractAddress.toLowerCase()];

    const [owner, setOwner] = useState<User>()

    const isIBO = additionalInfo?.type === BondContractTypes.IBO;
    const isSoldOut = totalBonds === purchased;

    useEffect(() => {
        CloudAPI.getUser(bondDetailed.contractInfo.owner, {includeGitcoinScore: true})
            .then(response => setOwner(response))
            .catch(nop)
    }, [])

    console.log(owner)
    if (!additionalInfo) return null;

    return (
        <div
            className="grid lg:grid-cols-5 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 justify-between gap-2 rounded-3xl p-6 border border-neutral-900 w-full">
            <ConditionalRenderer isOpen={contractInfo.isSettled}>
                <InfoDescription
                    width={100}
                    isRight
                    className='flex justify-center items-center col-span-1 cursor-help bg-cyan-500 px-4 p-1 rounded-xl border-t-2 border-neutral-900 w-full'
                    text={TagTexts.Settled}>
                    <b className='text-sm whitespace-nowrap'>Settled</b>
                </InfoDescription>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={isSoldOut}>
                <InfoDescription
                    width={100}
                    isRight
                    className='flex justify-center items-center col-span-1 cursor-help bg-neutral-500 px-4 p-1 rounded-xl border-t-2 border-neutral-900 w-full'
                    text={TagTexts.SoldOut}>
                    <b className='text-sm whitespace-nowrap'>Sold Out</b>
                </InfoDescription>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={Boolean(owner?.gitcoinScore)}>
                <InfoDescription
                    width={100}
                    text={TagTexts.GitcoinPassport}
                    className='flex justify-center items-center col-span-1 cursor-help bg-emerald-600  px-4 p-1 rounded-xl border-t-2 border-neutral-900 w-full'
                    isRight>
                    <b className='text-sm whitespace-nowrap'>Gitcoin Passport: {formatLargeNumber(Number(owner?.gitcoinScore))}</b>
                </InfoDescription>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={isIBO}>
                <InfoDescription
                    width={100}
                    className='flex justify-center items-center col-span-1 cursor-help bg-amber-400 px-4 p-1 rounded-xl border-t-2 border-neutral-900 w-full'
                    text={TagTexts.IBO}
                    isRight>
                    <b className='text-sm whitespace-nowrap'>IBO</b>
                </InfoDescription>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={Boolean(additionalInfo?.boostedMultiplier)}>
                <InfoDescription
                    width={100}
                    text={TagTexts.Boosted}
                    className='flex justify-center items-center col-span-1 cursor-help bg-rose-600 px-4 p-1 rounded-xl  border-t-2 border-neutral-900 w-full'
                    isRight>
                    <b className='text-sm whitespace-nowrap'>Boosted {additionalInfo?.boostedMultiplier}X</b>
                </InfoDescription>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={Boolean(additionalInfo?.verifiedIssuer)}>
                <InfoDescription
                    width={100}
                    text={TagTexts.VerifiedIssuer}
                    className='flex justify-center items-center col-span-1 cursor-help bg-blue-600  px-4 p-1 rounded-xl border-t-2 border-neutral-900 w-full'>
                    <b className='text-sm whitespace-nowrap'>Verified Issuer</b>
                </InfoDescription>
            </ConditionalRenderer>
        </div>
    )
}
