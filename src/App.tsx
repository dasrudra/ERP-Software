/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Shell } from './components/layout/Shell';
import { User, UserRole } from './types/erp';
import { Dashboard } from './modules/dashboard/Dashboard';
import { CRM } from './modules/crm/CRM';
import { ProductDevelopment } from './modules/pd/ProductDevelopment';
import { Sales } from './modules/sales/Sales';
import { Inventory } from './modules/inventory/Inventory';
import { Production } from './modules/production/Production';
import { Finance } from './modules/finance/Finance';
import { HQReporting } from './modules/hq/HQReporting';
import { Settings } from './modules/settings/Settings';
import { Placeholder } from './components/ui/Placeholder';

const mockUser: User = {
  id: 'U1',
  name: 'M. Rahman',
  email: 'rahman@alphabd.com',
  role: UserRole.CEO,
  department: 'Executive'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'crm':
        return <CRM />;
      case 'pd':
        return <ProductDevelopment />;
      case 'sales':
        return <Sales />;
      case 'production':
        return <Production />;
      case 'inventory':
        return <Inventory />;
      case 'finance':
        return <Finance />;
      case 'hq':
        return <HQReporting />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Shell 
      currentUser={mockUser} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      <div className="max-w-[1440px] mx-auto">
        {renderContent()}
      </div>
    </Shell>
  );
}

