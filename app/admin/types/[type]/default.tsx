import TypeContent from "./TypeContent";

export default function Default({ params }: { params: { type: string } }) {
  return <TypeContent type={params.type} />;
}