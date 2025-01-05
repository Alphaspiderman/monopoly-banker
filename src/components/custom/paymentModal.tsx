"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import { FormSchema } from "@/lib/schema/paymentForm";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

interface PaymentModalProps {
  trigger: string;
  title: string;
  description: string;
  gameData: GameData;
  type: "pay" | "collect";
  setGameData: (data: GameData) => void;
}

export function PaymentModal(props: PaymentModalProps) {
  const [open, setOpen] = useState(false);
  var [player_transfer, setPlayerTransfer] = useState(-1);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmitPay(data: z.infer<typeof FormSchema>) {
    console.log(data);
    // Check if the player has enough money to make the payment
    props.gameData.players.forEach((player) => {
      if (player.id === props.gameData.player_turn) {
        if (player.balance < data.amount) {
          alert("Whoops! You don't have enough money to make this payment.");
          return;
        }
      }
    });
    const updatedBalances = props.gameData.players.map((player) => {
      if (player.id === props.gameData.player_turn) {
        return {
          ...player,
          balance: player.balance - data.amount,
        };
      }

      if (player.id === data.player) {
        return {
          ...player,
          balance: player.balance + data.amount,
        };
      }

      return player;
    });

    const updatedGameData = {
      ...props.gameData,
      players: updatedBalances,
    };

    localStorage.setItem("gameData", JSON.stringify(updatedGameData));
    props.setGameData(updatedGameData);
    setOpen(false);
    setPlayerTransfer(-1);
    form.reset();
  }

  function onSubmitCollect(data: z.infer<typeof FormSchema>) {
    console.log(data);
    // Check if the sending player has enough money to make the payment
    props.gameData.players.forEach((player) => {
      if (player.id === data.player) {
        if (player.balance < data.amount) {
          alert("Whoops! Player lacks money to make this payment.");
          return;
        }
      }
    });
    const updatedBalances = props.gameData.players.map((player) => {
      if (player.id === props.gameData.player_turn) {
        return {
          ...player,
          balance: player.balance + data.amount,
        };
      }

      if (player.id === data.player) {
        return {
          ...player,
          balance: player.balance - data.amount,
        };
      }

      return player;
    });

    const updatedGameData = {
      ...props.gameData,
      players: updatedBalances,
    };

    localStorage.setItem("gameData", JSON.stringify(updatedGameData));
    props.setGameData(updatedGameData);
    setOpen(false);
    setPlayerTransfer(-1);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{props.trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              props.type === "pay" ? onSubmitPay : onSubmitCollect
            )}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="player"
              defaultValue={-1}
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Player</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="w-full text-left">
                            {player_transfer === -1
                              ? "Bank"
                              : props.gameData.players[player_transfer]?.name ||
                                "Select a player"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onSelect={() => {
                              setPlayerTransfer(-1);
                              field.onChange(-1);
                            }}
                          >
                            Bank
                          </DropdownMenuItem>
                          {props.gameData.players
                            .filter(
                              (_, index) => index !== props.gameData.player_turn
                            )
                            .map((player) => (
                              <DropdownMenuItem
                                key={player.id}
                                onSelect={() => {
                                  setPlayerTransfer(player.id);
                                  field.onChange(player.id);
                                }}
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
              defaultValue={0}
              render={({ field }) => {
                return (
                  <>
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(
                              e.target.value ? parseInt(e.target.value) : ""
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                );
              }}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
