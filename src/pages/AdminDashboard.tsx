import { AuthCheck } from "@/components/AuthCheck";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { OrganizedAdminDashboard } from "@/components/admin/OrganizedAdminDashboard";

const AdminDashboard = () => {
  return (
    <AuthCheck requireAdmin={true}>
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="p-0">
            <OrganizedAdminDashboard />
          </div>

          <Footer />
        </div>
      </>
    </AuthCheck>
  );
};

export default AdminDashboard;
