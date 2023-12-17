import {createSlice} from "@reduxjs/toolkit";
import store from "@/store/store";
import {polygon} from "wagmi/chains";
import {GeneralState} from "@/store/redux/general/type";

const emptyState: GeneralState = {
    chainId: polygon.id
}

const counterSlice = createSlice({
    name: "general",
    initialState: {...emptyState},
    reducers: {
        switchChain: (state, {payload}) => {
            const {chainId} = payload;
            state.chainId = chainId;
        },
    },
});

const reducer = counterSlice.reducer;

const {
    switchChain,
} = counterSlice.actions;

const GeneralState = {
    counterSlice,
    reducer,
    switchGeneralChain: (chainId: number) => {
        store.dispatch(switchChain({chainId}))
    }
}


export default GeneralState;
