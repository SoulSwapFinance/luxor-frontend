import React, { useState, ReactElement, useContext, useCallback, useEffect, useMemo, createContext } from "react";
import Web3Modal, { CONNECT_EVENT } from "web3modal";
import { ExternalProvider, JsonRpcFetchFunc, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { IFrameEthereumProvider } from "@ledgerhq/iframe-provider";
import { Chain, CHAINS, FANTOM } from "./helpers/chains";
import { switchNetwork } from "../../helpers/switch-network";
import { useWeb3Context, WEB_3_MODAL } from "./web3-context";

export enum Web3Connection {
    Disconnected,
    ConnectedWrongChain,
    Connected,
}

type Web3ChainStatus =
    | {
          connection: Web3Connection.Connected;
          chain: Chain;
          address: string;
          provider: Web3Provider;
      }
    | {
          connection: Web3Connection.ConnectedWrongChain;
          switchChain: () => Promise<void>;
          chain: Chain;
      }
    | {
          connection: Web3Connection.Disconnected;
          connect: () => Promise<void>;
      };

interface ContextProps {
    connected?: Chain;
    address?: string;
    connect?: () => Promise<void>;
    provider?: Web3Provider;
}

// const Web3Chain = React.createContext<ContextProps>();
// export function useWeb3Chain(want: Chain): Web3ChainStatus {
//     const { address, connected, connect } = useWeb3Context();

//     return useMemo(() => {
//         if (!connected) {
//             return { connection: Web3Connection.Disconnected, connect };
//         }

//         if (connected?.chainId !== want?.chainId) {
//             return {
//                 connection: Web3Connection.ConnectedWrongChain,
//                 chain: connected,
//                 switchChain: async () => switchNetwork(want),
//             };
//         }

//         return { connection: Web3Connection.Connected, switchChain, chain: connected, address, provider };
//     }, [connected, chain, address, connect, want, provider]);
// }

export const Web3ChainProvider = () => {
    const [chain, setChain] = useState<Chain>();
    const [address, setAddress] = useState<string>();
    const [provider, setProvider] = useState<Web3Provider>();
    // const [provider, setProvider] = useState<Web3Provider>(undefined);

    const onConnect = useCallback(async externalProvider => {
        externalProvider.on("accountsChanged", async (accounts: string[]) => {
            location.reload();
        });

        externalProvider.on("chainChanged", async (chain: number) => {
            location.reload();
        });

        externalProvider.on("network", (_newNetwork: any, oldNetwork: any) => {
            location.reload();
        });
        const connectedProvider = new Web3Provider(externalProvider, "any");
        setProvider(connectedProvider);
    }, []);

    const connect = useCallback(async () => {
        let externalProvider;
        if (window.location !== window.parent.location) {
            // Ledger Live
            externalProvider = new IFrameEthereumProvider();
        } else {
            try {
                externalProvider = await WEB_3_MODAL.connect();
            } catch (e) {
                console.error("wallet isn't logged in");
            }
        }

        if (!externalProvider) {
            return;
        }
        onConnect(externalProvider);
    }, [onConnect]);

    useEffect(() => {
        if (chain != undefined) {
            return;
        }
        WEB_3_MODAL.on(CONNECT_EVENT, onConnect);
        return () => {
            WEB_3_MODAL.off(CONNECT_EVENT, onConnect);
        };
    }, [onConnect, chain]);

    useEffect(() => {
        // Always run connect() on application start.
        if (WEB_3_MODAL.cachedProvider) {
            connect();
        }
    }, []);

    useEffect(() => {
        if (provider == undefined) {
            setChain(undefined);
            setAddress(undefined);
            return;
        }

        let isCanceled = false;
        (async function () {
            const chainId = await provider.getNetwork().then(network => network.chainId);
            const chain = CHAINS.find(c => c.chainId === chainId);
            const address = await provider.getSigner().getAddress();

            if (isCanceled) {
                return;
            }

            setChain(chain);
            setAddress(address);
        })();

        return () => {
            isCanceled = true;
        };
    }, [provider]);

    return Web3ChainProvider;
    // return <Web3Chain.Provider value={{ connected: chain, connect, address, provider }}>{children}</Web3Chain.Provider>;
};
