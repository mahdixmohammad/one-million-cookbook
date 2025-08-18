import LoadingImage from "@/components/LoadingImage";
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ type: string }>;
};

export default async function TypePage(props: Props) {
  let { type } = await props.params;
  type = decodeURIComponent(type);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/types/${type}`,
    {
      cache: "no-store",
    },
  );

  const typeData = await res.json();

  if (typeData["error"]) notFound();

  return (
    <>
      <div className="xs:px-3 mx-auto mt-4 w-[98%] rounded-lg bg-white py-3 shadow">
        <div className="flex items-center gap-2 px-3">
          <h3 className="text-lg font-bold">النوع</h3>
          <Link
            href={`/admin/types/${type}/edit`}
            className="flex h-7 w-22 items-center justify-center rounded-xl border-gray-600 bg-gray-500 text-sm text-white transition-all duration-150 hover:bg-gray-600"
          >
            <PencilSquareIcon className="w-5" />
            تحرير
          </Link>
          <Link
            href={`/admin/types/${type}/delete`}
            className="flex h-7 w-22 items-center justify-center rounded-xl border-gray-600 bg-red-800 text-sm text-white transition-all duration-150 hover:bg-red-900"
          >
            <TrashIcon className="w-5" />
            حذف
          </Link>
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl">
          <table className="w-full min-w-[300px] border-separate border-spacing-y-2">
            <thead className="bg-white text-right text-gray-600">
              <tr>
                <th className="pr-5 font-normal">الصورة</th>
                <th className="font-normal">الاسم</th>
                <th className="font-normal">المنتجات</th>
                <th className="font-normal">العمليات</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-24 bg-gray-100">
                <td className="rounded-r-xl sm:min-w-[150px]">
                  <LoadingImage
                    position="start"
                    src={typeData["image"]}
                    alt=""
                    width={90}
                    height={90}
                  ></LoadingImage>
                </td>
                <td className="sm:min-w-[150px]">
                  <h3>{type}</h3>
                </td>
                <td className="sm:min-w-[150px]">
                  <h3>
                    {typeData?.["items"]
                      ? Object.keys(typeData["items"]).length
                      : 0}
                  </h3>
                </td>
                <td className="sm:min-w-[150px]">
                  <h3>{typeData["completions"]}</h3>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="xs:px-3 mx-auto mt-4 w-[98%] rounded-lg bg-white py-3 shadow">
        <div className="flex items-center gap-2 px-3">
          <h3 className="text-lg font-bold">المنتجات</h3>
          <Link
            href={`/admin/types/${type}/create`}
            className="flex h-7 w-22 items-center justify-center rounded-xl bg-green-700 text-sm text-white transition-all duration-150 hover:bg-green-800"
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
                <th className="font-normal">العمليات</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {typeData["items"] &&
                Object.keys(typeData["items"]).map((itemName, i) => (
                  <tr
                    key={i}
                    className="h-24 bg-gray-100 transition-all duration-150 hover:opacity-80"
                  >
                    <td className="rounded-r-xl sm:min-w-[150px]">
                      <Link href={`/admin/types/${type}/${itemName}`}>
                        <LoadingImage
                          className="h-24 object-contain"
                          position="start"
                          src={typeData.items[itemName].image}
                          alt=""
                          width={90}
                          height={90}
                        ></LoadingImage>
                      </Link>
                    </td>
                    <td className="sm:min-w-[150px]">
                      <Link href={`/admin/types/${type}/${itemName}`}>
                        <h3 className="flex h-24 items-center">{itemName}</h3>
                      </Link>
                    </td>
                    <td className="sm:min-w-[150px]">
                      <h3>{typeData.items[itemName]["completions"]}</h3>
                    </td>
                    <td className="rounded-l-xl pl-5">
                      <Link href={`/admin/types/${type}/${itemName}`}>
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
        <div className="px-3">
          {typeData?.["items"] ? Object.keys(typeData["items"]).length : 0}{" "}
          نتائج
        </div>
      </div>
    </>
  );
}
