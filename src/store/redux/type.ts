import {AccountState} from "@/store/redux/account/type";
import {ModalState} from "@/store/redux/modal/type";
import {TokensResponse} from "@/modules/api/type";
import {StringKeyedObject} from "@/components/utils/general";

type RootState = {
    modal: ModalState;
    account: AccountState;
    token: StringKeyedObject<TokensResponse>
}

export type {
    RootState
}
