import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function UserDropdown() {
    return  <div className="px-3 py-3 bg-white drop-shadow-md border-2 border-gray-100 absolute left-4 top-13 flex justify-center items-center">
        <button
        onClick={() => signOut(auth)}
        className="bg-red-800 text-white px-5 py-1 cursor-pointer rounded-md text-nowrap"
        >تسجيل الخروج
        </button>
    </div>
}
