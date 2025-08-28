import { notFound } from "next/navigation";
import { getUsername } from "@/lib/db/users";
import { getImage } from "@/lib/db/items";
import CompletionsTable from "@/components/admin/CompletionsTable";

type Props = {
  params: Promise<{ date: string }>;
};

export default async function Page(props: Props) {
  const { date } = await props.params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/completions/${date}`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();

  if (data.error) notFound();

  const completions: {
    date: string;
    item: string;
    quantity: number;
    type: string;
    uid: string;
    image: string;
    user: string;
  }[] = await Promise.all(
    Object.values(data)
      .reverse()
      .map(async (element: any) => {
        const image = await getImage(element.type, element.item);
        const user = await getUsername(element.uid);

        return {
          ...element,
          image,
          user,
        };
      }),
  );
  // Extract unique filter options
  const types = Array.from(new Set(completions.map((c) => c.type)));
  const items = Array.from(new Set(completions.map((c) => c.item)));
  const users = Array.from(new Set(completions.map((c) => c.user)));

  return (
    <CompletionsTable
      completions={completions}
      types={types}
      items={items}
      users={users}
    />
  );
}
