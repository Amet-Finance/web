
export default function AddressPage(props: any) {

    return <><span>Welcome {props.address}</span></>
}

export async function getServerSideProps({query}: any) {
    return {
        props: {
            address: query.id
        }
    }
}