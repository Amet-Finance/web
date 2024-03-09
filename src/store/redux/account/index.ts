import {createSlice} from "@reduxjs/toolkit";
import store from "@/store/store";
import {Account} from "@/store/redux/account/type";
import CloudAPI from "../../../modules/cloud-api/index"

const emptyState: Account = {
    balances: {}
}

const counterSlice = createSlice({
    name: "account",
    initialState: {...emptyState},
    reducers: {
        updateBalance: (state, {payload}) => {
            if (payload) state.balances = payload;
        },
    },
});

const reducer = counterSlice.reducer;

const {
    updateBalance,
} = counterSlice.actions;


async function initBalances(address: string | undefined) {
    if (address) {
        const balances = await CloudAPI.getBalance(address);
        if (balances) {
            delete balances._id;
            store.dispatch(updateBalance(balances))
        }
    }
}

export {
    counterSlice,
    reducer,
    initBalances,
}
