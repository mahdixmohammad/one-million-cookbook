import LoadingImage from "@/components/LoadingImage";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ type: string; item: string }>;
};

export default async function Type(props: Props) {
  let { type, item } = await props.params;
  type = decodeURIComponent(type);
  item = decodeURIComponent(item);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/types/${type}/${item}`, {
    cache: "no-store",
  });

  const itemData = await res.json();

  if (itemData["error"]) notFound();

  const ingredientsList = itemData.ingredients.split("#");
  const instructionsList = itemData.instructions.split("#");

  return (
        <div className="w-[98%] mx-auto mt-4 bg-white shadow-[0px_0px_10px_0.5px_rgba(0,0,0,0.15)] rounded-lg px-3 py-3">
                <div className="px-2 flex gap-2 items-center">
                    <h3 className="font-bold text-lg">المنتج</h3>
                    <Link href={`/admin/types/${type}/${item}/edit`} className="border-[0px] bg-gray-500 text-white border-gray-600 w-22 h-8 flex justify-center items-center rounded-xl text-sm hover:bg-gray-600 transition-all duration-150">
                        <PencilSquareIcon className="w-5" />
                        تحرير
                    </Link>
                    <Link href={`/admin/types/${type}/${item}/delete`} className="border-[0px] bg-red-800 text-white border-gray-600 w-22 h-8 flex justify-center items-center rounded-xl text-sm hover:bg-red-900 transition-all duration-150">
                        <TrashIcon className="w-5" />
                        حذف
                    </Link>
                </div>
                <div className="w-full mt-4 lg:mt-10">
                    <div className="grid auto-rows-auto grid-cols-1 gap-y-5 gap-x-10 lg:grid-rows-1 lg:grid-cols-[auto_auto_200px_1fr] w-full px-7 lg:px-6 py-3 lg:py-8 bg-gray-100 rounded-xl items-center transition-all duration-150">
                        <div className="relative h-full flex flex-col justify-between items-start lg:justify-start gap-y-1">
                            <h3 className="lg:w-full lg:absolute lg:-top-[58px] text-gray-600 text-center">الصورة</h3>
                            <LoadingImage position="start" src={itemData["image"]} alt="" width={90} height={90}></LoadingImage>
                        </div>
                        <div className="relative h-full flex flex-col justify-between items-start lg:justify-start gap-y-1">
                            <h3 className="lg:w-full lg:absolute lg:-top-[58px] text-gray-600 text-center">الاسم</h3>
                            <h3>{item}</h3>
                        </div>
                        <div className="relative h-full flex flex-col justify-between items-start lg:justify-start lg:items-center gap-y-1">
                            <h3 className="lg:w-full lg:absolute lg:-top-[58px] text-gray-600 text-center">المكونات</h3>
                            <ul className="max-w-full pl-5 list-disc">
                                {ingredientsList.map((ingredient: string, i: number) => {
                                    return (
                                    <li key={i} className="break-words">
                                        {ingredient}
                                    </li>)
                                })}
                            </ul>
                        </div>
                        <div className="relative h-full flex flex-col justify-between items-start lg:justify-start lg:items-center gap-y-1">
                            <h3 className="lg:w-full lg:absolute lg:-top-[58px] text-gray-600 text-center">التعليمات</h3>
                            <ul className="max-w-full pl-5 list-disc break-words">
                                {instructionsList.map((instruction: string, i: number) => {
                                    return (
                                    <li key={i} className="break-words">
                                        {instruction}
                                    </li>)
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
        </div>
  );
}
