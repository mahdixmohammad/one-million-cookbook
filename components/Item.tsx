"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  type: string;
  item: string;
  data: {
    image: string,
    ingredients: string;
    instructions: string;
  };
};

export default function Item({ item, data }: Props) {
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
    <div className="px-4 md:px-10 pt-5 pb-20 flex flex-col items-center text-md md:text-lg lg:text-xl">
      <div>
        <Image className="absolute left-10" src="/1M-logo.png" width={60} height={60} alt="" />
        <Image className="w-[200px] h-auto object-contain mb-3" src={data.image} width={60} height={60} alt="" />
      </div>
      <div className="w-full mb-10">
        <h1 className="text-2xl text-center mb-2">{item[0].toUpperCase() + item.slice(1)}</h1>
        <div className="w-full h-1 bg-yellow-500"></div>
      </div>
      <div className="w-full min-h-[600px] flex flex-col sm:flex-row">
        {/* Ingredients section */}
        <div className="sm:w-[50%] sm:max-w-[300px] bg-gray-500 text-white px-2 lg:px-6 py-4 flex flex-col items-center">
          <h3 className="mb-4 font-bold">Ingredients</h3>
          <ul className="w-full flex flex-col gap-4">
            {ingredientList.map((item) => (
              <li className="flex gap-2" key={item.id}>
                <input
                  className="scale-125"
                  type="checkbox"
                  id={item.id}
                  checked={ingredientChecks[item.id]}
                  onChange={() => handleIngredientChange(item.id)}
                />
                <label htmlFor={item.id}>{item.label}</label>
              </li>
            ))}
          </ul>
        </div>
        {/* Instructions section */}
        <div
          className={`w-full bg-gray-300 px-2 lg:px-4 py-4 flex flex-col items-center transition-opacity duration-200 ${
            allIngredientsChecked ? "opacity-100" : "opacity-50 pointer-events-none select-none"
          }`}
        >
          <h3 className="mb-4 font-bold">Instructions</h3>
          <ol className="w-full flex flex-col gap-2 lg:gap-4 list-decimal">
            {instructionList.map((item) => (
              <div className="flex justify-start items-start gap-6" key={item.id}>
                <input
                  className="mt-2 scale-125"
                  type="checkbox"
                  id={item.id}
                  checked={instructionChecks[item.id]}
                  onChange={() => handleInstructionChange(item.id)}
                  disabled={!allIngredientsChecked}
                />
                <li className="flex-1">
                  <label htmlFor={item.id}>{item.label}</label>
                </li>
              </div>
            ))}
          </ol>
        </div>
      </div>
      <div className="w-full h-16 flex mt-6 gap-3 lg:gap-6">
        <Link
          className="w-1/2 h-full bg-gray-300 flex justify-center items-center rounded-xl font-bold"
          href="/"
        >
          Go Back
        </Link>
        <button
          className={`w-1/2 h-full flex justify-center items-center rounded-xl font-bold transition-colors duration-200 ${
            allIngredientsChecked && allInstructionsChecked
              ? "bg-yellow-400 text-black cursor-pointer"
              : "bg-red-200 opacity-50 cursor-not-allowed"
          }`}
          disabled={!(allIngredientsChecked && allInstructionsChecked)}
        >
          Complete
        </button>
      </div>
    </div>
  );
}
