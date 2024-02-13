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
import RoundedArrowSVG from "../../../../public/svg/utils/rounded-arrow";
import ArrowBasicSVG from "../../../../public/svg/utils/arrow-basic";


export default function Home() {
    return <>
        <div className='flex flex-col justify-center w-full'>
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
        <div
            className='relative flex justify-center items-center gap-4 rounded-b-[4rem] overflow-hidden  xl1:mx-52 lg:mx-24 md:mx-12 sm:mx-4 min-h-[90vh]'>
            <div
                className='flex flex-col gap-8 lg:items-start lg:text-start sm:items-center sm:text-center justify-center  w-full'>
                <h1 className='xl1:text-8xl lg:text-7xl md:text-8xl sm:text-6xl font-bold leading-snug'>Simplified Bond
                    Investments for Everyone</h1>
                <div className='h-px w-1/4 bg-neutral-400'/>
                <p className='text-neutral-400 max-w-xl text-sm'>Welcome to the world of effortless on-chain bond
                    investments. Amet Finance is
                    designed to democratize the bond market, making it easy and accessible for all. With us, bond
                    investments are no longer complex and exclusive.</p>
                <Link href='/bonds' className='relative flex lg:w-1/3 sm:w-full'>
                    <BasicButton>
                        <span className='font-semibold px-4 py-0.5'>Get Started</span>
                    </BasicButton>
                </Link>
            </div>
            <div className='flex items-end lg:flex sm:hidden h-full'>
                <div className='relative w-[28rem] h- rounded-[4rem] origin-bottom-right'>
                    <div className='absolute w-full top-1/4 z-10 hover:-translate-x-10 shadow-2xl shadow-black'>
                        <BondCard info={BOND_CARDS[0]} link='/bonds'/>
                    </div>
                    <div
                        className='absolute w-full top-1/4 z-20 origin-bottom-right rotate-[15deg] hover:-translate-x-10 hover:-translate-y-8  shadow-2xl shadow-black'>
                        <BondCard info={BOND_CARDS[2]} link="/bonds"/>
                    </div>
                    <div
                        className='absolute w-full top-1/4 z-30 origin-bottom-right rotate-[30deg] hover:-translate-x-10 hover:-translate-y-10 shadow-2xl shadow-black'>
                        <BondCard info={BOND_CARDS[1]} link='/bonds'/>
                    </div>
                    <div
                        className='absolute w-full top-1/4 z-40 origin-bottom-right rotate-[45deg] hover:-translate-x-12 hover:-translate-y-10  shadow-2xl shadow-black'>
                        <BondCard info={BOND_CARDS[3]} link='/bonds'/>
                    </div>
                </div>
            </div>
            <div className='absolute flex flex-col gap-1 items-center top-[95%] cursor-pointer' onClick={() => window.scrollTo({top: 900, behavior: "smooth"})}>
                <span className='text-xs text-neutral-400'>Read More</span>
                <ArrowBasicSVG classname='stroke-neutral-400 scale-[100%]'/>
            </div>
        </div>
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
                className="flex flex-col justify-between gap-16 items-start py-12 px-7 rounded-3xl border border-neutral-900 shadow-xl hover:shadow-neutral-900 bg-gradient-to-bl from-neutral-950 to-black hover:border-neutral-800 hover:scale-105 cursor-pointer ">
                <Image src={imageSrc} width={73} height={92} alt={title}/>
                <div className='flex flex-col gap-9'>
                    <span className='font-semibold text-3xl'>{title}</span>
                    <p className='text-neutral-400 text-sm'>{paragraph}</p>
                </div>
            </div>
        </>
    }

    return <>
        <div className='flex flex-col justify-center items-center gap-24 py-44 xl1:px-52 lg:px-24 md:px-12 sm:px-8'>
            <div className='flex flex-col items-center gap-5 px-4'>
                <h2 className='md:text-6xl sm:text-4xl font-bold text-center'>On-Chain Bonds: Smart, Secure,
                    Streamlined</h2>
                <p className='text-center text-neutral-400 text-sm'>{`Step into the future of finance with
                    On-Chain
                    Bonds. Experience cutting-edge security with blockchain's transparency.`}</p>
            </div>
            <div className='grid lg1:grid-cols-3 md:grid-cols-1 gap-7'>
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
            className='flex flex-col justify-center items-center rounded-[4rem] py-12 gap-4 xl1:mx-52 lg:mx-24 md:mx-12 sm:mx-8'>
            <div className='flex justify-between items-center w-full gap-24'>
                <div className='flex flex-col gap-8 z-10 w-full'>
                    <h3 className='md:text-6xl sm:text-4xl font-bold'>Initiate Your Bonds Issuance</h3>
                    <div className='flex flex-col max-w-xl gap-4'>
                        <div className='grid grid-cols-12  gap-0'>
                            <span className='col-span-11 row-span-1 font-bold'>Strategize Your Investment:</span>
                            <span className='col-span-11 row-span-2 text-neutral-400'>Determine your bonds strategy to align with your financial objectives</span>
                        </div>
                        <div className='grid grid-cols-12  gap-0'>
                            <span className='col-span-11 row-span-1 font-bold'>Set Your Bonds Terms:</span>
                            <span className='col-span-11 row-span-2 text-neutral-400'>Easily configure supply, maturity, and interest to fit your needs</span>
                        </div>

                        <div className='grid grid-cols-12  gap-0'>
                            <span className='col-span-11 row-span-1 font-bold'>Securely Finalize Issuance:</span>
                            <span className='col-span-11 row-span-2 text-neutral-400'>Complete your bonds issuance with our streamlined smart contract process</span>
                        </div>
                    </div>
                    <Link href='/bonds/issue'>
                        <BasicButton wMin>
                            <span className='font-medium px-4 py-0.5'>Issue Bonds</span>
                        </BasicButton>
                    </Link>
                </div>
                <Image src='/pngs/Issue-bonds.png' alt="Issue Bonds"
                       width={2000}
                       height={2000}
                       className='object-contain w-1/2 h-full lg1:flex sm:hidden'/>
            </div>
            <RoundedArrowSVG/>
            <div className='flex justify-between items-center w-full gap-24'>
                <Image src='/pngs/explore-bonds.png' alt="Explore Bonds"
                       width={2000} height={2000}
                       className='object-contain w-1/2 h-full lg1:flex sm:hidden'/>
                <div className='flex flex-col gap-8 z-10'>
                    <h3 className='md:text-6xl sm:text-4xl font-bold'>Discover and Acquire Bonds</h3>
                    <div className='flex flex-col max-w-xl gap-4'>
                        <div className='grid grid-cols-12  gap-0'>
                            <span className='col-span-11 row-span-1 font-bold'>Explore Bond Offerings:</span>
                            <span className='col-span-11 row-span-2 text-neutral-400'>Browse through a variety of bonds issued on our platform to find the ones that best match your investment criteria</span>
                        </div>
                        <div className='grid grid-cols-12  gap-0'>
                            <span className='col-span-11 row-span-1 font-bold'>Conduct Your Due Diligence:</span>
                            <span className='col-span-11 row-span-2 text-neutral-400'>Delve into bond details to ensure they align with your investment goals and risk appetite</span>
                        </div>

                        <div className='grid grid-cols-12  gap-0'>
                            <span className='col-span-11 row-span-1 font-bold'>Seamlessly Acquire Bonds:</span>
                            <span className='col-span-11 row-span-2 text-neutral-400'>Once you have found the right fit, easily purchase bonds with a simple click</span>
                        </div>
                    </div>
                    <Link href='/bonds/explore'>
                        <BasicButton wMin>
                            <span className='font-medium px-4 py-0.5'>Explore Bonds</span>
                        </BasicButton>
                    </Link>
                </div>
            </div>
        </div>
    </>
}

