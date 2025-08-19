import Item from "@/components/Item";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ type: string; item: string }>;
};

export default async function Page(props: Props) {
  let { type, item } = await props.params;
  type = decodeURIComponent(type);
  item = decodeURIComponent(item);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/types/${type}/${item}`,
    { cache: "no-store" },
  );
  const itemData = await res.json();

  if (itemData["error"]) notFound();

  return <Item type={type} item={item} data={itemData} />;
}
