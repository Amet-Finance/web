export default function SettingsSVG({onClick}: any) {
    return <>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' onClick={onClick}>
            <path
                d="M9.84 18H8.16C7.59225 18 7.113 17.5748 7.0455 17.01L6.86625 15.603C6.5085 15.4868 6.1635 15.3435 5.83575 15.1763L4.71525 16.047C4.26075 16.3988 3.621 16.3582 3.2265 15.9525L2.04525 14.7712C1.6425 14.3805 1.602 13.7408 1.95375 13.287L2.8245 12.1658C2.6565 11.838 2.51325 11.493 2.39775 11.1353L0.98775 10.956C0.42525 10.887 0 10.4078 0 9.84V8.16C0 7.59225 0.42525 7.113 0.99 7.0455L2.397 6.86625C2.51325 6.5085 2.6565 6.1635 2.82375 5.83575L1.95375 4.71525C1.60125 4.26075 1.6425 3.62025 2.049 3.22575L3.23025 2.0445C3.621 1.64175 4.2615 1.602 4.7145 1.953L5.835 2.8245C6.16275 2.65725 6.50775 2.514 6.86625 2.39775L7.0455 0.98775C7.113 0.42525 7.59225 0 8.16 0H9.84C10.4078 0 10.887 0.42525 10.9545 0.99L11.1338 2.397C11.4923 2.51325 11.8372 2.6565 12.165 2.82375L13.2855 1.953C13.7408 1.60125 14.3798 1.64175 14.7743 2.04825L15.9555 3.2295C16.3582 3.62025 16.3988 4.26 16.047 4.71375L15.1763 5.835C15.3443 6.16275 15.4875 6.50775 15.603 6.8655L17.013 7.04475C17.5748 7.113 18 7.59225 18 8.16V9.84C18 10.4078 17.5748 10.887 17.01 10.9545L15.603 11.1338C15.4868 11.4915 15.3435 11.8365 15.1763 12.1643L16.047 13.2847C16.3995 13.7392 16.3582 14.379 15.9517 14.7735L14.7705 15.9548C14.3798 16.3575 13.7393 16.3988 13.2863 16.0463L12.165 15.1755C11.8372 15.3435 11.4922 15.4867 11.1345 15.6023L10.9553 17.0123C10.887 17.5748 10.4078 18 9.84 18ZM5.7975 14.355C5.85975 14.355 5.9235 14.3708 5.9805 14.4023C6.39375 14.6333 6.8415 14.8193 7.311 14.9542C7.455 14.9955 7.56075 15.1185 7.5795 15.267L7.7895 16.917C7.812 17.1052 7.97475 17.25 8.16 17.25H9.84C10.0253 17.25 10.188 17.1053 10.2098 16.9208L10.4205 15.2678C10.4392 15.1193 10.545 14.9963 10.689 14.955C11.1585 14.82 11.6062 14.634 12.0195 14.403C12.1508 14.3295 12.3142 14.3423 12.432 14.4345L13.7445 15.4545C13.8953 15.5715 14.1068 15.5618 14.2358 15.429L15.4245 14.2402C15.5603 14.1082 15.5708 13.8968 15.4537 13.7453L14.4338 12.4327C14.3415 12.3142 14.3287 12.1515 14.4023 12.0203C14.6333 11.607 14.8193 11.1593 14.9542 10.6898C14.9955 10.5458 15.1185 10.44 15.267 10.4213L16.917 10.2113C17.1052 10.188 17.25 10.0253 17.25 9.84V8.16C17.25 7.97475 17.1053 7.812 16.9208 7.79025L15.2678 7.5795C15.1193 7.56075 14.9963 7.455 14.955 7.311C14.82 6.8415 14.634 6.39375 14.403 5.9805C14.3295 5.84925 14.3415 5.6865 14.4345 5.568L15.4545 4.2555C15.5723 4.104 15.5618 3.8925 15.4298 3.765L14.241 2.57625C14.1098 2.43975 13.8975 2.42925 13.746 2.547L12.4335 3.567C12.3142 3.65925 12.1515 3.672 12.0203 3.5985C11.6085 3.3675 11.1608 3.18225 10.6898 3.0465C10.5458 3.00525 10.44 2.88225 10.4213 2.73375L10.2113 1.08375C10.188 0.89475 10.0253 0.75 9.84 0.75H8.16C7.97475 0.75 7.812 0.89475 7.79025 1.07925L7.5795 2.73225C7.56075 2.88075 7.455 3.00375 7.311 3.04575C6.84 3.18075 6.39225 3.36675 5.9805 3.597C5.84925 3.67125 5.6865 3.65775 5.56725 3.56625L4.25475 2.54625C4.10325 2.4285 3.8925 2.439 3.76425 2.571L2.5755 3.7605C2.43975 3.8925 2.42925 4.104 2.54625 4.2555L3.56625 5.568C3.6585 5.6865 3.67125 5.84925 3.59775 5.9805C3.366 6.39375 3.18075 6.8415 3.04575 7.311C3.0045 7.455 2.8815 7.56075 2.733 7.5795L1.083 7.7895C0.89475 7.812 0.75 7.97475 0.75 8.16V9.84C0.75 10.0253 0.89475 10.188 1.07925 10.2098L2.73225 10.4205C2.88075 10.4392 3.00375 10.545 3.045 10.689C3.18 11.1585 3.366 11.6062 3.597 12.0195C3.6705 12.1508 3.6585 12.3135 3.5655 12.432L2.5455 13.7445C2.42775 13.896 2.43825 14.1075 2.57025 14.235L3.759 15.4238C3.89025 15.5595 4.101 15.57 4.254 15.453L5.5665 14.433C5.63475 14.382 5.71575 14.355 5.7975 14.355Z"
                fill="white"/>
            <path
                d="M9 12.75C6.93225 12.75 5.25 11.0678 5.25 9C5.25 6.93225 6.93225 5.25 9 5.25C11.0678 5.25 12.75 6.93225 12.75 9C12.75 11.0678 11.0678 12.75 9 12.75ZM9 6C7.3455 6 6 7.3455 6 9C6 10.6545 7.3455 12 9 12C10.6545 12 12 10.6545 12 9C12 7.3455 10.6545 6 9 6Z"
                fill="white"/>
        </svg>
    </>
}
