import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createMessage = useCreateMessage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMessage.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Message sent", description: "The collector will get back to you soon." });
          setOpen(false);
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-sm font-semibold tracking-wide hover:text-primary transition-colors uppercase cursor-pointer">
          Contact
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-panel border-primary/20">
        <DialogHeader>
          <DialogTitle className="font-black italic text-2xl uppercase tracking-wider text-primary">Contact Collector</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            Send a message to the vault owner.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} className="bg-background/50 border-white/10 focus-visible:ring-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your email" {...field} className="bg-background/50 border-white/10 focus-visible:ring-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your message..." className="resize-none bg-background/50 border-white/10 focus-visible:ring-primary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 text-white" disabled={createMessage.isPending}>
              {createMessage.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ignite
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
