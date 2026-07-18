import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Logo } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { AuthGuard } from '@/components/layout/auth-guard';
import { PageTransition } from '@/components/layout/page-transition';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter>
            <Separator className="my-2" />
            {/* Footer content can go here */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <PageTransition>{children}</PageTransition>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
