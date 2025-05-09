import { GetTaskCompleted, pickTask, registerWhitelist, TwitterCallback } from "@/api/soby";
import { useAppContext } from "@/providers/Context";
import { TaskCompeleted } from "@/types/api";
import { APP_TWITTER_CHALLENGE_CODE, APP_TWITTER_CLIENT_ID, APP_TWITTER_REDIRECT_URI } from "@/types/common";
import cn from "@/utils/cn";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import ButtonConnect from "../ButtonConnect";
import SectionTitle from "../SectionTitle";
type Icon = {
    path: string;
    name: string;
}
type Task = {
    label: string | undefined;
    action: string;
    icon: Icon | undefined;
}

type Step = {
    name: string;
    icon: string;
    task: Task;
}

type StepProp = {
    step: Step;
    no: number | undefined;
    onclick: Function;
    isActionDisable?: boolean;
    isTaskBorderDisable?: boolean;
    isEndStep?: Boolean;
    isCompleted?: boolean;
    isActionConnect?: boolean;
}
export default function Whitelist() {
    const [mounted, setMounted] = useState(false);
    const [stepCompleted, setStepCompleted] = useState<TaskCompeleted>({ tasks: [], is_register_whitelist: false, message: "" });
    const [isLoading, setIsLoading] = useState(true);
    const { auth } = useAppContext();
    const { isConnected } = useAccount();

    const searchParams = useSearchParams();

    const isEnableRegister = useMemo(() => {
        return stepCompleted && stepCompleted.tasks && stepCompleted.tasks.length === 4;
    }, [stepCompleted])

    const isStepConnectWalletDone = useMemo(() => {
        return stepCompleted?.tasks?.includes("CONNECT_WALLET");
    }, [stepCompleted]);

    const isStepConnectTwitterDone = useMemo(() => {
        return stepCompleted?.tasks?.includes("CONNECT_TWITTER");
    }, [stepCompleted]);


    const Step = ({ no, step, onclick, isActionDisable, isTaskBorderDisable, isEndStep, isActionConnect, isCompleted }: StepProp) => {
        return <div className="w-full flex flex-col md:flex-row gap-2 md:gap-10 item justify-between">
            <div className="flex gap-4 items-start relative">
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col">
                        <div className="w-10 h-10 rounded-full border-[#C79300] border-[1px] inline-flex items-center content-center justify-center" style={{ background: "rgba(255, 202, 56, 0.3)" }}>
                            <img src={step.icon} className="w-4 inline-block" />
                        </div>
                        {!isEndStep ? <div style={{ height: "calc(100% - 56px)" }} className="hidden md:block w-[4px] left-[18px] absolute top-[60px] bg-[#D9D9D9]"></div> : <></>}
                    </div>
                    <div className="flex flex-col justify-between">
                        {no ? <label className="hidden md:block text-sm font-normal">Step {no}</label> : <></>}
                        <span className="text-2xl font-normal text-[#C79300]">{step.name}</span>
                    </div>
                </div>
            </div>
            <div className={cn(`w-full md:w-[500px] flex flex-col gap-2 font-normal`, {
                "p-7 bg-[#FFFFB8] hover:bg-[#FFE49A] hover:border hover:px-[26px] rounded-3xl border-b-2 border-brown": !isTaskBorderDisable,
            })}>
                <div className="w-full flex items-center content-center gap-8 justify-between">
                    {step.task.label ? <span className="text-lg">{step.task.label}</span> : <></>}
                    {
                        isActionConnect ?
                            <ButtonConnect label={isConnected ? "Disconnect" : "Connect Wallet"} /> : (
                                isCompleted ?
                                    <button className={cn(`rounded-lg font-normal text-sm text-brown bg-light-orange-100 px-[10px] h-[28px] leading-7`)}
                                    >Completed</button> :
                                    <button
                                        className={cn(`w-[180px] border-b-[2px] border-brown rounded-full flex items-center justify-center font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 py-2 px-6 hover:py-[9px] lg:w-[200px]`, {
                                            "cursor-not-allowed opacity-50": isActionDisable
                                        })}
                                        onClick={() => onclick()}
                                        disabled={isActionDisable}
                                    >{step.task.action}
                                    </button>
                            )
                    }
                </div>
                {
                    step.task.icon ?
                        <div className="flex gap-2">
                            <img src={step.task.icon?.path} className="w-6" />
                            <span>{step.task.icon?.name}</span>
                        </div>
                        : <></>
                }
            </div>

        </div>
    }

    const ConnectWalletStep = () => {
        const step = {
            name: "Connect Wallet",
            icon: `/icons/icn-${isStepConnectWalletDone ? "check" : "wallet"}.svg`,
            task: {
                label: "Connect your wallet to get whitelisted",
                action: isConnected ? "Disconnect" : "Connect Wallet",
                icon: undefined,
            }
        };
        return <Step step={step} no={1} isActionDisable={isConnected} isActionConnect={true} onclick={() => { }} />
    }

    const ConnectTwitterStep = () => {
        function getTwitterOauthUrl() {
            const rootUrl = "https://twitter.com/i/oauth2/authorize";
            const options = {
                redirect_uri: APP_TWITTER_REDIRECT_URI,
                client_id: APP_TWITTER_CLIENT_ID,
                state: "state",
                response_type: "code",
                code_challenge: APP_TWITTER_CHALLENGE_CODE,
                code_challenge_method: "S256",
                scope: ["users.read", "tweet.read", "follows.read", "follows.write"].join(" "),
            };
            const qs = new URLSearchParams(options).toString();
            return `${rootUrl}?${qs}`;
        };

        const step = {
            name: "Connect Twitter",
            icon: `/icons/icn-${isStepConnectTwitterDone ? "check" : "twitter"}.svg`,
            task: {
                label: "Connect Twitter Account",
                action: isStepConnectTwitterDone ? "Completed " : "Connect Twitter",
                icon: {
                    path: "/icons/icn-twitter-dark.svg",
                    name: "Twitter"
                }
            }
        };

        return <Step step={step} no={2} isActionDisable={!isConnected || isStepConnectTwitterDone} isCompleted={isStepConnectTwitterDone} onclick={() => { window?.open(getTwitterOauthUrl(), "_self") }
        } />
    }

    const FollowSobyStep = () => {
        const isDone = stepCompleted?.tasks?.includes("FOLLOW_TWITTER");
        const step = {
            name: "Follow @sobytoken",
            icon: `/icons/icn-${isDone ? "check" : "soby"}.svg`,
            task: {
                label: "Follow @sobytoken on Twitter",
                action: isDone ? "Completed " : "Follow Twitter",
                icon: {
                    path: "/icons/icn-soby.svg",
                    name: "Soby XAI"
                }
            }
        };
        return <Step step={step} no={3} isActionDisable={!isConnected || isDone || !isStepConnectTwitterDone} isCompleted={isDone} onclick={() => {
            onPickTask("FOLLOW_TWITTER");
            window?.open("https://twitter.com/intent/follow?screen_name=sobytoken");
        }} />
    }

    const LikeAndRetweetTwitterStep = () => {
        const isDone = stepCompleted?.tasks?.includes("LIKE_N_RETWEET");
        const step = {
            name: "Like and Retweet",
            icon: `/icons/icn-${isDone ? "check" : "retweet"}.svg`,
            task: {
                label: "Like and Retweet on Twitter",
                action: isDone ? "Completed " : "Like and Retweet",
                icon: {
                    path: "/icons/icn-twitter-dark.svg",
                    name: "Twitter"
                }
            }
        };
        return <Step step={step} no={4} isCompleted={isDone} isActionDisable={!isConnected || isDone || !isStepConnectTwitterDone} onclick={() => {
            onPickTask("LIKE_N_RETWEET");
            window?.open("https://twitter.com/intent/like?tweet_id=1759548066334441613");
        }} />
    }

    const RegisterStep = () => {
        const step = {
            name: "Register for Whitelist",
            icon: `/icons/icn-${stepCompleted.is_register_whitelist ? "check" : "register"}.svg`,
            task: {
                label: undefined,
                action: stepCompleted.is_register_whitelist && isConnected ? "Registered " : "Register",
                icon: undefined
            }
        };
        return <Step step={step} no={undefined} isTaskBorderDisable={true} isActionDisable={!isEnableRegister || stepCompleted.is_register_whitelist} isEndStep={true} onclick={() => { onRegisterWhitelist() }} />
    }

    const myTaskCompleted = useCallback(async () => {
        const res = await GetTaskCompleted(auth?.token!);
        const tasks = (await res.json()) as TaskCompeleted;
        setStepCompleted(() => ({ ...tasks }));
        setIsLoading(false);
    }, [auth, isConnected]);

    const verifyTwitter = useCallback(async () => {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!!code && !!state && !isStepConnectTwitterDone) {
            const res = await TwitterCallback(code, auth?.token!);
            const tasks = (await res.json()) as TaskCompeleted;
            if (res.status === 200) {
                setStepCompleted(() => ({ ...tasks }));
                toast.success('Twitter connected successfully!', {
                    onClose() {
                        window.location.href = "/";
                    }
                });
            } else {
                toast.error(!!tasks.message ? tasks.message : "", {
                    onClose() {
                        window.location.href = "/";
                    }
                });
            }
        } else if (!!code || !!state) { }
    }, [isStepConnectTwitterDone, isLoading]);

    const onPickTask = useCallback(async (code: string) => {
        const res = await pickTask(code, auth?.token!);
        const tasks = (await res.json()) as TaskCompeleted;
        setStepCompleted(() => ({ ...tasks }));
        toast.success('Task completed!');
    }, []);

    const onRegisterWhitelist = useCallback(async () => {
        if (!stepCompleted.is_register_whitelist) {
            const res = await registerWhitelist(auth?.token!);
            const state = (await res.json()) as { status: boolean };
            if (state && state.status) {
                setStepCompleted((oldState) => ({ ...oldState, is_register_whitelist: state.status }));
                toast.success('Whitelist registration successful!');
            }
        }
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && auth?.token) {
            myTaskCompleted();
        } else {
            setStepCompleted((state) => ({ ...state, tasks: [] }));
        }
    }, [mounted, auth]);

    useEffect(() => {
        if (mounted && !isLoading && auth) {
            verifyTwitter();
        }
    }, [mounted, isLoading, auth, isStepConnectTwitterDone])

    return <div id="whitelist" className="max-w-7xl px-5 xl:w-full xl:px-0 mx-auto">
        <SectionTitle title="$SOBY Whitelist" />
        <div className="w-full flex flex-col gap-10 md:gap-4 justify-center items-center max-w-[820px] m-auto">
            <div className="text-2xl font-normal text-center">Whitelist Wonderland: Your Gateway to the Meme Coin Galaxy</div>
            <ConnectWalletStep />
            <ConnectTwitterStep />
            <FollowSobyStep />
            <LikeAndRetweetTwitterStep />
            <RegisterStep />
        </div>
    </div>
}