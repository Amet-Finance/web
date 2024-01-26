import Image from "next/image";
import Link from "next/link";
import {useRef, useState} from "react";
import {BasicButton} from "@/components/utils/buttons";
import {URLS} from "@/modules/utils/urls";
import {ARTICLES, BOND_CARDS, FAQ_QUESTIONS} from "@/components/pages/main/constants";
import {Article} from "@/components/pages/main/types";
import {shortenString} from "@/modules/utils/string";
import ArrowCurveSVG from "../../../../public/svg/utils/arrow-curve";
import MinusSVG from "../../../../public/svg/utils/minus";
import PlusSVG from "../../../../public/svg/utils/plus";
import BondCard from "@/components/pages/bonds/utils/bond-card";
import {DiscordIcon} from "../../../../public/svg/social/discord";


export default function Home() {
    return <>
        <div className='relative flex flex-col justify-center w-full'>
            <LandingSection/>
            <OnChainBondsSection/>
            <BondProperties/>
            <TradeOnChainBondsSection/>
            <InTheNewsSection/>
            <FAQ/>
            <Partnerships/>
        </div>
    </>
}

function LandingSection() {
    return <>
        <Link href='/bonds'>
            <div
                className="relative flex flex-col justify-center items-center gap-12 min-h-[85vh] w-full px-4">
                <h1 className='bg-black w-full text-5xl font-semibold text-center leading-[1.2] z-10 py-4 px-4'>Simplified
                    Bond Investments for
                    Everyone</h1>
                <div className='h-px w-52 bg-neutral-100 z-10 '/>
                <p className='bg-black w-full  max-w-5xl text-center text-neutral-200 z-10 px-4 py-4'>Welcome to the
                    world
                    of effortless on-chain bond
                    investments. Amet Finance is designed to democratize the bond market, making it easy and accessible
                    for
                    all. With us, bond investments are no longer complex and exclusive.</p>

                <div className='flex group'>
                    <button
                        className='bg-white text-black rounded-full px-8 py-4 font-semibold group-hover:bg-neutral-300 z-10'>{`Let's Bond`}</button>
                    <button className='bg-white rounded-full px-8 py-4 text-xl group-hover:bg-neutral-300 z-10'>
                        <ArrowCurveSVG/>
                    </button>
                </div>
                <div
                    className='absolute top-0 h-[85vh] left-0 w-full md:rounded-b-[6rem] sm:rounded-3xl border border-r-0 border-l-0 border-t-0 border-b-neutral-700 '>
                    <Image src='/pngs/pexels-karolina-grabowska-5980921.jpg' alt="" width="5000" height='5000'
                           className='object-cover w-full h-full md:rounded-b-[6rem] sm:rounded-3xl blur-xs saturate-0'/>
                </div>
            </div>
        </Link>
    </>
}

function OnChainBondsSection() {

    function Box({props}: {
        props: {
            imageSrc: string,
            title: string,
            paragraph: string
        }
    }) {
        const {imageSrc, title, paragraph} = props;
        return <>
            <div
                className="flex flex-col justify-between gap-16 items-start py-12 px-7 rounded-3xl border border-neutral-900 shadow shadow-xl hover:shadow-neutral-900 bg-gradient-to-bl from-neutral-950 to-black hover:border-neutral-800 hover:scale-105 cursor-pointer ">
                <Image src={imageSrc} width={73} height={92} alt={title}/>
                <div className='flex flex-col gap-9'>
                    <span className='font-medium text-2xl'>{title}</span>
                    <p className='text-g'>{paragraph}</p>
                </div>
            </div>
        </>
    }

    return <>
        <div className='flex flex-col justify-center items-center gap-24 py-52'>
            <div className='flex flex-col items-center gap-5 px-4'>
                <h2 className='text-4xl font-medium text-center'>On-Chain Bonds: Smart, Secure, Streamlined</h2>
                <p className='max-w-3xl text-center text-neutral-400 text-center'>{`Step into the future of finance with
                    On-Chain
                    Bonds. Experience cutting-edge security with blockchain's transparency.`}</p>
            </div>
            <div className='grid lg1:grid-cols-3 md:grid-cols-1 gap-7 md:px-52 sm:px-4'>
                <Box props={{
                    imageSrc: '/svg/images/lock.svg',
                    title: "Decentralized Access",
                    paragraph: `Experience financial inclusivity like never before. On-chain bonds give you direct access to bond markets, breaking down the walls of traditional finance.`
                }}/>
                <Box props={{
                    imageSrc: '/svg/images/enhanced.svg',
                    title: "Enhanced Liquidity and Versatility",
                    paragraph: `On-chain bonds offer increased liquidity and versatility, empowering users to trade and manage their bond investments effortlessly, while adapting their strategies to suit their unique needs and preferences.`
                }}/>
                <Box props={{
                    imageSrc: '/svg/images/security.svg',
                    title: "Smart Contract Security",
                    paragraph: `Trust in smart contract technology. On-chain bonds are backed by secure, transparent smart contracts, safeguarding your investments and eliminating intermediaries.`
                }}/>
            </div>

        </div>
    </>
}

