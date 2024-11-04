"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  const gameState = localStorage.getItem("game") !== null;
  return (
    <div>
      <main className="flex flex-col justify-center items-center min-h-screen">
        <div className="flex flex-col justify-center items-center">
          <div className="relative block h-[80vh] w-[100vh]">
            <Image src="/home.png" alt="image" fill />
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
