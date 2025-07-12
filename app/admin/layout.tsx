import AdminSideBar from "@/components/AdminSideBar";
import NavBar from "@/components/NavBar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSideBar />
      <div className="flex-1 overflow-y-auto">
        <NavBar />
        {children}
      </div>
    </div>
  );
}
