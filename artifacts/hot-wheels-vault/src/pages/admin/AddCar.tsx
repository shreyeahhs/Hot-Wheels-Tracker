import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateCar, useSearchModels } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  year: z.coerce.number().min(1968, "Year must be 1968 or later").max(new Date().getFullYear() + 1),
  series: z.string().min(1, "Series is required"),
  color: z.string().min(1, "Color is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
});

export default function AdminAddCar() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createCar = useCreateCar();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: suggestions } = useSearchModels({ q: debouncedSearch }, { query: { enabled: debouncedSearch.length > 1 } });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", year: new Date().getFullYear(), series: "", color: "", imageUrl: "", description: "" },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createCar.mutate(
      { data: { ...values, rarity: "Mainline", imageUrl: values.imageUrl || null, description: values.description || null } },
      {
        onSuccess: () => {
          toast({ title: "Car Added", description: "Successfully added to the vault." });
          setLocation("/admin");
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to add car.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter neon-text mb-2">Add New Model</h1>
        <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Expand the Vault</p>
      </div>

      <div className="glass-panel p-8 rounded-xl border border-white/10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Model Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. '67 Camaro" 
                      {...field} 
                      className="bg-black/50 border-white/10"
                      onChange={(e) => {
                        field.onChange(e);
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                  </FormControl>
                  
                  {showSuggestions && suggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-card border border-white/10 rounded-md shadow-xl max-h-60 overflow-auto">
                      {suggestions.map((s, i) => (
                        <div 
                          key={i} 
                          className="px-4 py-2 hover:bg-primary/20 cursor-pointer flex justify-between items-center"
                          onClick={() => {
                            form.setValue("name", s.name);
                            if (s.year) form.setValue("year", s.year);
                            if (s.series) form.setValue("series", s.series);
                            setShowSuggestions(false);
                          }}
                        >
                          <span className="font-bold uppercase">{s.name}</span>
                          <span className="text-xs font-mono text-muted-foreground">{s.year} • {s.series}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Year</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-black/50 border-white/10 font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="series"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Series</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. HW Dream Garage" {...field} className="bg-black/50 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Color</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Spectraflame Red" {...field} className="bg-black/50 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} className="bg-black/50 border-white/10 font-mono text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Details about this cast..." {...field} className="bg-black/50 border-white/10 resize-none h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white mt-6" disabled={createCar.isPending}>
              {createCar.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save to Vault
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
