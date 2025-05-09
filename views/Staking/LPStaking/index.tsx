import { LPStakingContract } from "@/hooks/useLPStakingContract";
import StepAddLP from "./StepAddLP";
import StepStacking from "./StepStacking";

export default function LPStaking({ stakingSMC, isOpenGuide, setIsOpenGuide }: { stakingSMC: LPStakingContract, isOpenGuide: boolean, setIsOpenGuide: (flag: boolean) => void }) {
    return <div className="flex gap-10 justify-center flex-col lg:flex-row">
        <div className="lg:max-w-[520px] w-full">
            <StepAddLP isOpenGuide={isOpenGuide} setIsOpenGuide={setIsOpenGuide} />
        </div>
        <div className="lg:max-w-[520px] w-full">
            <StepStacking stakingSMC={stakingSMC} />
        </div>
    </div>
}