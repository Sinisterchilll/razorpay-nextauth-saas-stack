import { Appbar } from "./components/Appbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Appbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6 text-center">Happy Shipping!</h1>
      </main>
    </div>
  );
}