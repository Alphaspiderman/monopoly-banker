"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  amount: z.number().int().positive(),
  player: z.number().int(),
});

export default function GamePage() {
  const [gameData, setGameData] = useState<GameData | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmitPay(data: z.infer<typeof FormSchema>) {
    console.log(data);
    transferMoney(gameData!.active_player, data.player, data.amount);
  }

  function onSubmitCollect(data: z.infer<typeof FormSchema>) {
    console.log(data);
    transferMoney(gameData!.active_player, data.player, -data.amount);
  }

  // Load game data from localStorage on component mount
  useEffect(() => {
    const savedGameData = localStorage.getItem("gameData");

    if (savedGameData) {
      // Parse the stored JSON data if it exists
      const parsedData: GameData = JSON.parse(savedGameData);
      setGameData(parsedData);
    }
    // Redirect to the home page if no game data is found
    else {
      console.log("No game data found. Redirecting to home page.");
      window.location.href = "/";
    }
  }, []);

  // Function to update the active player index and save the gameData to localStorage
  function endTurn() {
    if (gameData) {
      const newActivePlayer =
        gameData.active_player + 1 >= gameData.player_count
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

  // Function to transfer money between players
  function transferMoney(from: number, to: number, amount: number) {
    if (gameData) {
      const players = gameData.players.map((player, index) => {
        if (index === from) {
          return {
            ...player,
            balance: player.balance - amount,
          };
        }

        if (index === to) {
          return {
            ...player,
            balance: player.balance + amount,
          };
        }

        return player;
      });

      const updatedGameData = {
        ...gameData,
        players,
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
          <Dialog>
            <DialogTrigger>Pay Money</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Paying Money</DialogTitle>
                <DialogDescription>
                  Player will be paying a player. Please provide the information
                  below.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitPay)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="player"
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <FormLabel>Player</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button className="w-full text-left">
                                  {field.value === -1
                                    ? "Bank"
                                    : gameData?.players[field.value]?.name ||
                                      "Select a player"}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onSelect={() => field.onChange(-1)}
                                >
                                  Bank
                                </DropdownMenuItem>
                                {gameData?.players
                                  .filter(
                                    (_, index) =>
                                      index !== gameData.active_player
                                  )
                                  .map((player, index) => (
                                    <DropdownMenuItem
                                      key={index}
                                      onSelect={() => field.onChange(index)}
                                    >
                                      {player.name}
                                    </DropdownMenuItem>
                                  ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => {
                      return (
                        <>
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) => {
                                  field.onChange(parseInt(e.target.value));
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </>
                      );
                    }}
                  />
                  <DialogClose asChild>
                    <Button type="submit">Submit</Button>
                  </DialogClose>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* <Button
            onClick={() => {
              console.log("Collect money");
              // Open a modal to select a player to collect money from and set amount
            }}
          >
            Collect Money
          </Button> */}
          <Dialog>
            <DialogTrigger>Collect Money</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Collecting Money</DialogTitle>
                <DialogDescription>
                  Player will be collecting money from another player. Please
                  provide the information below.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
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
