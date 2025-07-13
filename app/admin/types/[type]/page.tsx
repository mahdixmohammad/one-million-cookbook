import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ type: string; }>;
};

export default async function TypePage(props: Props) {
  const { type } = await props.params

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/types/${type}`, {
    cache: "no-store",
  });

  const typeData = await res.json();

  if (typeData["error"]) notFound();

  return (
    <>
      <div className="w-[98%] mx-auto mt-4 bg-white shadow-[0px_0px_10px_0.5px_rgba(0,0,0,0.15)] rounded-lg px-3 py-3">
        <div className="flex gap-2">
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
        <div className="w-full items-center px-3 xs:px-6 mt-4 mb-2 grid grid-cols-[125px_100px_1fr] xs:grid-cols-[190px_175px_1fr] text-gray-600">
          <h3 className="ml-4">Image</h3>
          <h3 className="">Name</h3>
          <h3 className="-ml-4">Items</h3>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="grid-cols-[125px_100px_1fr] xs:grid-cols-[190px_175px_1fr] w-full h-24 bg-gray-100 rounded-xl grid grid-rows-1 items-center px-3 xs:px-6 transition-all duration-150">
            <Image className="" src={typeData["image"]} alt="" width={90} height={90}></Image>
            <h3>{type}</h3>
            <h3>{typeData?.["items"] ? Object.keys(typeData["items"]).length : 0}</h3>
          </div>
        </div>
      </div>
      <div className="w-[98%] mx-auto mt-4 bg-white shadow-[0px_0px_10px_0.5px_rgba(0,0,0,0.15)] rounded-lg px-3 py-3">
        <Link href="/admin/types/create" className="border-[0px] bg-gray-500 text-white border-gray-600 w-22 h-8 flex justify-center items-center rounded-xl text-sm hover:bg-gray-600 transition-all duration-150">
          <svg className="w-5 h-5" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create
        </Link>
        <div className="w-full items-center px-3 xs:px-6 mt-4 mb-2 grid grid-cols-[125px_1fr_auto] xs:grid-cols-[190px_1fr_auto] text-gray-600">
          <h3 className="ml-4">Image</h3>
          <h3 className="">Name</h3>
        </div>
        <div className="w-full flex flex-col gap-2">
          {typeData["items"] && Object.keys(typeData["items"]).map((itemName, i) => (
            <Link href={`/admin/types/${type}/${itemName}`} key={i} className="grid-cols-[125px_1fr_auto] xs:grid-cols-[190px_1fr_auto] w-full h-24 bg-gray-100 rounded-xl grid grid-rows-1 items-center px-3 xs:px-6 hover:bg-gray-200 transition-all duration-150">
              <Image className="" src={Object.values(typeData["items"])[0]["image"]} alt="" width={90} height={90}></Image>
              <h3>{itemName}</h3>
              <svg className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-all duration-150" fill="none" strokeWidth={1.5} stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </Link>
          ))}
        </div>
        <div className="mt-5 ml-4 mb-2">
          {typeData?.["items"] ? Object.keys(typeData["items"]).length : 0} results
        </div>
      </div>
    </>
  );
}
