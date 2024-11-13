"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  const gameState = localStorage.getItem("game") !== null;
  return (
    <div>
      <main className="flex flex-col justify-center items-center min-h-screen">
        <div className="relative w-full h-[80vh] flex justify-center items-center">
          <Image src="/home.png" alt="image" layout="fill" objectFit="cover" />
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <h1 className="text-white text-6xl font-bold">Bank Helper</h1>
          </div>
        </div>

        <div className="text-white text-4xl font-bold text-center">
          {gameState ? (
            <>
              <Button>Continue Game</Button>
              <Button variant="destructive">Reset Data</Button>
            </>
          ) : (
            <Button>Setup Game</Button>
          )}
        </div>
      </main>
    </div>
  );
}
