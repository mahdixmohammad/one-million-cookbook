import AdminSideBar from "@/components/AdminSideBar";
import NavBar from "@/components/NavBar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <AdminSideBar />
      <div className="flex-1">
        <NavBar />
        {children}
      </div>
    </div>
  );
}
