import LoadingImage from "@/components/LoadingImage";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { getUsername } from "@/lib/db/users";
import { getImage } from "@/lib/db/items";
import Link from "next/link";
import { formatter } from "@/utils/format-time";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ date: string; completion: string }>;
};

export default async function Page(props: Props) {
  const { date, completion } = await props.params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/completions/${date}/${completion}`,
  );
  const data = await res.json();

  if (data.error) notFound();

  return (
    <div className="mx-auto flex h-screen w-fit flex-col items-center justify-center gap-2">
      <div className="flex flex-col items-center">
        <CheckCircleIcon className="w-20 text-green-500" />
        <h1 className="text-2xl">تمت العملية</h1>
        <div className="flex gap-1 text-sm text-gray-500">
          <h2>معرف العملية: </h2>
          <p dir="ltr">{completion}</p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-4 rounded-xl bg-gray-100 px-5 py-1 text-nowrap">
        <LoadingImage
          position="center"
          src={await getImage(data.type, data.item)}
          alt=""
          className="object-contain"
          width={125}
          height={125}
        />
        <div>
          <p>
            {data.type}\ {data.item}
          </p>
          <p>الكمية: {data.quantity}</p>
          <p dir="ltr" className="flex justify-end">
            {formatter.format(new Date(data.date))}
          </p>
          <p>المستخدم: {getUsername(data.uid)}</p>
        </div>
      </div>
      <Link
        href="/types"
        className="mt-1 w-fit rounded-md bg-black px-15 py-1 text-xl text-white transition-all duration-150 hover:opacity-85"
      >
        العودة
      </Link>
    </div>
  );
}
