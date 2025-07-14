import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ type: string; item: string }>;
};

export default async function Type(props: Props) {
  const { type, item } = await props.params;

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
                    <h3 className="font-bold text-lg">Item</h3>
                    <Link href={`/admin/types/${type}/edit`} className="border-[0px] bg-gray-500 text-white border-gray-600 w-22 h-8 flex justify-center items-center rounded-xl text-sm hover:bg-gray-600 transition-all duration-150">
                        <svg className="w-5 h-5" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit
                    </Link>
                    <Link href={`/admin/types/${type}/delete`} className="border-[0px] bg-red-800 text-white border-gray-600 w-22 h-8 flex justify-center items-center rounded-xl text-sm hover:bg-red-900 transition-all duration-150">
                        <svg className="w-5 h-5" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Delete
                    </Link>
                </div>
                <div className="w-full mt-10">
                    <div className="grid auto-rows-auto gap-y-5 gap-x-10 lg:grid-rows-1 lg:grid-cols-[auto_auto_200px_1fr] w-full px-8 lg:px-6 py-5 lg:py-10 bg-gray-100 rounded-xl items-center transition-all duration-150">
                        <div className="relative h-full flex flex-col justify-between items-start lg:justify-center gap-y-2">
                            <h3 className="lg:w-full lg:absolute lg:-top-[66px] text-gray-600 text-center">Image</h3>
                            <Image className="" src={itemData["image"]} alt="" width={90} height={90}></Image>
                        </div>
                        <div className="relative h-full flex flex-col justify-between items-start  lg:justify-center gap-y-2">
                            <h3 className="lg:w-full lg:absolute lg:-top-[66px] text-gray-600 text-center">Name</h3>
                            <h3>{item}</h3>
                        </div>
                        <div className="relative h-full flex flex-col justify-between items-start lg:justify-center lg:items-center gap-y-2">
                            <h3 className="lg:w-full lg:absolute lg:-top-[66px] text-gray-600 text-center">Ingredients</h3>
                            <ul className="pl-5 lg:pl-0 list-disc">
                                {ingredientsList.map((ingredient: string, i: number) => {
                                    return (
                                    <li key={i}>
                                        <p>{ingredient}</p>
                                    </li>)
                                })}
                            </ul>
                        </div>
                        <div className="relative h-full flex flex-col justify-between items-start lg:justify-center lg:items-center gap-y-2">
                            <h3 className="lg:w-full lg:absolute lg:-top-[66px] text-gray-600 text-center">Instructions</h3>
                            <ul className="pl-5 lg:pl-0 list-disc">
                                {instructionsList.map((instruction: string, i: number) => {
                                    return (
                                    <li key={i}>
                                        <p>{instruction}</p>
                                    </li>)
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
        </div>
  );
}
