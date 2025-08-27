import { notFound } from "next/navigation";
import { formatter } from "@/utils/format-time";
import { getUsername } from "@/lib/db/users";
import { getImage } from "@/lib/db/items";
import LoadingImage from "@/components/LoadingImage";
import Link from "next/link";

type Props = {
  params: Promise<{ date: string }>;
};

export default async function Page(props: Props) {
  const { date } = await props.params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/completions/${date}`,
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

  return (
    <section className="xs:px-3 rounded-lg bg-white py-3 shadow">
      <div className="xs:px-0 flex gap-2 px-3">
        <h3 className="text-lg font-bold">العمليات</h3>
      </div>
      <div className="mt-3 max-h-[290px] overflow-auto rounded-xl">
        <table className="w-full min-w-[600px] border-separate border-spacing-y-1">
          <thead className="sticky top-0 z-10 bg-white text-right text-gray-600">
            <tr>
              <th className="pr-2 font-normal">الصورة</th>
              <th className="pr-2 font-normal">النوع</th>
              <th className="font-normal">المنتج</th>
              <th className="font-normal">الكمية</th>
              <th className="font-normal">التاريخ</th>
              <th className="font-normal">المستخدم</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {completions.map((completion, i) => (
              <tr
                key={i}
                className="h-13 bg-gray-100 transition-all duration-150 hover:opacity-80"
              >
                <td className="rounded-r-lg pr-2">
                  <Link
                    href={`/admin/types/${completion.type}/${completion.item}`}
                  >
                    <LoadingImage
                      src={completion.image}
                      alt={completion.item}
                      position="start"
                      width={50}
                      height={50}
                      className="rounded object-contain"
                      loadingSize="small"
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/admin/types/${completion.type}/${completion.item}`}
                    className="flex h-13 items-center"
                  >
                    {completion.type}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/admin/types/${completion.type}/${completion.item}`}
                    className="flex h-13 items-center"
                  >
                    {completion.item}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/admin/types/${completion.type}/${completion.item}`}
                    className="flex h-13 items-center"
                  >
                    {completion.quantity}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/admin/types/${completion.type}/${completion.item}`}
                    dir="ltr"
                    className="flex h-13 flex-col items-end justify-end text-sm sm:flex-row sm:items-center"
                  >
                    {formatter
                      .format(new Date(completion.date))
                      .split(", ")
                      .map((part, i) => (
                        <span key={i}>
                          {part}
                          {i === 0 && ","}
                        </span>
                      ))}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/admin/types/${completion.type}/${completion.item}`}
                    className="flex h-13 items-center"
                  >
                    {completion.user}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
