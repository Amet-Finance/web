import {useEffect, useState} from "react";
import Styles from "@/components/pages/bonds/main/components/index.module.css";
import Link from "next/link";
import * as CloudAPI from "@/modules/cloud-api";
import Bond from "@/components/pages/bonds/utils/bond";
import {join} from "@/modules/utils/styles";
import Loading from "@/components/utils/loading";
import {getBondsHandler} from "@/components/pages/bonds/utils/bond/functions";
import {DEFAULT_CHAIN_ID} from "@/modules/web3/constants";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";

export default function BondsShowcase() {
    return <>
        <div className={Styles.actions}>
            <div className={Styles.actions}>
                <h2 className='text-3xl font-bold'>Explore New Bonds</h2>
                <p className={join([Styles.bondsText, Styles.gray1])}>Stay ahead of the curve by exploring our freshly
                    launched bonds. <br/> These opportunities are your ticket to the forefront of decentralized finance
                    innovation.</p>
            </div>
            <BondsScreen/>
            <ShowMore/>
        </div>
    </>
}

function BondsScreen() {
    const account = useSelector((item: RootState) => item.account);
    const [bonds, setBonds] = useState({
        isLoading: false,
        limit: 20,
        skip: 0,
        data: [] as any
    })

    const bondsHandler = [bonds, setBonds]

    useEffect(() => {
        const config = {
            skip: bonds.skip,
            limit: bonds.limit,
            chainId: account.chainId
        }
        const interval = getBondsHandler(bondsHandler, config);
        return () => {
            clearInterval(interval)
        }

    }, [account.chainId, bonds.skip, bonds.limit])

    if (bonds.isLoading) {
        return <div className={Styles.loader}><Loading/></div>
    }

    if (!bonds?.data?.length) {
        return <div className='flex justify-center items-center bg-g1 w-full h-52 rounded'>
            <span className='text-4xl'>There are no bonds, yet!</span>
        </div>
    }

    return <>
        <div className={Styles.bonds}>
            {bonds.data.map((item: any, index: number) => <Bond info={item} key={index}/>)}
        </div>
    </>
}

function ShowMore() {
    return <>
        <Link href={`/bonds/explore`}>
            <div className={Styles.showMore}>
                <span>Explore more bonds</span>
            </div>
        </Link>
    </>
}