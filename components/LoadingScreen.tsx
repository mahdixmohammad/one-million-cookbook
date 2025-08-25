import Loading from "./Loading";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-white">
      <Loading />
    </div>
  );
}
