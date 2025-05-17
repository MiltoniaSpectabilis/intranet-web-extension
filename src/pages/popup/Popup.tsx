import withSuspense from "@src/shared/hoc/withSuspense";
import { useState, useEffect } from "react";
import { GetFiles } from "./components/getFiles";
import { Checker } from "./components/Checker";
import { DataProvider } from "./context/DataContext";
import { Collapse } from "./components/Collapse";
import Socials from "./components/Socials";
import Redirect from "./components/Redirect";
import { sendMessageToContent } from "@src/shared/utils/messages";
import { version } from "@root/package.json";
import { TbRefresh } from "react-icons/tb";
import ExternalLink from "@src/shared/components/ExternalLink";
import "@pages/popup/Popup.css";

export const Popup: React.FC = () => {
    // const [isWindowLoaded, setIsWindowLoaded] = useState(false);
    const [advancedTasksLocked, setAdvancedTasksLocked] = useState(false);
    const [isUrlMatch, setIsUrlMatch] = useState(null);

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const projectUrlPattern = new RegExp("^https://savanna.alxafrica.com/projects/\\d+");
            const url = tabs[0].url;
            console.log(url, projectUrlPattern.test(url));

            projectUrlPattern.test(url) ? setIsUrlMatch(true) : setIsUrlMatch(false);
        });
    }, []);

    useEffect(() => {
        if (isUrlMatch) {
            sendMessageToContent({ message: "get-project-data" }, (response) => {
                setAdvancedTasksLocked(response.advancedTasksLocked);
            });
        }
    }, [isUrlMatch]);

    const handleUnlockClick = () => {
        sendMessageToContent({ message: "unlock-advanced-tasks" }, (response) => {
            response.success && window.close(); // close the popup
        });
    };

    // ADD: screen loader
    // if (!isWindowLoaded)

    return (
        <>
            <Socials />
            {isUrlMatch && (
                <>
                    {advancedTasksLocked && (
                        <button id="unlock-advanced-tasks" className="badge label" onClick={handleUnlockClick}>
                            Unlock Advanced Tasks
                            <TbRefresh className="icon" />
                        </button>
                    )}
                    <GetFiles />
                    <DataProvider>
                        <Checker />
                    </DataProvider>
                    <Collapse />
                </>
            )}
            {isUrlMatch === false && <Redirect />}
            <div className="emoji-block">
                <span className="emoji">🇵🇸</span>
                <ExternalLink
                    href="https://twitter.com/i/status/1715405849785667825"
                    className="link text"
                    text="Stop Genocide in Palestine"
                />
            </div>
            <a
                id="version"
                href="https://github.com/amasin76/intranet-web-extension/releases"
                target="_blank"
                rel="noopener noreferrer"
                title="Releases"
            >
                v{version}
            </a>
        </>
    );
};

export default withSuspense(Popup, <div>Loading...</div>);
