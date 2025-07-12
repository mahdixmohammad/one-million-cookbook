import Image from "next/image";
import Link from "next/link";

export default async function Types() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/types`, {
    cache: "no-store",
  });

  const typesData = await res.json();

    return (
        <div className="w-[98%] mx-auto mt-4 shadow-[0px_0px_10px_0.5px_rgba(0,0,0,0.15)] rounded-lg px-3 py-3">
            <Link href="/admin/types/create" className="border-[0px] bg-gray-500 text-white border-gray-600 w-22 h-8 flex justify-center items-center rounded-xl text-sm hover:bg-gray-600 transition-all duration-150">
                <svg className="w-5 h-5" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create
            </Link>
            <div className="w-full items-center px-3 xs:px-6 mt-4 mb-2 grid grid-cols-[125px_100px_1fr_auto] xs:grid-cols-[190px_175px_1fr_auto] text-gray-600">
                <h3 className="ml-4">Image</h3>
                <h3 className="">Name</h3>
                <h3 className="-ml-4">Items</h3>
            </div>
            <div className="w-full flex flex-col gap-2">
                {Object.keys(typesData).map((typeName, i) => (
                    <Link href={`/admin/types/${typeName}`} key={i} className="grid-cols-[125px_100px_1fr_auto] xs:grid-cols-[190px_175px_1fr_auto] w-full h-24 bg-gray-100 rounded-xl grid grid-rows-1 items-center px-3 xs:px-6 hover:bg-gray-200 transition-all duration-150">
                        <Image className="" src={Object.entries(typesData[typeName])[0][1]["image"]} alt="" width={90} height={90}></Image>
                        <h3>{typeName}</h3>
                        <h3>{Object.keys(typesData[typeName]).length}</h3>
                        <svg className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-all duration-150" fill="none" strokeWidth={1.5} stroke="gray" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                    </Link>
                ))}
            </div>
            <div className="mt-5 ml-4 mb-2">
                {Object.keys(typesData).length} results
            </div>
        </div>
    )
}