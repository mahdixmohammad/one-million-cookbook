type Props = {
  size?: "small" | "medium";
};

export default function Loading({ size = "medium" }: Props) {
  return (
    <div
      className={`animate-spin rounded-full border-gray-200 border-t-[rgb(50,50,50)] ${size === "medium" ? "h-[50px] w-[50px] border-[5px]" : "h-[35px] w-[35px] border-[4px]"}`}
    ></div>
  );
}
