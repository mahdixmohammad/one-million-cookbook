import LoadingImage from "@/components/LoadingImage";
import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function Types() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/types`, {
        cache: "no-store",
    });

    const typesData = await res.json();

    return (
        <div className="flex flex-col gap-10">
            <div className="w-[98%] mx-auto mt-4 bg-white shadow-[0px_0px_10px_0.5px_rgba(0,0,0,0.15)] rounded-lg xs:px-3 py-3">
                <div className="flex gap-2 items-center px-3">
                    <h3 className="font-bold text-lg">الأنواع</h3>
                    <Link href="/admin/types/create" className="bg-green-700 text-white w-21 h-7 flex justify-center items-center rounded-xl text-sm hover:bg-green-800 transition-all duration-150">
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
                                <th className="font-normal">المنتجات</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(typesData).map((typeName, i) => (
                            <tr key={i} className="bg-gray-100 h-24 hover:bg-gray-200 transition-all duration-150">
                                <td className="rounded-r-xl sm:min-w-[150px]">
                                    <Link className=" w-full h-full" href={`/admin/types/${typeName}`}>
                                        <LoadingImage className="h-24 object-contain" position="start" src={typesData[typeName]["image"]} alt="" width={90} height={90}></LoadingImage>
                                    </Link>
                                </td>
                                <td className="sm:min-w-[150px]">
                                    <Link href={`/admin/types/${typeName}`}>
                                        <h3 className="h-24 flex items-center">{typeName}</h3>
                                    </Link>
                                </td>
                                <td className="sm:min-w-[150px]">
                                    <Link href={`/admin/types/${typeName}`}>
                                        <h3 className="h-24 flex items-center">{typesData[typeName]?.["items"] ? Object.keys(typesData[typeName]["items"]).length : 0}</h3>
                                    </Link>
                                </td>
                                <td className="rounded-l-xl pl-5">
                                    <Link href={`/admin/types/${typeName}`}>
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
                    {Object.keys(typesData).length} نتائج
                </div>
            </div>
        </div>
    )
}