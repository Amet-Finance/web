import {AccountState} from "@/store/redux/account/type";
import {ModalState} from "@/store/redux/modal/type";
import {TokensResponse} from "@/modules/api/type";

type RootState = {
    modal: ModalState;
    account: AccountState;
    token: TokensResponse
}

export type {
    RootState
}
