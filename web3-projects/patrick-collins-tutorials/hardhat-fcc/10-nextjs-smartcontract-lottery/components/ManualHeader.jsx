import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) {
            return
        }
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected") == "injected") {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log("Account changed to " + account)
            if (account == null) {
                window.localStorage.removeItem('connected')
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, []) // Empty array means it runs only once at page load

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()

                        //Next js has problems sometimes with the window variable, hence the if
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}
