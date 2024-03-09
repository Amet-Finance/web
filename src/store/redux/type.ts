import {Account} from "@/store/redux/account/type";
import {Modal} from "@/store/redux/modal/type";

type RootState = {
    modal: Modal;
    account: Account;
}

export type {
    RootState
}