function BondProperties() {
    return <>
        <div
            className='flex md:flex-row sm:flex-col justify-between w-full text-white border-t-2 border-b-2 border-w1 bg-[#050505]'>
            <div className='flex flex-col gap-8 z-10 py-20 lg:px-24 md:px-12 sm:px-6'>
                <h3 className='text-4xl font-bold'>Initiate Your Bonds Issuance Now</h3>
                <div className='flex flex-col max-w-xl'>
                    <div className='grid grid-cols-12  gap-0'>
                        <span className='col-span-1 row-span-1 text-center font-bold'>-</span>
                        <span className='col-span-11 row-span-1 font-bold'>Strategize Your Investment:</span>
                        <span className='col-span-1 row-span-2'></span>
                        <span className='col-span-11 row-span-2 text-neutral-200'>Determine your bonds strategy to align with your financial objectives</span>
                    </div>
                    <div className='grid grid-cols-12  gap-0'>
                        <span className='col-span-1 row-span-1 text-center font-bold'>-</span>
                        <span className='col-span-11 row-span-1 font-bold'>Set Your Bonds Terms:</span>
                        <span className='col-span-1 row-span-2'></span>
                        <span className='col-span-11 row-span-2 text-neutral-200'>Easily configure supply, maturity, and interest to fit your needs</span>
                    </div>

                    <div className='grid grid-cols-12  gap-0'>
                        <span className='col-span-1 row-span-1 text-center font-bold'>-</span>
                        <span className='col-span-11 row-span-1 font-bold'>Securely Finalize Issuance:</span>
                        <span className='col-span-1 row-span-2'></span>
                        <span className='col-span-11 row-span-2 text-neutral-200'>Complete your bonds issuance with our streamlined smart contract process</span>
                    </div>
                </div>
                <Link href='/bonds/issue'>
                    <BasicButton wMin>Issue Bonds</BasicButton>
                </Link>
            </div>
            <div className='md:flex sm:hidden w-px bg-neutral-800'/>
            <div className='md:hidden sm:flex h-px w-full bg-neutral-800'/>
            <div className='flex flex-col gap-8 z-10 py-20 lg:px-24 md:px-12 sm:px-6'>
                <h3 className='text-4xl font-bold'>Discover and Acquire Bonds</h3>
                <div className='flex flex-col max-w-xl'>
                    <div className='grid grid-cols-12  gap-0'>
                        <span className='col-span-1 row-span-1 text-center font-bold'>-</span>
                        <span className='col-span-11 row-span-1 font-bold'>Explore Bond Offerings:</span>
                        <span className='col-span-1 row-span-2'></span>
                        <span className='col-span-11 row-span-2 text-neutral-200'>Browse through a variety of bonds issued on our platform to find the ones that best match your investment criteria</span>
                    </div>
                    <div className='grid grid-cols-12  gap-0'>
                        <span className='col-span-1 row-span-1 text-center font-bold'>-</span>
                        <span className='col-span-11 row-span-1 font-bold'>Conduct Your Due Diligence:</span>
                        <span className='col-span-1 row-span-2'></span>
                        <span className='col-span-11 row-span-2 text-neutral-200'>Delve into bond details to ensure they align with your investment goals and risk appetite</span>
                    </div>

                    <div className='grid grid-cols-12  gap-0'>
                        <span className='col-span-1 row-span-1 text-center font-bold'>-</span>
                        <span className='col-span-11 row-span-1 font-bold'>Seamlessly Acquire Bonds:</span>
                        <span className='col-span-1 row-span-2'></span>
                        <span className='col-span-11 row-span-2 text-neutral-200'>Once you have found the right fit, easily purchase bonds with a simple click</span>
                    </div>
                </div>
                <Link href='/bonds/explore'>
                    <BasicButton wMin>Explore Bonds</BasicButton>
                </Link>
                </div>
        </div>
    </>
}

