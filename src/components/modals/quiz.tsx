import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import XmarkSVG from "../../../public/svg/utils/xmark";
import {closeModal} from "@/store/redux/modal";
import CongratulationsSVG from "../../../public/svg/utils/congratulations";

const States = {
    Nope: 'nope',
    Questions: 'questions',
    Finish: 'finish'
}

export default function Quiz() {

    const [state, setState] = useState(States.Nope)

    return <>
        <div className='flex flex-col gap-7 max-w-xl lg:w-500 sm:w-full'>
            {state === States.Nope && <Introduction nextState={() => setState(States.Questions)}/>}
            {state === States.Questions && <Questions nextState={() => setState(States.Finish)}/>}
            {state === States.Finish && <Finish/>}
        </div>
    </>
}

function Introduction({nextState}: any) {
    return <>
        <div className='flex flex-col gap-4'>
            <span className='text-3xl font-bold'>Amet Finance <br/>Knowledge Check</span>
            <div className='flex flex-col gap-2'>
                <p className='text-sm text-g'>{`Before you begin purchasing bonds on Amet Finance, we want to ensure you have a fundamental understanding of our platform. This brief quiz will test your knowledge and help you gain more confidence in using our services.`}</p>
            </div>
        </div>
        <button className='p-1.5 px-10 rounded bg-green-500' onClick={nextState}>Start Quiz</button>
    </>
}

function Questions({nextState}: any) {
    const questions = [
        {
            title: "What are bonds on Amet Finance?",
            answers: [
                {
                    text: "Debt obligations issued by the government"
                },
                {
                    text: "NFT collectibles"
                },
                {
                    text: "Financial instruments for decentralized finance",
                    isAnswer: true
                },
                {
                    text: "Travel vouchers"
                }
            ]
        },
        {
            title: "How do bonds on Amet Finance work?",
            answers: [
                {
                    text: "They are forged with magic spells"
                },
                {
                    text: "They provide access to amusement parks"
                },
                {
                    text: "They are used as fishing bait"
                },
                {
                    text: "Users purchase bonds with cryptocurrency to earn interest",
                    isAnswer: true
                }
            ]
        },
        {
            title: "What is the purpose of redeeming bonds on Amet Finance?",
            answers: [
                {
                    text: "To uncover hidden treasures"
                },
                {
                    text: "To exchange for pizza slices"
                },
                {
                    text: "To receive the interest amount",
                    isAnswer: true
                },
                {
                    text: "To unlock secret dance moves"
                }
            ]
        },
        {
            title: "What are the potential returns of holding an on-chain bond on Amet Finance?",
            answers: [
                {
                    text: "Fixed profit"
                },
                {
                    text: "Possible gains and losses",
                    isAnswer: true

                },
                {
                    text: "Variable loss"
                },
                {
                    text: "Guaranteed double your investment"
                }
            ]
        },
        {
            title: "Who can issue on-chain bonds on Amet Finance?",
            answers: [
                {
                    text: "Anyone",
                    isAnswer: true
                },
                {
                    text: "Experienced crypto traders"
                },
                {
                    text: "Verified institutional investors"
                },
                {
                    text: "Only Amet Finance founders"
                }
            ]
        },
    ]
    const [questionIndex, setIndex] = useState(0)
    const [question, setQuestion] = useState(questions[questionIndex])

    const [selected, setSelected] = useState("")
    const selectHandler = [selected, setSelected]

    function changeState() {
        if (selected) {
            if (questionIndex === questions.length - 1) {
                return nextState()
            } else {
                setSelected("");
                setQuestion(questions[questionIndex + 1])
                return setIndex(questionIndex + 1)
            }
        } else {
            toast.error("Please select an option")
        }
    }

    const buttonClass = `${selected ? "bg-green-500" : "bg-b2 cursor-not-allowed"} p-1.5 px-10 rounded`

    return <>
        <Question question={question} selectHandler={selectHandler} key='title'/>
        <div className='flex justify-end items-center'>
            <button className={buttonClass} onClick={changeState}>Next</button>
        </div>
    </>
}

function Question({question, selectHandler}: any) {
    const {title, answers} = question

    return <>
        <div className='flex flex-col gap-8'>
            <span className='text-xl'>{title}</span>
            <div className='flex flex-col gap-1'>
                {answers.map((answer: any) => <Answer answer={answer}
                                                      selectHandler={selectHandler}
                                                      key={answer.text}/>)}
            </div>
        </div>
    </>
}

function Answer({answer, selectHandler}: any) {
    const {text, isAnswer} = answer
    const [selected, setSelected] = selectHandler

    const rightAnswer = 'p-2 bg-green-500 rounded text-start cursor-pointer'
    const wrongAnswer = 'p-2 bg-red-500 rounded text-start cursor-pointer'
    const neutralAnswer = 'p-2 bg-b2 rounded text-start cursor-pointer'

    let className = neutralAnswer;

    if (selected) {

        if (isAnswer) {
            className = rightAnswer
        } else if (selected === text) {
            className = wrongAnswer
        }

        // if (selected === text) {
        //     className += " border border-solid border-yellow-500"
        // }

    }


    return <>
        <button className={className} onClick={() => setSelected(text)}>{text}</button>
    </>
}

function Finish() {

    useEffect(() => {
        if (typeof localStorage !== "undefined") localStorage.setItem('quizPassed', "true")
    }, []);

    return <>
        <div className='flex flex-col items-center text-center gap-4'>
            <div className='relative flex justify-center items-center w-full'>
                <CongratulationsSVG/>
                <div className='absolute top-0 right-0'>
                    <XmarkSVG isMedium onClick={closeModal}/>
                </div>
            </div>
            <span className='text-2xl font-bold'>Congratulations!</span>
            <span className='text-sm text-g'>{`You've successfully completed the Amet Finance Knowledge Check!`}</span>
        </div>
    </>
}
