
import { useLocation, Link } from 'react-router-dom';
import { 
  BarChart2, 
  Home, 
  Leaf, 
  FileText, 
  AlertCircle, 
  MessageSquare, 
  Settings, 
  HelpCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: Home,
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: BarChart2,
    },
    {
      title: 'Crop Recommendation',
      path: '/crop-recommendation',
      icon: Leaf,
    },
    {
      title: 'Disease Detection',
      path: '/disease-detection',
      icon: AlertCircle,
    },
    {
      title: 'LLM Disease Detection',
      path: '/llm-disease-detection',
      icon: MessageSquare,
    },
  ];

  const bottomMenuItems = [
    {
      title: 'Documentation',
      path: '/docs',
      icon: FileText,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: Settings,
    },
    {
      title: 'Help & Support',
      path: '/help',
      icon: HelpCircle,
    },
  ];

  return (
    <ShadcnSidebar>
      <SidebarHeader className="flex h-16 items-center px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">FarmSense</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild className={cn(
                isActive(item.path) && 'bg-accent'
              )}>
                <Link to={item.path} className="flex items-center gap-2">
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive(item.path) ? "text-accent-foreground" : "text-muted-foreground"
                  )} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild className={cn(
                isActive(item.path) && 'bg-accent'
              )}>
                <Link to={item.path} className="flex items-center gap-2">
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive(item.path) ? "text-accent-foreground" : "text-muted-foreground"
                  )} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
