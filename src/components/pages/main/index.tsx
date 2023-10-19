import Styles from "./index.module.css";
import {Staatliches} from 'next/font/google'
import Image from "next/image";
import {useRef} from "react";
import BackgroundDocumentsSVG from "../../../../public/svg/background-documents";
import Link from "next/link";
import {join} from "@/modules/utils/styles";
import {URLS} from "@/modules/utils/urls";

const staatliches = Staatliches({subsets: ['latin'], weight: "400"})

const Texts = {
    pMain: "Welcome to Amet Finance, your gateway to the future of decentralized finance. We empower individuals and communities by providing innovative DeFi solutions, enabling you to take control of your financial future. Discover endless possibilities and embark on a journey toward financial freedom.",
    pBonds1: "Discover the power of on-chain bonds with Amet Finance. Our bond offerings open up a world of possibilities, allowing you to invest, trade, and grow your assets seamlessly in the decentralized finance (DeFi) space.",
    pBonds2: "With a user-friendly interface, transparent processes, and robust security, Amet Finance bonds are designed to provide you with a trusted and rewarding investment experience. Explore our diverse bond options and start shaping your financial future today.",
    pBondsDa: "Experience financial inclusivity like never before. On-chain bonds give you direct access to bond markets, breaking down the walls of traditional finance.",
    pBondsELV: "On-chain bonds offer increased liquidity and versatility, empowering users to trade and manage their bond investments effortlessly, while adapting their strategies to suit their unique needs and preferences.",
    pBondsSs: "Trust in smart contract technology. On-chain bonds are backed by secure, transparent smart contracts, safeguarding your investments and eliminating intermediaries."
}

export default function Home() {
    const bondsRef = useRef(null) as any
    const scrollToView = () => bondsRef.current.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})

    return <>
        <main className={Styles.container}>
            <div className={Styles.sections}>
                <div className={Styles.firstImage}>
                    <Image src={'./svg/VectorHash.svg'} width={450} height={780} alt={"K"}/>
                </div>
                <div className={Styles.firstSection}>
                    <h1 className={staatliches.className + " " + Styles.mainText}>
                        EMPOWERING <span className={Styles.secondaryText}>YOUR</span><br/>
                        FINANCIAL FUTURE <br/>
                        IN DEFI
                    </h1>
                    <div className={Styles.stroke}/>
                    <p className={Styles.paragraphText}>{Texts.pMain}</p>
                    <div className={Styles.actionButtons}>
                        <Link href='/bonds'>
                            <button className={Styles.btn}>Get Started</button>
                        </Link>
                        <Link href={URLS.FAQ_WIAF} target="_blank">
                            <button className={join([Styles.learnMore, Styles.btn])}>Learn More</button>
                        </Link>
                    </div>
                </div>
                <div className={Styles.sectionDown} onClick={scrollToView}>
                    <div className={Styles.hz}/>
                    <div className={Styles.cl}>
                        <span>B</span>
                    </div>
                </div>
            </div>
            <div className={Styles.sections}>
                {/*<p className={Styles.secondaryText}>Explore the on-chain vision</p>*/}
                <div className={Styles.bondBackgroundImage}>
                    <Image src={'./svg/Circle.svg'} alt={"C"} fill/>
                </div>
                <div className={Styles.bondsSection} ref={bondsRef}>
                    <h2 className={staatliches.className + " text-3xl"}>BONDS</h2>
                    <div className="flex justify-between w-full">
                        <p className={Styles.bondText}>{Texts.pBonds1}</p>
                        <p className={Styles.bondText}>{Texts.pBonds2}</p>
                    </div>
                    <div className={Styles.bondInfo}>
                        <div className={Styles.bondImage}>
                            <Image src={'./svg/Bond.svg'} alt={"Bond"} fill/>
                        </div>
                        <div className={Styles.bondInfoTexts}>
                            <div className={Styles.bondInfoText}>
                                <h3>Decentralized Access</h3>
                                <p className={Styles.bondInfoParagraph}>{Texts.pBondsDa}</p>
                            </div>
                            <div className={Styles.bondInfoText}>
                                <h3>Enhanced Liquidity and Versatility</h3>
                                <p className={Styles.bondInfoParagraph}>{Texts.pBondsELV}</p>
                            </div>
                            <div className={Styles.bondInfoText}>
                                <h3>Smart Contract Security</h3>
                                <p className={Styles.bondInfoParagraph}>{Texts.pBondsSs}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={Styles.statsAndDocs}>
                <div className={Styles.statistics}>
                    <div className={Styles.stat}>
                        <span className={Styles.highText}>$35K</span>
                        <span className={Styles.lowText}>Total Value Locked (TVL)</span>
                    </div>
                    <div className={Styles.stat}>
                        <span className={Styles.highText}>2,451</span>
                        <span className={Styles.lowText}>Number of Active Users</span>
                    </div>
                    <div className={Styles.stat}>
                        <span className={Styles.highText}>250+</span>
                        <span className={Styles.lowText}>Total Bonds Issued</span>
                    </div>
                    <div className={Styles.stat}>
                        <span className={Styles.highText}>85%</span>
                        <span className={Styles.lowText}>Bond Redemption Rate</span>
                    </div>
                </div>
                <Link href={URLS.Docs} target="_blank">
                    <div className={Styles.documentation}>
                        <h3 className={staatliches.className + " " + Styles.documentText}>DOCUMENTATION</h3>
                        <BackgroundDocumentsSVG/>
                    </div>
                </Link>
            </div>
        </main>
    </>
}