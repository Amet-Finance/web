import {useEffect, useState} from "react";
import Styles from "@/components/pages/bonds/main/components/index.module.css";
import Link from "next/link";
import {getWeb3Instance} from "@/modules/web3";
import * as CloudAPI from "@/modules/cloud-api";
import Bond from "@/components/pages/bonds/utils/bond";
import {join} from "@/modules/utils/styles";
import Loading from "@/components/utils/loading";

const {toBN} = getWeb3Instance().utils;

export default function BondsShowcase() {
    return <>
        <div className={Styles.actions}>
            <div className={Styles.actions}>
                <h1>Explore New Bonds</h1>
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
    const [bonds, setBonds] = useState({
        isLoading: false,
        data: [] as any
    })

    useEffect(() => {
        setBonds({
            ...bonds,
            isLoading: true
        });


        CloudAPI.getBonds()
            .then(res => {
                setBonds({
                    data: res,
                    isLoading: false
                })
            })
    }, [])

    if (bonds.isLoading) {
        return <div className={Styles.loader}><Loading/></div>
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