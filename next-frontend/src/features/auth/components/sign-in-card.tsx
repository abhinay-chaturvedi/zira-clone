"use client"
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeperator from "@/components/dotted-seperator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useLogin } from "../api/useLogin";
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});
export const SignInCard = () => {
  const { mutate, isPending } = useLogin();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
    console.log(values, " ---")
  }
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeperator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter email address"
                  />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter password"
                  />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            {/* <Input
              required
              type="password"
              value={""}
              onChange={() => {}}
              placeholder="Enter password"
              disabled={false}
              min={8}
              max={256}
            /> */}
            <Button disabled={isPending} className="w-full">
              LogIn
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeperator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button disabled={isPending} variant={"secondary"} size={"lg"}>
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>
        <Button disabled={isPending} variant={"secondary"} size={"lg"}>
          <FaGithub className="mr-2 size-5" />
          Login with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeperator/>
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Don&apos;t have an account?
          <Link href={"/sign-up"}>
          <span className="text-blue-700"> Sign up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
