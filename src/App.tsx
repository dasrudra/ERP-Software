/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Shell } from "./components/layout/Shell";
import { User, UserRole } from "./types/erp";
import { Dashboard } from "./modules/dashboard/Dashboard";
import { CRM } from "./modules/crm/CRM";
import { ProductDevelopment } from "./modules/pd/ProductDevelopment";
import { Sales } from "./modules/sales/Sales";
import { Inventory } from "./modules/inventory/Inventory";
import { Production } from "./modules/production/Production";
import { Finance } from "./modules/finance/Finance";
import { HQReporting } from "./modules/hq/HQReporting";
import { Settings } from "./modules/settings/Settings";

const ACTIVE_TAB_STORAGE_KEY = "alpha-erp-active-tab";

const validTabs = [
  "dashboard",
  "crm",
  "pd",
  "sales",
  "production",
  "inventory",
  "finance",
  "hq",
  "settings",
] as const;

type AppTab = (typeof validTabs)[number];

const mockUser: User = {
  id: "U1",
  name: "M. Rahman",
  email: "rahman@alphabd.com",
  role: UserRole.CEO,
  department: "Executive",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    if (!isBrowserEnvironment()) {
      return "dashboard";
    }

    const savedTab = window.localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);

    return isValidTab(savedTab) ? savedTab : "dashboard";
  });

  useEffect(() => {
    if (isBrowserEnvironment()) {
      window.localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, activeTab);
    }
  }, [activeTab]);

  function handleSetActiveTab(tabId: string) {
    if (isValidTab(tabId)) {
      setActiveTab(tabId);
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "crm":
        return <CRM />;
      case "pd":
        return <ProductDevelopment />;
      case "sales":
        return <Sales />;
      case "production":
        return <Production />;
      case "inventory":
        return <Inventory />;
      case "finance":
        return <Finance />;
      case "hq":
        return <HQReporting />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Shell
      currentUser={mockUser}
      activeTab={activeTab}
      setActiveTab={handleSetActiveTab}
    >
      <div className="max-w-[1440px] mx-auto">{renderContent()}</div>
    </Shell>
  );
}

function isValidTab(tab: string | null): tab is AppTab {
  return validTabs.includes(tab as AppTab);
}

function isBrowserEnvironment() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}
