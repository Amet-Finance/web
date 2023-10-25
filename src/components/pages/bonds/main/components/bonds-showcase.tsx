import {useEffect, useState} from "react";
import Styles from "@/components/pages/bonds/main/components/index.module.css";
import Link from "next/link";
import Bond from "@/components/pages/bonds/utils/bond";
import {join} from "@/modules/utils/styles";
import Loading from "@/components/utils/loading";
import {getBondsHandler} from "@/components/pages/bonds/utils/bond/functions";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import {useRouter} from "next/router";
import ArrowSVG from "../../../../../../public/svg/utils/arrow";

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
        </div>
    </>
}

function BondsScreen() {
    const account = useSelector((item: RootState) => item.account);
    const {chainId} = account;
    const [bonds, setBonds] = useState({
        isLoading: false,
        limit: 6,
        skip: 0,
        data: [] as any
    })

    const {data, skip, limit, isLoading} = bonds

    const bondsHandler = [bonds, setBonds]

    useEffect(() => {
        const config = {
            skip,
            limit,
            chainId
        }

        const interval = getBondsHandler(bondsHandler, config);
        return () => {
            clearInterval(interval)
        }

    }, [chainId, skip, limit])

    if (isLoading) {
        return <div className={Styles.loader}><Loading/></div>
    }

    if (!data?.length) {
        return <div className='flex justify-center items-center bg-g1 w-full h-52 rounded'>
            <span className='text-4xl'>There are no bonds, yet!</span>
        </div>
    }

    return <>
        <div className='relative p-4 pb-10'>
            <div className="grid xl1:grid-cols-3 lg1:grid-cols-2 md:grid-cols-1 gap-6  sm1:w-max sm:w-full">
                {data.map((item: any, index: number) => <Bond info={item} key={index}/>)}
            </div>
            <Link href={`/bonds/explore`} className='w-full'>
                <div className='flex justify-center items-center cursor-pointer w-full left-0 lg:top-[90%] md:top-[97%] sm:top-[97%]'>
                    <div className='flex gap-2 justify-center items-end z-10 w-full blur-0'>
                        <span className='text-2xl font-bold'>Explore More Bonds</span>
                        <ArrowSVG/>
                    </div>
                    <div className='absolute blur-2xl bg-black  w-full h-32'/>
                </div>
            </Link>
        </div>
    </>
}
