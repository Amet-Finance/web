import {useAccountExtended} from "@/modules/utils/address";
import React, {useEffect, useState} from "react";
import {ScreenTypes} from "@/components/pages/token/xp-rewards/constants";
import XpRewardsLending from "@/components/pages/token/xp-rewards/lending";
import XpRewardsDashboard from "@/components/pages/token/xp-rewards/dashboard";

export default function XpRewards() {
    const {address,active} = useAccountExtended()
    const [screen, setScreen] = useState(ScreenTypes.Activate);

    useEffect(() => {
        if (active) setScreen(ScreenTypes.Xp)
    }, [active, address])

    switch (screen) {
        case ScreenTypes.Activate:
            return <XpRewardsLending setScreen={setScreen}/>
        case ScreenTypes.Xp:
            return <XpRewardsDashboard/>
    }
}
