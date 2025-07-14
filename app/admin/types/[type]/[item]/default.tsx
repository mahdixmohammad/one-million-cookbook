import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ type: string; item: string }>;
};

export default async function Default(props: Props) {
  const { type, item } = await props.params

  redirect(`/admin/types/${type}/${item}`);
}