function TradeOnChainBondsSection() {
    return <>
        <div className='relative flex justify-between py-52 pb-52 xl1:mx-52 lg:mx-24 md:mx-12 sm:mx-8'>
            <div className='flex flex-col justify-end gap-8 lg1:w-1/2 sm:w-full'>
                <h3 className='md:text-4xl sm:text-3xl font-bold'>Trade On-Chain Bonds</h3>
                <p className='max-w-xl text-neutral-400 text-sm'>Our innovative approach turns each bond into an ERC1155
                    NFT,
                    unlocking the
                    potential to trade them on leading NFT marketplaces. Discover new opportunities and liquidity
                    options by trading bonds just like you would any valued NFT.</p>
                <Link href={URLS.Docs_Trade_Bonds} target='_blank'>
                    <BasicButton wMin>
                        <span className='font-medium px-4 py-0.5'>Learn More in Our Docs</span>
                    </BasicButton>
                </Link>
            </div>
            <div className='relative flex justify-end w-full lg1:flex sm:hidden'>
                <div className='absolute w-1/2 z-40 top-20 right-40 hover:-translate-x-24'>
                    <BondCard info={BOND_CARDS[1]} link='/bonds/explore'/>
                </div>
                <div className='absolute w-1/2 z-30 top-0 right-20 hover:-translate-x-24'>
                    <BondCard info={BOND_CARDS[2]} link='/bonds/explore'/>
                </div>
                <div className='absolute w-1/2 -top-20 hover:-translate-x-24'>
                    <BondCard info={BOND_CARDS[3]} link='/bonds/explore'/>
                </div>
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
            className='flex flex-col py-12 gap-12  bg-neutral-950 xl1:px-52 lg:px-24 md:px-12 sm:px-8'>
            <div className='flex justify-between items-center'>
                <h4 className='md:text-4xl sm:text-3xl font-bold'>In The News</h4>
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
            <div className='flex flex-col gap-10 w-full text-start'>
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
            className='flex flex-col justify-center items-center   xl1:px-52 lg:px-24 md:px-12 sm:px-8  py-40 gap-16 text-white'>
            <h4 className='md:text-4xl sm:text-3xl font-semibold'>Frequently Asked Questions(FAQ)</h4>
            <div className='flex flex-col gap-8 w-full'>
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
            className='flex flex-col justify-center gap-24 py-12 xl1:px-52 lg:px-24 md:px-12 sm:px-8 items-center bg-neutral-950'>
            <div className='flex flex-col  items-center gap-4 text-center'>
                <h2 className='md:text-4xl sm:text-3xl font-semibold'>Our Esteemed Partners: Collaborating for Success</h2>
                <p className='max-w-3xl text-neutral-400 text-sm'>Each partner plays a pivotal role in our ecosystem, bringing
                    unique expertise and value to our platform. Discover the synergy that makes our service stand out in
                    the world of finance</p>
            </div>
            <div className='grid grid-cols-8 md:gap-20 sm:gap-12'>
                {
                    partners.map((item) => (<>
                        <Link href={item.url} target="_blank"
                              className='flex justify-center lg1:col-span-2 md:col-span-4 sm:col-span-4'>
                            <Image src={item.src} alt={item.alt} width={200} height={50} className='object-contain'/>
                        </Link>
                    </>))
                }
            </div>
            <Link href={URLS.Discord} target="_blank">
                <BasicButton wMin>
                    <div className='flex gap-2 items-center px-4 p-0.5 rounded-3xl text-black'>
                        <DiscordIcon color='#000' size={32}/>
                        <span className='font-medium '>Join Our Discord</span>
                    </div>
                </BasicButton>
            </Link>
        </div>

    </>
}
