import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-hablalo_black">
      <h1 className="text-4xl font-bold text-white mb-8">
        Testing WebGazer.js
      </h1>
      <Link href="/form">
        <SubmitButton text="Empezar" />
      </Link>
    </div>
  );
}
