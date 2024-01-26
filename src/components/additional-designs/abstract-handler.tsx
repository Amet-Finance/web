import Image from "next/image";

export default function AbstractHandler({id}: { id: string }) {

    switch (id) {
        case "MainPage": {
            return <>
                <div
                    className='absolute top-0 md:h-[92vh] sm:h-[87vh] left-0 w-full md:rounded-b-[6rem] sm:rounded-3xl border border-r-0 border-l-0 border-t-0 border-b-neutral-800 '>
                    <Image src='/pngs/pexels-narsimha-rao-mangu-10572153.jpg' alt="" width="5000" height='5000'
                           className='object-cover w-full h-full md:rounded-b-[6rem] sm:rounded-3xl blur-xs saturate-0'/>
                </div>
            </>
        }
    }
}
