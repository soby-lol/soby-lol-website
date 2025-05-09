"use client";
import { Login, requestLogin } from "@/api/soby";
import ModalConfirm from "@/components/ModalConfirm";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { GetNoneRes } from "@/types/api";
import { ROUTER_CHAIN } from "@/types/common";
import { RouterNames } from "@/types/router";
import { usePathname } from "next/navigation";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Chain, useAccount, useDisconnect, useNetwork, useSignMessage, useSwitchNetwork } from "wagmi";

interface AppContextType {
    onDisconnect: () => void;
    auth: Auth | undefined;
    chain: Chain | undefined;
    chainSupported: { id: number, name: string }
}

const AppContext = createContext<AppContextType>({
    onDisconnect: () => { },
    auth: undefined,
    chain: undefined,
    chainSupported: { id: 0, name: "" }
});

export type AppContextProviderProps = {};

type Auth = {
    token: string;
    expired: number;
    address: string;
};

export function AppContextProvider({
    children,
}: PropsWithChildren<AppContextProviderProps>) {
    const [openSwitchNetwork, setOpenSwitchNetwork] = useState(false);
    const [currentChain, setCurrentChain] = useState<Chain | undefined>(undefined);
    const [mounted, setMounted] = useState(false);
    const [auth, setAuth] = useLocalStorage<Auth | undefined>("auth", undefined);
    const { address, isConnected, isConnecting, isReconnecting } = useAccount();
    const { switchNetwork } = useSwitchNetwork();
    const { chain } = useNetwork();

    const path = usePathname();

    const chainSupported = useMemo(() => {
        if (ROUTER_CHAIN[path] !== undefined) {
            return ROUTER_CHAIN[path] as { id: number, name: string };
        }

        return ROUTER_CHAIN["default"] as { id: number, name: string };
    }, [path]);

    const routerName = useMemo(() => {
        if (RouterNames[path] !== undefined) {
            return RouterNames[path] as string;
        }
        return path;
    }, [path]);

    const { disconnect } = useDisconnect({
        onSuccess() {
            setAuth(undefined);
        }
    });

    const onDisconnect = () => {
        disconnect();
    }

    const { signMessage } = useSignMessage({
        onError(error) {
            disconnect();
        },
        async onSuccess(signHash, { message }) {
            if (!address) return;
            const res = await Login({ address: address!, signature: signHash })
            const auth = (await res.json()) as Auth;
            auth.address = address;
            if (auth && auth.token) {
                setAuth(auth);
                window.location.href = window.location.href;
            } else {
                disconnect();
            }
        }
    });

    const goBackInternalPage = () => {
        if (!window || !document) {
            setOpenSwitchNetwork(false);
            return;
        }

        if (document.referrer.includes(window.location.hostname)) {
            window.history.back();
        } else {
            window.location.href = "/";
        }
    };

    const onLogin = useCallback(async () => {
        if (!!address) {
            const res = await requestLogin(address);
            const auth = (await res.json()) as GetNoneRes;
            if (!!auth.nonce) {
                signMessage({ message: auth.nonce });
            }
        }
    }, [address]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (chain) {
            setCurrentChain(chain);
        }
    }, [mounted, chain]);

    useEffect(() => {
        if (mounted && chainSupported.id !== currentChain?.id && switchNetwork && path !== "/") {
            setOpenSwitchNetwork(true);
        } else if (chainSupported.id === currentChain?.id) {
            setOpenSwitchNetwork(false);
        }
    }, [mounted, currentChain, switchNetwork]);

    useEffect(() => {
        if (mounted && !isConnected && !address && !isConnecting && !isReconnecting) {
            onDisconnect();
        } else if (mounted && isConnected && address) {
            const currentTimestamp = (new Date()).getTime() / 1000;
            if (!auth || (auth && !auth.token) || (auth && auth.expired <= currentTimestamp) || (auth && auth.address !== address)) {
                onLogin();
            }
        }
    }, [mounted, isConnected, isConnecting, address, auth]);

    const context: AppContextType = useMemo(
        () => ({
            onDisconnect,
            auth,
            chain: currentChain,
            chainSupported,
        }),
        [onDisconnect, auth, currentChain, chain, chainSupported],
    );

    return <AppContext.Provider value={context}>
        {children}
        <ModalConfirm
            isOpen={openSwitchNetwork}
            title={`Switch network to ${chainSupported.name}`}
            message={`${routerName} is only supported on the ${chainSupported.name} network. Please switch to ${chainSupported.name} network to continue.`}
            onConfirm={() => {
                if (chainSupported && switchNetwork) {
                    switchNetwork(chainSupported.id);
                }
            }}
            onCancel={() => { goBackInternalPage() }}
        />
    </AppContext.Provider>;
}

export function useAppContext() {
    return useContext(AppContext);
}