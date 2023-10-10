import Loading from "@/components/utils/loading";

export default function AmetLoadingFull() {
    return <>
        <div className='loader'>
            <Loading/>
        </div>
        <style jsx>{`
          .loader {
            position: sticky;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            width: 100%;
            background-color: black;
            z-index: 1000;
            overflow-y: hidden;
          }
        `}</style>
    </>
}