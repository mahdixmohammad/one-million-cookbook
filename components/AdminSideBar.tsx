import Image from "next/image"
import SideBarLink from "./SideBarLink"

export default function AdminSideBar() {
    return (
        <div className="relative -left-[250px] md:left-0 w-[250px] h-screen pt-3 bg-gray-300 text-black flex flex-col gap-2 items-center">
            <div className="w-[90%] border-b-[1px] border-black pb-2 mt-1">
                <Image className="absolute top-2" src="/1M-logo-black.png" alt="" width={50} height={50}></Image>
                <h1 className="text-center text-3xl tracking-tight font-bold">Admin</h1>
            </div>
            <ul className="flex flex-col w-full">
                <li>
                    <SideBarLink name="Change Types" href="/types"/>
                </li>
                <li>
                    <SideBarLink name="Change Items" href="/items"/>
                </li>
            </ul>
        </div>
    )
}