function TradeOnChainBondsSection() {
    return <>
        <div className='relative flex flex-col justify-end min-h-[55rem]'>
            <div className='lg:absolute lg:flex sm:hidden w-[50rem] h-[32rem] top-0 right-0 flex gap-2'>
                <div className='absolute top-12  hover:translate-x-[-5rem]'>
                    <BondCard info={BOND_CARDS[0]} link='/bonds/explore'/>
                </div>
                <div className='absolute top-36 lg:left-40 md:left-50 z-10  hover:translate-x-[-5rem]'>
                    <BondCard info={BOND_CARDS[1]} link='/bonds/explore'/>
                </div>
                <div className='absolute top-56 lg:left-80 md:left-50 z-20  hover:translate-x-[-5rem]'>
                    <BondCard info={BOND_CARDS[2]} link='/bonds/explore'/>
                </div>
            </div>
            <div
                className='lg:hidden md:visible sm:visible relative flex flex-col justify-center items-center pb-52 h-[34rem]'>
                <div className='absolute top-12 hover:translate-x-[-5rem] md:w-[70%] sm:w-full'>
                    <BondCard info={BOND_CARDS[0]} link='/bonds/explore'/>
                </div>
                <div className='absolute top-36 z-10 hover:translate-x-[-5rem] md:w-[70%] sm:w-full'>
                    <BondCard info={BOND_CARDS[1]} link='/bonds/explore'/>
                </div>
                <div className='absolute top-56  z-20 hover:translate-x-[-5rem] md:w-[70%] sm:w-full'>
                    <BondCard info={BOND_CARDS[2]} link='/bonds/explore'/>
                </div>
            </div>
            <div className='flex flex-col justify-end lg:py-52 sm:py-16 lg:px-72 md:px-52 sm:px-6 gap-10 pb-96'>
                <h3 className='text-4xl font-bold'>Trade On-Chain Bonds</h3>
                <p className='max-w-xl text-neutral-400'>Our innovative approach turns each bond into an ERC1155 NFT,
                    unlocking the
                    potential to trade them on leading NFT marketplaces. Discover new opportunities and liquidity
                    options by trading bonds just like you would any valued NFT.</p>
                <Link href={URLS.Docs_Trade_Bonds} target='_blank'>
                    <BasicButton wMin>Learn More in Our Docs</BasicButton>
                </Link>
            </div>
        </div>
    </>
}

function InTheNewsSection() {
    const articlesRef = useRef<any>();
    const scrollToRight = (direction: string) => {
        const actionObject: any = {behavior: "smooth"};
        actionObject.left = direction === 'right' ? -400 : 400;
        articlesRef.current.scrollBy(actionObject);
    }


    return <>
        <div
            className='flex flex-col lg:px-72 md:px-12 sm:px-6 py-16 gap-12 border-t-2 border-b-2 border-w1 bg-[#050505]'>
            <div className='flex justify-between items-center'>
                <h4 className='md:text-3xl sm:text-2xl font-bold'>In The News</h4>
                <div className='flex gap-2 items-center'>
                    <BasicButton isBgGrey onClick={() => scrollToRight('right')}>
                        <ArrowCurveSVG angle={-140} color='#fff'/>
                    </BasicButton>
                    <BasicButton isBgGrey onClick={scrollToRight}>
                        <ArrowCurveSVG angle={40} color='#fff'/>
                    </BasicButton>

                </div>
            </div>

            <div className='flex gap-4 items-stretch overflow-x-auto hide-scrollbar' ref={articlesRef}>
                {ARTICLES.map((article, index) => <ArticleBox article={article} key={index}/>)}
            </div>
        </div>
    </>
}

