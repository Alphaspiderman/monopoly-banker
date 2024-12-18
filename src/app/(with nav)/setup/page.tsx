"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  inital_balance: z.number().int().positive().min(500),
  players: z.array(z.object({ value: z.string().min(2).max(25) })).min(2),
});

const defaultValues: Partial<FormValues> = {
  inital_balance: 1500,
  players: [{ value: "Player 1" }, { value: "Player 2" }],
};

type FormValues = z.infer<typeof formSchema>;

export default function GameSetupPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    name: "players",
    control: form.control,
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    // Ensure that there are atleast 2 players
    var player_count = data.players.length;
    if (player_count < 2) {
      alert("Please add atleast 2 players");
      return;
    }
    // Ensure that the initial balance is atleast 500
    if (data.inital_balance < 500) {
      alert("Initial balance should be atleast 500");
      return;
    }
    var gameData = {
      player_count: player_count,
      active_player: 0,
      players: data.players.forEach((element) => {
        return { name: element.value, balance: data.inital_balance };
      }),
    };
    // Save data in local storage
    localStorage.setItem("gameData", JSON.stringify(gameData));

    // Redirect to the game page
    window.location.href = "/game";
  }

  return (
    <main
      className="min-h-screen h-screen flex flex-col justify-center items-center text-white"
      style={{
        backgroundImage: `url(/static/splash_1.jpg)`,
        backgroundSize: "cover",
      }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold mb-8">Game Setup</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormItem>
              <FormLabel>Initial balance</FormLabel>
              <FormDescription>
                Set the initial balance for all player. (Minimum 500)
              </FormDescription>
              <FormControl>
                <Input {...form.register("inital_balance")} />
              </FormControl>
              <FormMessage />
            </FormItem>
            <div>
              <FormLabel>Players</FormLabel>
              <FormDescription>Add names of Players.</FormDescription>
              {fields.length < 8 ? renderEntry() : renderTwoColumns()}

              <Button
                type="button"
                variant="default"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
                disabled={fields.length >= 10}
              >
                Add Player
              </Button>
            </div>
            <Button type="submit">Start Game</Button>
          </form>
        </Form>
      </div>
    </main>
  );

  function renderTwoColumns() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderEntry()}
      </div>
    );
  }
  function renderEntry() {
    return fields.map((field, index) => (
      <div key={field.id} className="flex items-center space-x-2">
        <FormField
          control={form.control}
          name={`players.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  value={field.value as string}
                  className="border-2 border-blue-500 bg-black bg-opacity-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="reset"
          variant="destructive"
          size="sm"
          onClick={() => remove(index)}
          disabled={fields.length <= 2}
        >
          Remove
        </Button>
      </div>
    ));
  }
}
