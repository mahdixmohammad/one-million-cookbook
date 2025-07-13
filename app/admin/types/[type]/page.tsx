import TypeContent from "./TypeContent";

export default function TypePage({ params }: { params: { type: string } }) {
  return <TypeContent type={params.type} />;
}
