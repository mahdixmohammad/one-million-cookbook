"use client";
import { useState } from "react";
import Link from "next/link";
import LoadingImage from "./LoadingImage";

type Props = {
  type: string;
  item: string;
  data: {
    image: string,
    ingredients: string;
    instructions: string;
  };
};

export default function Item({ type, item, data }: Props) {
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

  return (
    <div className="px-4 -mt-4 md:px-10 pb-8 flex flex-col items-center text-md md:text-lg lg:text-xl">
      <LoadingImage className="w-[200px]" position="center" src={data.image} width={60} height={60} alt="" />
      <div className="w-full mb-2">
        <h1 className="text-2xl text-center mb-2">{item}</h1>
        <div className="w-full h-1 bg-gold"></div>
      </div>
      <div className="w-full sm:min-h-[500px] flex flex-col sm:flex-row">
        {/* Ingredients section */}
        <div className="sm:w-[50%] sm:max-w-[300px] bg-[rgb(50,50,50)] text-white px-2 pr-8 lg:px-6 py-4 flex flex-col items-center">
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
          className={`w-full bg-gray-200 px-2 lg:px-4 py-4 flex flex-col items-center transition-opacity duration-200 ${
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
      <div className="w-full h-16 flex mt-4 gap-2 md:gap-3 lg:gap-5">
        <Link
          className="w-1/2 h-full bg-gray-300 flex justify-center items-center rounded-lg font-bold hover:opacity-85 transition-all duration-150"
          href={`/types/${type}/`}
        >
          العودة
          <svg width={40} height={40} fill="none" strokeWidth={1.5} stroke="rgb(205, 2, 2)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </Link>
        <button
          className={`w-1/2 h-full bg-black flex text-white justify-center items-center rounded-lg font-bold transition-all duration-150 ${
            allIngredientsChecked && allInstructionsChecked
              ? " cursor-pointer hover:opacity-85 "
              : "opacity-40 cursor-not-allowed"
          }`}
          disabled={!(allIngredientsChecked && allInstructionsChecked)}
        >
          
          اكمال
          <svg width={40} height={40} fill="none" strokeWidth={1.5} stroke="rgb(2, 205, 63)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
