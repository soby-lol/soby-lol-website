import cn from "@/utils/cn";
import { useState } from "react";
import FormDistributionClaim from "./FormDistributionClaim";
import FormTaskOnClaim from "./FormTaskOnClaim";

enum Tab {
    Growth = "GrowthAirdrop",
    Ecosystem = "EcosystemAirdrop"
}
export default function AirdropTabs() {
    const [tabActive, setTabActive] = useState<Tab>(Tab.Growth)
    return <div className="max-w-[720px] mx-auto p-10 rounded-2xl border-b-2 border-brown bg-[#FFEFC3] flex flex-col gap-6 justify-center">
        <div className="flex gap-6 justify-center">
            <button className={cn(`w-[200px] text-center h-10 leading-10 text-brown text-base font-bold`, {
                "bg-[#FFFFAF] rounded-full": tabActive === Tab.Growth
            })} onClick={() => setTabActive(Tab.Growth)}>Growth Airdrop</button>
            <button className={cn(`w-[200px] text-center h-10 leading-10 text-brown text-base font-bold`, {
                "bg-[#FFFFAF] rounded-full": tabActive === Tab.Ecosystem
            })} onClick={() => setTabActive(Tab.Ecosystem)}>Ecosystem Airdrop</button>
        </div>
        <div>
            {
                tabActive === Tab.Growth ?
                    <FormTaskOnClaim /> :
                    (
                        tabActive === Tab.Ecosystem ?
                            <FormDistributionClaim /> :
                            <></>
                    )
            }

        </div>
    </div>
}