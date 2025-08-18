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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/types/${type}/${item}`,
    {
      cache: "no-store",
    },
  );

  const itemData = await res.json();

  if (itemData["error"]) notFound();

  const ingredientsList = itemData.ingredients.split("#");
  const instructionsList = itemData.instructions.split("#");

  return (
    <div className="mx-auto mt-4 w-[98%] rounded-lg bg-white px-3 py-3 shadow">
      <div className="flex items-center gap-2 px-2">
        <h3 className="text-lg font-bold">المنتج</h3>
        <Link
          href={`/admin/types/${type}/${item}/edit`}
          className="flex h-7 w-22 items-center justify-center rounded-xl border-[0px] border-gray-600 bg-gray-500 text-sm text-white transition-all duration-150 hover:bg-gray-600"
        >
          <PencilSquareIcon className="w-5" />
          تحرير
        </Link>
        <Link
          href={`/admin/types/${type}/${item}/delete`}
          className="flex h-7 w-22 items-center justify-center rounded-xl border-[0px] border-gray-600 bg-red-800 text-sm text-white transition-all duration-150 hover:bg-red-900"
        >
          <TrashIcon className="w-5" />
          حذف
        </Link>
      </div>
      <div className="mt-4 w-full lg:mt-10">
        <div className="grid w-full auto-rows-auto grid-cols-1 items-center gap-x-10 gap-y-5 rounded-xl bg-gray-100 px-7 py-3 transition-all duration-150 lg:grid-cols-[auto_auto__auto_200px_1fr] lg:grid-rows-1 lg:px-6 lg:py-8">
          <div className="relative flex h-full flex-col items-start justify-between gap-y-1 lg:justify-start">
            <h3 className="text-center text-gray-600 lg:absolute lg:-top-[58px] lg:w-full">
              الصورة
            </h3>
            <LoadingImage
              position="start"
              src={itemData["image"]}
              alt=""
              width={90}
              height={90}
            ></LoadingImage>
          </div>
          <div className="relative flex h-full flex-col items-start justify-between gap-y-1 lg:justify-start">
            <h3 className="text-center text-gray-600 lg:absolute lg:-top-[58px] lg:w-full">
              الاسم
            </h3>
            <h3>{item}</h3>
          </div>
          <div className="relative flex h-full flex-col items-start justify-between gap-y-1 lg:justify-start">
            <h3 className="text-center text-gray-600 lg:absolute lg:-top-[58px] lg:w-full">
              العمليات
            </h3>
            <h3>{itemData["completions"]}</h3>
          </div>
          <div className="relative flex h-full flex-col items-start justify-between gap-y-1 lg:items-center lg:justify-start">
            <h3 className="text-center text-gray-600 lg:absolute lg:-top-[58px] lg:w-full">
              المكونات
            </h3>
            <ul className="max-w-full list-disc pl-5">
              {ingredientsList.map((ingredient: string, i: number) => {
                return (
                  <li key={i} className="break-words">
                    {ingredient}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative flex h-full flex-col items-start justify-between gap-y-1 lg:items-center lg:justify-start">
            <h3 className="text-center text-gray-600 lg:absolute lg:-top-[58px] lg:w-full">
              التعليمات
            </h3>
            <ul className="max-w-full list-disc pl-5 break-words">
              {instructionsList.map((instruction: string, i: number) => {
                return (
                  <li key={i} className="break-words">
                    {instruction}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
