"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [gameState, setGameState] = useState<string | null>(null);

  useEffect(() => {
    const gameState = localStorage.getItem("gameData");
    if (gameState) {
      setGameState(gameState);
    }
  }, []);

  function resetGame() {
    // Reset Game Data
    console.log("Reset Data button clicked");
    // Save the game to localStorage
    localStorage.removeItem("gameData");

    // Update state with the new game data
    setGameState(null);
  }

  return (
    <div>
      <main
        className="flex flex-col justify-center items-center min-h-screen "
        style={{
          backgroundImage: `url(/static/splash_2.jpg)`,
          backgroundSize: "cover",
        }}
      >
        <div className="relative w-full h-[100vh] flex flex-col justify-center items-center bg-black bg-opacity-50">
          <h1 className="text-white text-6xl font-bold">Monopoly Banker</h1>
          <div className="text-white text-4xl font-bold text-center p-5">
            {gameState ? (
              <>
                <Button asChild>
                  <Link href="/game">Continue Game</Link>
                </Button>
                <div className="w-2"></div>
                <Button
                  variant="destructive"
                  onClick={() => {
                    resetGame();
                  }}
                >
                  Reset Data
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/setup">Setup Game</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
