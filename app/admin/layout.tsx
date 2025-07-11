import AdminSideBar from "@/components/AdminSideBar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <AdminSideBar />
      {children}
    </div>
  );
}
