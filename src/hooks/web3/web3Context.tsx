import React, { useState, ReactElement, useContext, useEffect, useMemo, useCallback } from "react";
import Web3Modal, { CONNECT_EVENT } from "web3modal";
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider, ExternalProvider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { IFrameEthereumProvider } from "@ledgerhq/iframe-provider";
import { NodeHelper } from "../../helpers/node-helper";
import { CHAINS, FANTOM } from "../../helpers/chains";

/**
 * determine if in IFrame for Ledger Live
 */
function isIframe() {
    return window.location !== window.parent.location;
}

/*
  Types
*/
type onChainProvider = {
    connect: () => Promise<JsonRpcProvider | undefined>;
    disconnect: () => void;
    checkWrongNetwork: () => Promise<boolean>;
    hasCachedProvider: () => boolean;
    provider: JsonRpcProvider;
    address: string;
    connected: boolean;
    web3Modal: Web3Modal;
    chainID: number;
    vchainID: number;
    scanner?: string;
};

export type Web3ContextData = {
    onChainProvider: onChainProvider;
} | null;

const Web3Context = React.createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
    const web3Context = useContext(Web3Context);
    if (!web3Context) {
        throw new Error("useWeb3Context() can only be used inside of <Web3ContextProvider />, " + "please declare it at a higher level.");
    }
    const { onChainProvider } = web3Context;
    return useMemo(() => {
        return { ...onChainProvider };
    }, [web3Context]);
};

export const useAddress = () => {
    const { address } = useWeb3Context();
    return address;
};

export const WEB_3_MODAL = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions: {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                rpc: Object.fromEntries(CHAINS.map(c => [c.chainId, c.rpc[0]])),
                qrcode: true,
                qrcodeModalOptions: {
                    mobileLinks: ["metamask", "trust"],
                },
            },
        },
    },
});

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [chainID, setChainID] = useState(250);
    const [vchainID, setVChain] = useState(250);
    const [address, setAddress] = useState("");
    const [uri, setUri] = useState(FANTOM.rpc[0]);

    const [provider, setProvider] = useState<JsonRpcProvider>(new StaticJsonRpcProvider(uri));

    const hasCachedProvider = (): boolean => {
        if (!WEB_3_MODAL) return false;
        if (!WEB_3_MODAL.cachedProvider) return false;
        return true;
    };

    // NOTE (appleseed): none of these listeners are needed for Backend API Providers
    // ... so I changed these listeners so that they only apply to walletProviders, eliminating
    // ... polling to the backend providers for network changes
    const _initListeners = useCallback(
        rawProvider => {
            if (!rawProvider.on) {
                return;
            }
            rawProvider.on("accountsChanged", async (accounts: string[]) => {
                setTimeout(() => window.location.reload(), 1);
            });

            rawProvider.on("chainChanged", async (chain: number) => {
                _checkNetwork(chain);
                setVChain(chain);
                setTimeout(() => window.location.reload(), 1);
            });

            rawProvider.on("network", (_newNetwork: any, oldNetwork: any) => {
                if (!oldNetwork) return;
                window.location.reload();
            });
        },
        [provider],
    );

    const _checkNetwork = (otherChainID: number): boolean => {
        if (chainID === otherChainID) {
            return true;
        }

        const chain = CHAINS.find(c => c.chainId === otherChainID);
        if (!chain) {
            return false;
        }
        setChainID(chain.chainId);
        setUri(chain.rpc[0]);
        return true;
    };

    const _connect = useCallback(async (provider: ExternalProvider) => {
        // new _initListeners implementation matches Web3Modal Docs
        // ... see here: https://github.com/Web3Modal/web3modal/blob/2ff929d0e99df5edf6bb9e88cff338ba6d8a3991/example/src/App.tsx#L185
        _initListeners(provider);
        const connectedProvider = new Web3Provider(provider, "any");
        const chainId = await connectedProvider.getNetwork().then(network => network.chainId);
        setVChain(chainId);
        const connectedAddress = await connectedProvider.getSigner().getAddress();
        _checkNetwork(chainId);
        if (chainId !== FANTOM.chainId) {
            return;
        }
        setAddress(connectedAddress);
        setProvider(connectedProvider);
        setConnected(true);
        return connectedProvider;
    }, []);

    const connect = useCallback(async () => {
        if (connected && provider) {
            return provider;
        }

        // handling Ledger Live;
        let rawProvider;
        if (isIframe()) {
            rawProvider = new IFrameEthereumProvider();
        } else {
            rawProvider = await WEB_3_MODAL.connect();
        }

        return await _connect(rawProvider);
    }, [_connect, connected, provider]);

    useEffect(() => {
        if (connected) {
            return;
        }
        const onConnect = (provider: ExternalProvider) => {
            _connect(provider);
        };
        WEB_3_MODAL.on(CONNECT_EVENT, onConnect);
        return () => {
            WEB_3_MODAL.off(CONNECT_EVENT, onConnect);
        };
    }, [_connect, connected]);

    const checkWrongNetwork = async (): Promise<boolean> => {
        const chainId = await provider.getNetwork().then(network => network.chainId);
        setVChain(chainId);
        if (chainId == 250) {
            return false;
        }
        return true;
    };

    const disconnect = useCallback(async () => {
        WEB_3_MODAL.clearCachedProvider();
        setConnected(false);

        setTimeout(() => {
            window.location.reload();
        }, 1);
    }, [provider, connected]);

    const onChainProvider = useMemo(
        () => ({
            connect,
            disconnect,
            checkWrongNetwork,
            hasCachedProvider,
            provider,
            connected,
            address,
            chainID,
            vchainID,
            web3Modal: WEB_3_MODAL,
            uri,
        }),
        [connect, disconnect, checkWrongNetwork, hasCachedProvider, provider, connected, address, chainID, vchainID, uri],
    );

    useEffect(() => {
        // logs non-functioning nodes && returns an array of working mainnet nodes, could be used to optimize connection
        NodeHelper.checkAllNodesStatus();
    }, []);

    return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
