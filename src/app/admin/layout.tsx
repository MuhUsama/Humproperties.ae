import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

export const metadata = {
  title: "Admin Panel | Mohd. Alfalasi Real Estate",
  description: "Admin dashboard for managing real estate listings",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
