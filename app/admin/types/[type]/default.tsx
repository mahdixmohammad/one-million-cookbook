import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ type: string; }>;
};

export default async function Default(props: Props) {
  const { type } = await props.params

  redirect(`/admin/types/${type}`);
}