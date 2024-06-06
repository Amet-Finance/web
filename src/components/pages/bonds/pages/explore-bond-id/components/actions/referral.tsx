import {ContractCoreDetails} from "@/modules/api/contract-type";
import {useEffect, useState} from "react";
import {DefaultButton} from "@/components/utils/buttons";
import {getChain} from "@/modules/utils/chain";
import {ReferralInfo} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/types";
import {nop} from "@/modules/utils/function";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {Loading} from "@/components/utils/loading";
import {TxTypes} from "@/modules/web3/constants";
import {toast} from "react-toastify";
import ModalStore from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {useTransaction} from "@/modules/utils/transaction";
import {copyReferralCode} from "@/components/pages/bonds/pages/explore-bond-id/utils";
import CopySVG from "../../../../../../../../public/svg/utils/copy";
import {ToggleBetweenChildren} from "@/components/utils/container";
import {FixedFlexIssuerController, FixedFlexVaultController, VaultFeeDetails} from "amet-utils";
import {BigNumber} from "ethers";
import {useAccountExtended} from "@/modules/utils/address";
import {getIssuerContract} from "@/modules/web3/util";

export default function ReferralTab({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {

    const {contractAddress, chainId, purchase} = contractInfo;
    const {address, open} = useAccountExtended();
    const chain = getChain(chainId);

    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isBlacklisted, setIsBlacklisted] = useState(false);
    const [vaultAddress, setVaultAddress] = useState("");
    const [feeDetails, setFeeDetails] = useState({} as VaultFeeDetails)
    const [referralInfo, setReferralInfo] = useState({} as ReferralInfo)

    const rewardsLeft = referralInfo.quantity - referralInfo.claimed
    const totalReward = rewardsLeft * purchase.amountClean * feeDetails.referrerRewardRate / 1000;

    const isBlocked = isBlacklisted;
    let title = "Claim Rewards"
    if (isBlacklisted) title = "Address Blocked";
    if (!rewardsLeft) title = "Copy Your Referral Link";
    if (!address) title = "Connect";


    const {submitTransaction} = useTransaction(chainId, TxTypes.ClaimReferralRewards, {vaultAddress, contractAddress})

    useEffect(() => {
        if (chain) {
            FixedFlexIssuerController.getVaultContract(chain.id, getIssuerContract(chain.id))
                .then(response => setVaultAddress(response.address))
                .catch(nop)
        }
    }, [chain]);

    useEffect(() => {
        if (chain && address && vaultAddress) {
            setIsDataLoading(true)
            const refPromise = FixedFlexVaultController.getReferralRewards(chain.id, vaultAddress, contractAddress, address)
                .then(result => setReferralInfo(result))
                .catch(nop)

            const restrictionPromise = FixedFlexVaultController.isAddressRestricted(chain.id, vaultAddress, address)
                .then((status) => setIsBlacklisted(status))
                .catch(nop)

            const feeDetailsPromise = FixedFlexVaultController.getBondFeeDetails(chain.id, vaultAddress, contractAddress)
                .then(response => setFeeDetails({...response, issuanceFee: BigNumber.from(0)}))
                .catch(nop)

            Promise.allSettled([refPromise, restrictionPromise, feeDetailsPromise]).then(() => setIsDataLoading(false));

        }
    }, [address, contractAddress, chain, vaultAddress])


    async function claimReferralRewards() {
        if (!address) return open();
        if (isBlocked) return toast.error("Action Is Blocked.");
        if (!rewardsLeft) return copyReferralCode(address)

        const result = await submitTransaction();
        if (result) ModalStore.openModal(ModalTypes.ClaimReferralRewards, {
            address,
            totalReward,
            symbol: purchase.symbol
        });
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
                <DefaultButton disabled={isBlocked}
                               onClick={claimReferralRewards} classType='1'>
                    <span>{title}</span>
                </DefaultButton>
                <DefaultButton onClick={copyReferralCode.bind(null, address)} classType="2">
                    <CopySVG size={16}/>
                </DefaultButton>
            </div>
        </div>
    )
}
