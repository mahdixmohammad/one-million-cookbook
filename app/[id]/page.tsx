"use client"
import { use, useState } from "react"
import Image from "next/image"
import Link from "next/link"

type Props = {
    params: Promise<{ id: string }>
}

export default function Test(props: Props) {
    const params = use(props.params);
    // Ingredient and instruction items
    const ingredientList = [
        { id: "flour", label: "2 cups of flour" },
        { id: "sugar", label: "1 cup of sugar" },
        { id: "eggs1", label: "3 eggs" },
        { id: "lettuce", label: "5 pounds of lettuce" },
    ];
    const instructionList = [
        {
            id: "step1",
            label:
                "Cook the pasta: Bring a large pot of salted water to a boil. Add the linguine and cook until al dente, according to the package instructions. Drain and set aside.",
        },
        {
            id: "step2",
            label:
                "Prepare the shrimp: Meanwhile, heat the olive oil in a large skillet over medium-high heat. Add the shrimp, season with salt and pepper, and sauté until they turn pink, about 2-3 minutes per side. Remove the shrimp from the skillet and set aside.",
        },
        {
            id: "step3",
            label:
                "Make the sauce: In the same skillet, add the minced garlic and red pepper flakes. Cook until the garlic is fragrant, about 1 minute. Stir in the chicken broth, lemon juice, and lemon zest. Bring the mixture to a simmer and cook for about 5 minutes, or until the sauce has reduced by half.",
        },
        {
            id: "step4",
            label:
                "Combine the pasta and shrimp with the sauce: Return the shrimp to the skillet. Add the cooked pasta and toss to combine, making sure the pasta is well-coated with the sauce.",
        },
        {
            id: "step5",
            label:
                "Serve: Remove the skillet from the heat. Sprinkle with the chopped fresh parsley and grated Parmesan cheese. Serve immediately.",
        },
    ];

    // State for checkboxes
    const [ingredientChecks, setIngredientChecks] = useState(
        Object.fromEntries(ingredientList.map((i) => [i.id, false]))
    );
    const [instructionChecks, setInstructionChecks] = useState(
        Object.fromEntries(instructionList.map((i) => [i.id, false]))
    );

    const allIngredientsChecked = Object.values(ingredientChecks).every(Boolean);
    const allInstructionsChecked = Object.values(instructionChecks).every(Boolean);

    // Handlers
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
                <Image className="w-[200px] h-auto object-contain mb-3" src="/cake.png" width={60} height={60} alt="" />
            </div>
            <div className="w-full mb-10">
                <h1 className="text-2xl text-center mb-2">{params.id}</h1>
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
                            ? "bg-yellow-400 cursor-pointer"
                            : "bg-red-200 cursor-not-allowed"
                    }`}
                    disabled={!(allIngredientsChecked && allInstructionsChecked)}
                >
                    Complete
                </button>
            </div>
        </div>
    );
}