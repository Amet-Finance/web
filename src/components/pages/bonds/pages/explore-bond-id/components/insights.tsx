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

    return (
        <div className="grid grid-cols-12 justify-between gap-2 rounded-3xl p-6 border border-neutral-900 w-full">
            <ConditionalRenderer isOpen={contractInfo.isSettled}>
                <InfoDescription
                    width={300}
                    isRight
                    className='flex justify-center items-center col-span-1 cursor-help'
                    text={TagTexts.Settled}>
                    <SecureSVG size={24}/>
                </InfoDescription>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={isSoldOut}>
                <InfoDescription
                    width={200}
                    isRight
                    className='flex justify-center items-center col-span-1 cursor-help'
                    text={TagTexts.SoldOut}>
                    <SoldOutSVG size={24}/>
                </InfoDescription>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={isIBO}>
                <InfoDescription
                    width={500}
                    className='flex justify-center items-center col-span-1 cursor-help bg-amber-400 w-min px-4 p-1 rounded-xl ml-8 border-t-2 border-neutral-900'
                    text={TagTexts.IBO}
                    isRight>
                    <b className='text-sm whitespace-nowrap'>IBO</b>
                </InfoDescription>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={Boolean(additionalInfo?.boostedMultiplier)}>
                <InfoDescription
                    width={200}
                    text={TagTexts.Boosted}
                    className='flex justify-center items-center col-span-1 cursor-help bg-rose-600 w-min px-4 p-1 rounded-xl ml-8 border-t-2 border-neutral-900'
                    isRight>
                    <b className='text-sm whitespace-nowrap'>Boosted {additionalInfo?.boostedMultiplier}X</b>
                </InfoDescription>
            </ConditionalRenderer>
        </div>
    )
}
