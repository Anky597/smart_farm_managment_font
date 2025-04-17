
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Set page title based on route
    const pageTitle = getPageTitle(location.pathname);
    document.title = `FarmSense | ${pageTitle}`;
  }, [location]);

  const getPageTitle = (pathname: string): string => {
    const path = pathname.split('/')[1];
    if (!path) return 'Home';
    
    // Capitalize first letter and add spaces before capital letters
    return path.charAt(0).toUpperCase() + 
           path.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {isAuthenticated && <Sidebar />}
        <div className="flex-1 flex flex-col min-h-screen">
          {isAuthenticated && <Navbar />}
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
