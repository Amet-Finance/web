import {ContractExtendedFormat} from "@/modules/api/contract-type";
import {ConditionalRenderer} from "@/components/utils/container";
import {priorityBonds} from "@/modules/web3/featured";
import {BondContractTypes} from "@/modules/web3/constants";
import {InfoDescription} from "@/components/utils/info-box";
import SecureSVG from "../../../../../../../public/svg/utils/secure";
import SoldOutSVG from "../../../../../../../public/svg/utils/sold-out";
import {TagTexts} from "@/components/pages/bonds/utils/constants";

export default function Insights({bondDetailed}: { bondDetailed: ContractExtendedFormat }) {
    // todo handle the case if this is empty, maybe return null
    const {contractInfo} = bondDetailed;

    const {totalBonds, purchased, contractAddress, chainId} = contractInfo
    const additionalInfo = priorityBonds[chainId][contractAddress.toLowerCase()];

    const isIBO = additionalInfo?.type === BondContractTypes.IBO;
    const isSoldOut = totalBonds === purchased;

    if(!additionalInfo) return null;

    return (
        <div
            className="grid md-lg:grid-cols-6 sm:grid-cols-3 grid-cols-2 justify-between gap-2 rounded-3xl p-6 border border-neutral-900 w-full">
            <ConditionalRenderer isOpen={contractInfo.isSettled}>
                <InfoDescription
                    width={300}
                    isRight
                    className='flex justify-center items-center col-span-1 cursor-help bg-green-500 px-4 p-1 rounded-xl border-t-2 border-neutral-900 w-full'
                    text={TagTexts.Settled}>
                    <b className='text-sm whitespace-nowrap'>Settled</b>
                </InfoDescription>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={isSoldOut}>
                <InfoDescription
                    width={200}
                    isRight
                    className='flex justify-center items-center col-span-1 cursor-help bg-neutral-500 px-4 p-1 rounded-xl border-t-2 border-neutral-900 w-full'
                    text={TagTexts.SoldOut}>
                    <b className='text-sm whitespace-nowrap'>Sold Out</b>
                </InfoDescription>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={isIBO}>
                <InfoDescription
                    width={500}
                    className='flex justify-center items-center col-span-1 cursor-help bg-amber-400 px-4 p-1 rounded-xl border-t-2 border-neutral-900 w-full'
                    text={TagTexts.IBO}
                    isRight>
                    <b className='text-sm whitespace-nowrap'>Initial Bond Offering</b>
                </InfoDescription>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={Boolean(additionalInfo?.boostedMultiplier)}>
                <InfoDescription
                    width={200}
                    text={TagTexts.Boosted}
                    className='flex justify-center items-center col-span-1 cursor-help bg-rose-600 px-4 p-1 rounded-xl  border-t-2 border-neutral-900 w-full'
                    isRight>
                    <b className='text-sm whitespace-nowrap'>Boosted {additionalInfo?.boostedMultiplier}X</b>
                </InfoDescription>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={Boolean(additionalInfo?.verifiedIssuer)}>
                <InfoDescription
                    width={200}
                    text={TagTexts.VerifiedIssuer}
                    className='flex justify-center items-center col-span-1 cursor-help bg-blue-600  px-4 p-1 rounded-xl border-t-2 border-neutral-900 w-full'
                    isRight>
                    <b className='text-sm whitespace-nowrap'>Verified Issuer</b>
                </InfoDescription>
            </ConditionalRenderer>
        </div>
    )
}
