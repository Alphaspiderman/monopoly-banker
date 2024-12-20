"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";

export default function GamePage() {
  const [gameData, setGameData] = useState<GameData | null>(null);

  // Load game data from localStorage on component mount
  useEffect(() => {
    const savedGameData = localStorage.getItem("gameData");

    if (savedGameData) {
      // Parse the stored JSON data if it exists
      const parsedData: GameData = JSON.parse(savedGameData);
      setGameData(parsedData);
    }
  }, []);

  // Function to update the active player index and save the gameData to localStorage
  function endTurn() {
    if (gameData) {
      const newActivePlayer = gameData.active_player + 1 >= gameData.player_count
        ? 0
        : gameData.active_player + 1;

      const updatedGameData = {
        ...gameData,
        active_player: newActivePlayer,
      };

      localStorage.setItem("gameData", JSON.stringify(updatedGameData));
      setGameData(updatedGameData);
    }
  }

  // Mark the player as active based on the active_player index in the gameData
  const highlightActivePlayer = (
    players: Player[],
    activePlayerIndex: number
  ) => {
    return players.map((player, index) => ({
      ...player,
      active: index === activePlayerIndex,
    }));
  };

  return (
    <main
      className="min-h-screen h-screen flex flex-col justify-center items-center text-white"
      style={{
        backgroundImage: `url(/static/splash_1.jpg)`,
        backgroundSize: "cover",
      }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center dark:bg-black dark:bg-opacity-50 bg-white bg-opacity-10">
        <h1 className="text-4xl">Game Page</h1>
        <div className="p-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Current Turn</TableHead>
                <TableHead className="w-[100px]">Player Name</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gameData?.players &&
                highlightActivePlayer(
                  gameData.players,
                  gameData.active_player
                ).map((player, index) => (
                  <TableRow
                    key={index}
                    className={player.active ? "bg-green-500" : ""}
                  >
                    <TableCell>{player.active ? "Yes" : "No"}</TableCell>
                    <TableCell>{player.name}</TableCell>
                    <TableCell className="text-right">
                      {player.balance}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={() => {
              console.log("Pay money");
              // Open a modal to select a player to pay money to and set amount
            }}
          >
            Pay Money
          </Button>
          <Button
            onClick={() => {
              console.log("Collect money");
              // Open a modal to select a player to collect money from and set amount
            }}
          >
            Collect Money
          </Button>
          <Button
            onClick={() => {
              console.log("End Turn");
              endTurn();
            }}
          >
            End Turn
          </Button>
        </div>
      </div>
    </main>
  );
}
