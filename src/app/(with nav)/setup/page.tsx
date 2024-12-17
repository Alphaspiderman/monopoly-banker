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
  const { fields, append } = useFieldArray({
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
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
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
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`players.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Players
                    </FormLabel>
                    <FormDescription className={cn(index !== 0 && "sr-only")}>
                      Add names of Players.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} value={field.value as string} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ value: "" })}
            >
              Add Player
            </Button>
          </div>
          <Button type="submit">Start Game</Button>
        </form>
      </Form>
    </div>
  );
}
