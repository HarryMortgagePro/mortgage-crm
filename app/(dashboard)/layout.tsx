import DashboardLayout from '@/components/DashboardLayout';
import AuthCheck from '@/components/AuthCheck';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthCheck>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthCheck>
  );
}
