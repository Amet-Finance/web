import {ContractEssentialFormat} from "@/modules/cloud-api/contract-type";
import {useEffect, useState} from "react";
import {DefaultButton} from "@/components/utils/buttons";
import FixedFlexVaultController from "@/modules/web3/fixed-flex/v2/vault";
import {getChain} from "@/modules/utils/wallet-connect";
import {useAccount} from "wagmi";
import {ReferralInfo} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/types";
import {nop} from "@/modules/utils/function";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {Loading} from "@/components/utils/loading";
import {TxTypes} from "@/modules/web3/constants";
import {toast} from "react-toastify";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {BondFeeDetails} from "@/modules/web3/fixed-flex/v2/types";
import {useTransaction} from "@/modules/utils/transaction";
import {copyReferralCode} from "@/components/pages/bonds/pages/explore-bond-id/utils";
import CopySVG from "../../../../../../../../public/svg/utils/copy";
import {ToggleBetweenChildren} from "@/components/utils/container";

// todo here also include a few cases
// 1. if there's no reward give the referral link so the person can refer
// 4. After claiming ask him to share in Twitter with a modal or something similar content

export default function ReferralTab({contractInfo}: Readonly<{ contractInfo: ContractEssentialFormat }>) {

    const {_id, purchase} = contractInfo;
    const {address} = useAccount();
    const [contractAddress, chainId] = _id.split("_");
    const chain = getChain(chainId);

    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isBlacklisted, setIsBlacklisted] = useState(false);
    const [vaultAddress, setVaultAddress] = useState();
    const [feeDetails, setFeeDetails] = useState({} as BondFeeDetails)
    const [referralInfo, setReferralInfo] = useState({} as ReferralInfo)

    const rewardsLeft = referralInfo.quantity - referralInfo.claimed
    const totalReward = rewardsLeft * purchase.amountClean * feeDetails.referrerRewardRate / 1000;

    const isBlocked = isBlacklisted || !Boolean(rewardsLeft) || !Boolean(totalReward);
    let title = "Claim Rewards"
    if (isBlacklisted) title = "Address Blocked";
    if (!rewardsLeft && referralInfo.quantity) title = "Already Repaid";


    const {submitTransaction} = useTransaction(chainId, TxTypes.ClaimReferralRewards, {vaultAddress, contractAddress})

    useEffect(() => {
        if (chain) {
            FixedFlexVaultController.getVault(chain)
                .then(response => setVaultAddress(response.address))
                .catch(nop)
        }
    }, [chain]);

    useEffect(() => {
        if (chain && address && vaultAddress) {
            setIsDataLoading(true)
            const refPromise = FixedFlexVaultController.getReferralRewards(chain, vaultAddress, contractAddress, address)
                .then(result => {
                    if (result) setReferralInfo(result)
                }).catch(nop)

            const restrictionPromise = FixedFlexVaultController.isAddressRestricted(chain, vaultAddress, address)
                .then((status) => setIsBlacklisted(status))
                .catch(nop)

            const feeDetailsPromise = FixedFlexVaultController.getBondFeeDetails(chain, vaultAddress, contractAddress)
                .then(response => setFeeDetails(response))
                .catch(nop)

            Promise.allSettled([refPromise, restrictionPromise, feeDetailsPromise]).then(() => setIsDataLoading(false));

        }
    }, [address, contractAddress, chain, vaultAddress])


    async function claimReferralRewards() {
        if (isBlocked) return toast.error("Action Is Blocked.");

        const result = await submitTransaction();
        if (result) openModal(ModalTypes.ClaimReferralRewards, {address, totalReward, symbol: purchase.symbol});
    }


    return (
        <div className='flex flex-col gap-4 justify-end h-full w-full'>
            <div className='flex flex-col gap-1'>
                <span className='text-neutral-400 text-sm'>You have accumulated</span>
                <ToggleBetweenChildren isOpen={isDataLoading}>
                    <Loading percent={40}/>
                    <span
                        className='text-3xl text-green-500 font-bold'>{formatLargeNumber(totalReward)} {purchase.symbol}</span>
                </ToggleBetweenChildren>
                <span className='text-neutral-400 text-sm'>in referral rewards with Amet Finance</span>
            </div>
            <div className='flex gap-1 items-center'>
                <DefaultButton disabled={isBlocked} onClick={claimReferralRewards} classType='1'>
                    <span>{title}</span>
                </DefaultButton>
                <DefaultButton onClick={copyReferralCode.bind(null, address)} classType="2">
                    <CopySVG size={16}/>
                </DefaultButton>
            </div>
        </div>
    )
}
