import {createSlice} from "@reduxjs/toolkit";
import store from "@/store/store";
import {Account, ConnectPayload} from "@/store/redux/account/type";

const emptyState: Account = {
    address: ""
}

export const counterSlice = createSlice({
    name: "account",
    initialState: {...emptyState},
    reducers: {
        connect: (state, {payload}) => {
            state.address = payload.address;
        },
        disconnect: (state) => {
            state.address = "";
        }
    },
});

const reducer = counterSlice.reducer;

const {connect, disconnect} = counterSlice.actions;

function connectWallet({address}: ConnectPayload) {
    return store.dispatch(connect({
        address
    }))
}

function disconnectWallet(){
    return store.dispatch(disconnect())
}

export {
    reducer,
    connectWallet,
    disconnectWallet
}