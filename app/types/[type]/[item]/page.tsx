"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import LoadingImage from "@/components/LoadingImage";
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ type: string; item: string }>;
};

export default function Page(props: Props) {
  let { type, item } = use(props.params);
  type = decodeURIComponent(type);
  item = decodeURIComponent(item);

  const [data, setData] = useState({
    image: "",
    ingredients: "",
    instructions: ""
  })
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/types/${type}/${item}`,
        { cache: "no-store" }
      );
      const itemData = await res.json();

      if (itemData["error"]) notFound();

      setData(itemData)
    }

    fetchData();

  }, [item, type])

  const ingredientList = (data.ingredients || "")
    .split("#")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((label, i) => ({ id: `ingredient-${i}`, label }));

  const instructionList = (data.instructions || "")
    .split("#")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((label, i) => ({ id: `step-${i}`, label }));

  const [ingredientChecks, setIngredientChecks] = useState(
    Object.fromEntries(ingredientList.map((i) => [i.id, false]))
  );

  const [instructionChecks, setInstructionChecks] = useState(
    Object.fromEntries(instructionList.map((i) => [i.id, false]))
  );

  const allIngredientsChecked = Object.values(ingredientChecks).every(Boolean);
  const allInstructionsChecked = Object.values(instructionChecks).every(Boolean);

  const handleIngredientChange = (id: string) => {
    setIngredientChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInstructionChange = (id: string) => {
    if (!allIngredientsChecked) return;
    setInstructionChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completeAllIngredients = () => {
    setIngredientChecks(
      Object.fromEntries(
        ingredientList.map((i) => [i.id, true])
      )
    );
  };

  const completeAllInstructions = () => {
    setInstructionChecks(
      Object.fromEntries(
        instructionList.map((i) => [i.id, true])
      )
    );
  };

  const completeItem = async () => {
    try {
      const auth = getAuth();
      const uid = auth.currentUser!.uid;

      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ type, item, uid })
      })

      if (!res.ok) throw new Error("Failed to complete");

      router.push("/types")
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="px-4 -mt-4 md:px-10 pb-6 flex flex-col items-center text-md md:text-lg lg:text-xl">
      <LoadingImage className="w-[200px]" position="center" src={data.image} width={200} height={200} alt="" />
      <div className="w-full mb-2">
        <h1 className="text-2xl text-center mb-2">{item}</h1>
        <div className="w-full h-1 bg-gold"></div>
      </div>
      <div className="w-full sm:min-h-[500px] flex flex-col sm:flex-row">
        {/* Ingredients section */}
        <div className="sm:w-[50%] sm:max-w-[300px] bg-[rgb(50,50,50)] rounded-t-xl sm:rounded-t-none sm:rounded-r-xl text-white px-2 lg:px-4 py-4 flex flex-col items-center">
          <h3 className="mb-4 font-bold">المكونات</h3>
          <ul className="w-full flex flex-col gap-4">
            {ingredientList.map((item) => (
              <li className="flex gap-2" key={item.id}>
                <input
                  className="scale-125 self-start mt-2"
                  type="checkbox"
                  id={item.id}
                  checked={ingredientChecks[item.id]}
                  onChange={() => handleIngredientChange(item.id)}
                />
                <label className="w-full break-words" htmlFor={item.id}>{item.label}</label>
              </li>
            ))}
          </ul>
        </div>
        {/* Instructions section */}
        <div
          className={`w-full bg-gray-200 rounded-b-xl sm:rounded-br-none sm:rounded-l-xl px-2 lg:px-4 py-4 flex flex-col items-center transition-opacity duration-200 ${
            allIngredientsChecked ? "opacity-100" : "opacity-50 pointer-events-none select-none"
          }`}
        >
          <h3 className="mb-4 font-bold">التعليمات</h3>
          <ol className="w-full flex flex-col gap-2 lg:gap-4 list-decimal">
            {instructionList.map((item) => (
              <div className="flex justify-start items-start gap-6" key={item.id}>
                <input
                  className="mt-2 scale-125 self-start"
                  type="checkbox"
                  id={item.id}
                  checked={instructionChecks[item.id]}
                  onChange={() => handleInstructionChange(item.id)}
                  disabled={!allIngredientsChecked}
                />
                <li className="flex-1">
                  <label className="w-full break-words" htmlFor={item.id}>{item.label}</label>
                </li>
              </div>
            ))}
          </ol>
        </div>
      </div>
      <div className="w-full h-30 xs:h-16 flex flex-col xs:flex-row mt-4 gap-3 xs:gap-2 md:gap-3 lg:gap-4">
        <Link
          className="w-full xs:w-1/2 h-full bg-gray-200 flex justify-center items-center rounded-lg font-bold hover:opacity-85 transition-all duration-150"
          href={`/types/${type}/`}
        >
          إلغاء
          <XMarkIcon className="w-10 text-[rgb(205,2,2)]" />
        </Link>
        {
          !allIngredientsChecked && 
          <button
          className="w-full xs:w-1/2 h-full bg-black flex text-white justify-center items-center rounded-lg font-bold transition-all duration-150 cursor-pointer hover:opacity-85"
          onClick={completeAllIngredients}
        >
          التالي
          <ArrowLeftIcon className="w-10 text-[rgb(2,205,63)]" />
          </button>
        }
        {
          allIngredientsChecked && !allInstructionsChecked && 
          <button
          className="w-full xs:w-1/2 h-full bg-black flex text-white justify-center items-center rounded-lg font-bold transition-all duration-150 cursor-pointer hover:opacity-85"
          onClick={completeAllInstructions}
        >
          التالي
          <ArrowLeftIcon className="w-10 text-[rgb(2,205,63)]" />
          </button>
        }
        {
          allIngredientsChecked && allInstructionsChecked &&
        <button
          className="w-full xs:w-1/2 h-full bg-black flex text-white justify-center items-center rounded-lg font-bold transition-all duration-150 cursor-pointer hover:opacity-85"
          onClick={completeItem}
        >
          اكمال
          <CheckIcon className="w-10 text-[rgb(2,205,63)]" />
        </button>
        }
      </div>
    </div>
  );
}
