import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminLogin } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useAdminLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    loginMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          localStorage.setItem("hwv_token", data.token);
          toast({ title: "Access Granted", description: "Welcome to the vault." });
          setLocation("/admin");
        },
        onError: () => {
          toast({ title: "Access Denied", description: "Invalid credentials.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-background">
      <div className="absolute inset-0 bg-grid-floor opacity-20 pointer-events-none perspective-floor" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md glass-panel p-8 rounded-2xl border border-primary/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter neon-text">Admin Access</h1>
          <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest mt-2">Restricted Area</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="admin" {...field} className="bg-black/50 border-white/10 font-mono focus-visible:ring-primary h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="bg-black/50 border-white/10 font-mono focus-visible:ring-primary h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white mt-4" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authenticate"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
