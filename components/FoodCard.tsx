import Image from "next/image"
import Link from "next/link"

type Props = {
    thumbnail: string,
    name: string
}

export default function FoodCard({thumbnail, name}: Props) {
    return <Link href={`/${name}`} className="aspect-[1] w-full bg-gray-500 rounded-md flex flex-col gap-3 justify-center items-center shadow shadow-black">
        <Image className="w-[80%] object-contain" src={thumbnail} width={200} height={200} alt=""/>
        <h2 className="text-4xl xs:text-2xl sm:text-xl lg:text-2xl xl:text-3xl font-bold text-black bg-yellow-400 px-[30%] py-0.5 rounded-lg">{name}</h2>
    </Link>
}