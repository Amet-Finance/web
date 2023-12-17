import {Account} from "@/store/redux/account/type";
import {Modal} from "@/store/redux/modal/type";
import {GeneralState} from "@/store/redux/general/type";

type RootState = {
    modal: Modal;
    account: Account;
    general: GeneralState
}

export type {
    RootState
}
