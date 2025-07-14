export default function TypeLayout({ children, modal }: {children: React.ReactNode;
  modal: React.ReactNode;}) {
  return (
    <>
      {children}
      <div className="h-screen">
        {modal}
      </div>
    </>
  );
}