function ArticleBox({article}: { article: Article }) {
    const {href, image, paragraph, title, date} = article;

    return <>
        <Link href={href} target='_blank' className='cursor-pointer'>

            <div
                className='relative flex flex-col gap-4 rounded-3xl border border-w1 min-w-[400px] max-w-[400px] h-full bg-black '>
                <Image src={image}
                       alt={title}
                       width={400}
                       height={200} className='object-cover rounded-[6rem] w-[400px] h-52'/>
                <div className='flex flex-col justify-between bg-neutral-950 gap-4 px-10 py-7 rounded-b-3xl h-full'>
                    <div className='flex flex-col gap-4'>
                        <span className=' text-xl font-bold'>{shortenString(title, 40)}</span>
                        <p className='text-g'>{shortenString(paragraph, 120)}</p>
                    </div>
                    <span className='text-g3 text-end'>{date}</span>
                </div>
            </div>
        </Link>
    </>
}


function FAQ() {
    const [selectedId, selectId] = useState(1);


    function FaqItem({item, index}: any) {
        const isSelected = index === selectedId;
        const selectItemId = () => selectId(isSelected ? -1 : index)

        return <>
            <div className='flex flex-col gap-4 w-full text-start'>
                <div className='flex flex-col gap-2 w-full'>
                    <div className='flex justify-between items-center cursor-pointer' onClick={selectItemId}>
                        <span className='text-start text-xl font-medium'>{item.title}</span>
                        {isSelected ? <MinusSVG/> : <PlusSVG/>}
                    </div>
                    {isSelected && <span className='text-g2 text-sm max-w-[80%]'>{item.answer}</span>}
                </div>
                <div className='h-px bg-neutral-700 w-full'/>
            </div>
        </>
    }

    return <>
        <div
            className='flex flex-col justify-center items-center lg:px-72 md:px-12 sm:px-6  py-40 gap-16 text-white'>
            <h4 className='text-3xl font-semibold'>Frequently Asked Questions(FAQ)</h4>
            <div className='flex flex-col gap-4 w-full'>
                {FAQ_QUESTIONS.map((item, index) => <FaqItem item={item} index={index} key={index}/>)}
            </div>
        </div>
    </>
}

function Partnerships() {

    const partners = [
        {
            url: URLS.others.MantaNetwork,
            alt: "Manta Network",
            src: "/pngs/manta-partner.png"
        },
        {
            url: URLS.others.Polygon,
            alt: "Polygon zkEVM",
            src: "/pngs/polygon-zkevm-partner.png"
        },
        {
            url: URLS.others.Polygon,
            alt: "Polygon",
            src: "/pngs/polygon-partner.png"
        },
        {
            url: URLS.others.ZetaChain,
            alt: "Zeta Chain",
            src: "/pngs/zeta-partner.png"
        },


    ]

    return <>
        <div
            className='flex flex-col justify-center gap-24 py-40 lg:px-72 md:px-12 sm:px-6  items-center border-t-2 border-w1 bg-[#050505]'>
            <div className='flex flex-col gap-4 text-center'>
                <h2 className='text-3xl font-bold'>Our Esteemed Partners: Collaborating for Success</h2>
                <p className='max-w-3xl text-neutral-400'>Each partner plays a pivotal role in our ecosystem, bringing
                    unique expertise and value to our platform. Discover the synergy that makes our service stand out in
                    the world of finance</p>
            </div>
            <div className='grid grid-cols-8 gap-20'>
                {
                    partners.map((item, index) => (<>
                        <Link href={item.url} target="_blank"
                              className='flex justify-center lg1:col-span-2 md:col-span-4 sm:col-span-8'>
                            <Image src={item.src} alt={item.alt} width={200} height={50} className='object-contain'/>
                        </Link>
                    </>))
                }
            </div>
            <Link href={URLS.Discord} target="_blank">
                <div className='flex gap-3 items-center bg-white px-8 p-3 rounded-3xl text-black'>
                    <DiscordIcon color='#000' size={32}/>
                    <span className='font-medium'>Join Our Discord</span>
                </div>
            </Link>
        </div>

    </>
}
