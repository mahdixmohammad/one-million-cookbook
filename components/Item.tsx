"use client";
import { useState } from "react";
import Link from "next/link";
import LoadingImage from "./LoadingImage";
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

type Props = {
  type: string;
  item: string;
  data: {
    image: string;
    ingredients: string;
    instructions: string;
  };
};

export default function Item({ type, item, data }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    Object.fromEntries(ingredientList.map((i) => [i.id, false])),
  );

  const [instructionChecks, setInstructionChecks] = useState(
    Object.fromEntries(instructionList.map((i) => [i.id, false])),
  );

  const allIngredientsChecked = Object.values(ingredientChecks).every(Boolean);
  const allInstructionsChecked =
    Object.values(instructionChecks).every(Boolean);

  const handleIngredientChange = (id: string) => {
    setIngredientChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInstructionChange = (id: string) => {
    if (!allIngredientsChecked) return;
    setInstructionChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completeAllIngredients = () => {
    setIngredientChecks(
      Object.fromEntries(ingredientList.map((i) => [i.id, true])),
    );
  };

  const completeAllInstructions = () => {
    setInstructionChecks(
      Object.fromEntries(instructionList.map((i) => [i.id, true])),
    );
  };

  const completeItem = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const uid = auth.currentUser!.uid;

      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, item, uid }),
      });

      if (!res.ok) throw new Error("Failed to complete");

      const data = await res.json();

      router.push(`/completions/${data.completionId}`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <div className="text-md -mt-4 flex flex-col items-center px-4 pb-6 md:px-10 md:text-lg lg:text-xl">
      <LoadingImage
        className="w-[200px]"
        position="center"
        src={data.image}
        width={200}
        height={200}
        alt=""
      />
      <div className="mb-2 w-full">
        <h1 className="mb-2 text-center text-2xl">{item}</h1>
        <div className="bg-gold h-1 w-full"></div>
      </div>
      <div className="flex w-full flex-col sm:min-h-[500px] sm:flex-row">
        {/* Ingredients section */}
        <div className="flex flex-col items-center rounded-t-xl bg-[rgb(50,50,50)] px-2 py-4 text-white sm:w-[50%] sm:max-w-[300px] sm:rounded-t-none sm:rounded-r-xl lg:px-4">
          <h3 className="mb-4 font-bold">المكونات</h3>
          <ul className="flex w-full flex-col gap-4">
            {ingredientList.map((item) => (
              <li className="flex gap-2" key={item.id}>
                <input
                  className="mt-2 scale-125 self-start"
                  type="checkbox"
                  id={item.id}
                  checked={ingredientChecks[item.id]}
                  onChange={() => handleIngredientChange(item.id)}
                />
                <label className="w-full break-words" htmlFor={item.id}>
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        {/* Instructions section */}
        <div
          className={`flex w-full flex-col items-center rounded-b-xl bg-gray-200 px-2 py-4 transition-opacity duration-200 sm:rounded-l-xl sm:rounded-br-none lg:px-4 ${
            allIngredientsChecked
              ? "opacity-100"
              : "pointer-events-none opacity-50 select-none"
          }`}
        >
          <h3 className="mb-4 font-bold">التعليمات</h3>
          <ol className="flex w-full list-decimal flex-col gap-2 lg:gap-4">
            {instructionList.map((item) => (
              <div
                className="flex items-start justify-start gap-6"
                key={item.id}
              >
                <input
                  className="mt-2 scale-125 self-start"
                  type="checkbox"
                  id={item.id}
                  checked={instructionChecks[item.id]}
                  onChange={() => handleInstructionChange(item.id)}
                  disabled={!allIngredientsChecked}
                />
                <li className="flex-1">
                  <label className="w-full break-words" htmlFor={item.id}>
                    {item.label}
                  </label>
                </li>
              </div>
            ))}
          </ol>
        </div>
      </div>
      <div className="xs:h-16 xs:flex-row xs:gap-2 mt-4 flex h-30 w-full flex-col gap-3 md:gap-3 lg:gap-4">
        <Link
          className="xs:w-1/2 flex h-full w-full items-center justify-center rounded-lg bg-gray-200 font-bold transition-all duration-150 hover:opacity-85"
          href={`/types/${type}/`}
        >
          إلغاء
          <XMarkIcon className="w-10 text-[rgb(205,2,2)]" />
        </Link>
        {!allIngredientsChecked && (
          <button
            className="xs:w-1/2 flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black font-bold text-white transition-all duration-150 hover:opacity-85"
            onClick={completeAllIngredients}
          >
            التالي
            <ArrowLeftIcon className="w-10 text-[rgb(2,205,63)]" />
          </button>
        )}
        {allIngredientsChecked && !allInstructionsChecked && (
          <button
            className="xs:w-1/2 flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black font-bold text-white transition-all duration-150 hover:opacity-85"
            onClick={completeAllInstructions}
          >
            التالي
            <ArrowLeftIcon className="w-10 text-[rgb(2,205,63)]" />
          </button>
        )}
        {allIngredientsChecked && allInstructionsChecked && (
          <button
            className="xs:w-1/2 flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black font-bold text-white transition-all duration-150 hover:opacity-85"
            onClick={completeItem}
          >
            اكمال
            <CheckIcon className="w-10 text-[rgb(2,205,63)]" />
          </button>
        )}
      </div>
    </div>
  );
}
