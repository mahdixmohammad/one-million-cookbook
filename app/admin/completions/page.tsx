import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function Page() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/completions`,
    {
      cache: "no-store",
    },
  );

  const completionsData = await res.json();
  const dates = Object.keys(completionsData).reverse();

  return (
    <section className="xs:px-3 rounded-lg bg-white py-3 shadow">
      <div className="xs:px-0 flex gap-2 px-3">
        <CalendarDaysIcon className="w-6" />
        <h3 className="text-lg font-bold">العمليات</h3>
      </div>
      <div className="mt-3 max-h-[290px] overflow-auto rounded-xl">
        <table className="w-full min-w-[340px] border-separate border-spacing-y-1">
          <thead className="sticky top-0 z-10 bg-white text-right text-gray-600">
            <tr>
              <th className="pr-2 font-normal">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {dates.map((date, i) => (
              <tr
                key={i}
                className="h-11 bg-gray-100 transition-all duration-150 hover:opacity-80"
              >
                <td className="rounded-r-lg pr-2 font-bold">
                  <Link
                    className="flex h-11 items-center"
                    href={`/admin/completions/${date}`}
                  >
                    {date}
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
