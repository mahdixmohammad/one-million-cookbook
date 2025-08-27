import LoadingImage from "@/components/LoadingImage";
import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function Types() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/types`);

  const typesData = await res.json();

  return (
    <section className="xs:px-3 rounded-lg bg-white py-3 shadow">
      <div className="flex items-center gap-2 px-3">
        <h3 className="text-lg font-bold">الأنواع</h3>
        <Link
          href="/admin/types/create"
          className="flex h-7 w-21 items-center justify-center rounded-xl bg-green-700 text-sm text-white transition-all duration-150 hover:bg-green-800"
        >
          <PlusIcon className="w-5" />
          انشاء
        </Link>
      </div>
      <div className="mt-3 overflow-x-auto rounded-xl">
        <table className="w-full min-w-[380px] border-separate border-spacing-y-2">
          <thead className="bg-white text-right text-gray-600">
            <tr>
              <th className="pr-5 font-normal">الصورة</th>
              <th className="font-normal">الاسم</th>
              <th className="font-normal">المنتجات</th>
              <th className="font-normal">العمليات</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(typesData).map((typeName, i) => (
              <tr
                key={i}
                className="h-24 bg-gray-100 transition-all duration-150 hover:opacity-80"
              >
                <td className="rounded-r-xl md:min-w-[150px]">
                  <Link
                    className="h-full w-full"
                    href={`/admin/types/${typeName}`}
                  >
                    <LoadingImage
                      className="h-24 object-contain"
                      position="start"
                      src={typesData[typeName]["image"]}
                      alt=""
                      width={90}
                      height={90}
                    ></LoadingImage>
                  </Link>
                </td>
                <td className="md:min-w-[150px]">
                  <Link href={`/admin/types/${typeName}`}>
                    <h3 className="flex h-24 items-center">{typeName}</h3>
                  </Link>
                </td>
                <td className="md:min-w-[150px]">
                  <Link href={`/admin/types/${typeName}`}>
                    <h3 className="flex h-24 items-center">
                      {typesData[typeName]?.["items"]
                        ? Object.keys(typesData[typeName]["items"]).length
                        : 0}
                    </h3>
                  </Link>
                </td>
                <td className="md:min-w-[150px]">
                  <Link href={`/admin/types/${typeName}`}>
                    <h3 className="flex h-24 items-center">
                      {typesData[typeName]["completions"]}
                    </h3>
                  </Link>
                </td>
                <td className="rounded-l-xl pl-5">
                  <Link href={`/admin/types/${typeName}`}>
                    <div className="flex h-24 items-center justify-end">
                      <EllipsisHorizontalIcon className="h-8 w-8 rounded-lg text-gray-500 transition-all duration-150 hover:bg-gray-50" />
                    </div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-3">{Object.keys(typesData).length} نتائج</div>
    </section>
  );
}
