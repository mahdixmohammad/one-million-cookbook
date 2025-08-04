import LoadingImage from "@/components/LoadingImage";
import { EllipsisHorizontalIcon, PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ type: string; }>;
};

export default async function TypePage(props: Props) {
  let { type } = await props.params
  type = decodeURIComponent(type);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/types/${type}`, {
    cache: "no-store",
  });

  const typeData = await res.json();

  if (typeData["error"]) notFound();

  return (
    <>
      <div className="w-[98%] mx-auto mt-4 bg-white shadow-[0px_0px_10px_0.5px_rgba(0,0,0,0.15)] rounded-lg xs:px-3 py-3">
        <div className="px-3 flex gap-2 items-center">
          <h3 className="font-bold text-lg">النوع</h3>
          <Link href={`/admin/types/${type}/edit`} className="border-[0px] bg-gray-500 text-white border-gray-600 w-22 h-7 flex justify-center items-center rounded-xl text-sm hover:bg-gray-600 transition-all duration-150">
            <PencilSquareIcon className="w-5" />
            تحرير
          </Link>
          <Link href={`/admin/types/${type}/delete`} className="border-[0px] bg-red-800 text-white border-gray-600 w-22 h-7 flex justify-center items-center rounded-xl text-sm hover:bg-red-900 transition-all duration-150">
            <TrashIcon className="w-5" />
            حذف
          </Link>
        </div>
        <div className="overflow-x-auto mt-3 rounded-xl">
          <table className="w-full min-w-[300px] border-separate border-spacing-y-2">
            <thead className="text-right text-gray-600 bg-white">
              <tr>
                <th className="pr-5 font-normal">الصورة</th>
                <th className="font-normal">الاسم</th>
                <th className="font-normal">المنتجات</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100 h-24">
                <td className="rounded-r-xl sm:min-w-[150px]">
                  <LoadingImage position="start" src={typeData["image"]} alt="" width={90} height={90}></LoadingImage>
                </td>
                <td className="sm:min-w-[150px]">
                  <h3>{type}</h3>
                </td>
                <td className="sm:min-w-[150px]">
                  <h3>{typeData?.["items"] ? Object.keys(typeData["items"]).length : 0}</h3>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-[98%] mx-auto mt-4 bg-white shadow-[0px_0px_10px_0.5px_rgba(0,0,0,0.15)] rounded-lg xs:px-3 py-3">
        <div className="flex gap-2 items-center px-3">
          <h3 className="font-bold text-lg">المنتجات</h3>
          <Link href={`/admin/types/${type}/create`} className="bg-green-700 text-white w-22 h-7 flex justify-center items-center rounded-xl text-sm hover:bg-green-800 transition-all duration-150">
            <PlusIcon className="w-5" />
            انشاء
          </Link>
        </div>
        <div className="overflow-x-auto mt-3 rounded-xl">
          <table className="w-full min-w-[300px] border-separate border-spacing-y-2">
            <thead className="text-right text-gray-600 bg-white">
              <tr>
                <th className="pr-5 font-normal">الصورة</th>
                <th className="font-normal">الاسم</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {typeData["items"] && Object.keys(typeData["items"]).map((itemName, i) => (
              <tr key={i} className="bg-gray-100 h-24">
                <td className="rounded-r-xl sm:min-w-[150px]">
                  <Link href={`/admin/types/${type}/${itemName}`}>
                    <LoadingImage className="h-24 object-contain" position="start" src={typeData.items[itemName].image} alt="" width={90} height={90}></LoadingImage>
                  </Link>
                </td>
                <td className="sm:min-w-[150px]">
                  <Link href={`/admin/types/${type}/${itemName}`}>
                    <h3 className="h-24 flex items-center">{itemName}</h3>
                  </Link>
                </td>
                <td className="rounded-l-xl pl-5">
                    <Link href={`/admin/types/${type}/${itemName}`}>
                        <div className="h-24 flex justify-end items-center">
                            <EllipsisHorizontalIcon className="w-8 h-8 text-gray-500 rounded-lg hover:bg-gray-50 transition-all duration-150" />
                        </div>
                    </Link>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className="px-3">
          {typeData?.["items"] ? Object.keys(typeData["items"]).length : 0} نتائج
        </div>
      </div>
    </>
  );
}
