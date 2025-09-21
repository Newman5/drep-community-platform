"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import {
  CheckCircle,
  XCircle,
  MinusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { submitVote } from "@/lib/vote-actions";
import type { Vote } from "@prisma/client";

// Form validation schema
const voteFormSchema = z.object({
  vote: z.enum(["yes", "no", "abstain"], {
    required_error: "Please select your vote.",
  }),
  rationale: z.string().optional(),
});

type VoteFormData = z.infer<typeof voteFormSchema>;

interface VoteFormProps {
  govActionId: string;
  existingVote?: Vote | null;
}

export default function VoteForm({ govActionId, existingVote }: VoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<VoteFormData>({
    resolver: zodResolver(voteFormSchema),
    defaultValues: {
      vote: existingVote ? existingVote.choice.toLowerCase() as "yes" | "no" | "abstain" : undefined,
      rationale: existingVote?.rationale || undefined,
    },
  });

  const onSubmit = async (data: VoteFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('govActionId', govActionId);
      formData.append('vote', data.vote);
      formData.append('rationale', data.rationale || '');
      formData.append('voter', 'test-user'); // In a real app, this would come from authentication

      const result = await submitVote(formData);
      
      if (result?.success) {
        // Redirect to success page
        router.push('/vote?success=true');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit vote');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cast Your Vote</CardTitle>
        <CardDescription>
          Your vote will be recorded on the Cardano blockchain and cannot be changed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {existingVote && (
          <Alert className="border-blue-200 bg-blue-50 text-blue-800 mb-4">
            <AlertDescription>
              You have already voted <strong>{existingVote.choice}</strong> on this proposal. 
              You can update your vote using the form below.
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert className="border-red-200 bg-red-50 text-red-800 mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="vote"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-medium">
                    Select your vote
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="yes" id="yes" />
                        <div className="flex items-center gap-2 flex-1">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <Label
                            htmlFor="yes"
                            className="font-medium cursor-pointer"
                          >
                            Yes - I support this proposal
                          </Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="no" id="no" />
                        <div className="flex items-center gap-2 flex-1">
                          <XCircle className="h-5 w-5 text-red-600" />
                          <Label
                            htmlFor="no"
                            className="font-medium cursor-pointer"
                          >
                            No - I oppose this proposal
                          </Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="abstain" id="abstain" />
                        <div className="flex items-center gap-2 flex-1">
                          <MinusCircle className="h-5 w-5 text-gray-600" />
                          <Label
                            htmlFor="abstain"
                            className="font-medium cursor-pointer"
                          >
                            Abstain - I choose not to vote
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rationale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rationale (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your reasoning for this vote. This will be publicly visible and help others understand different perspectives."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your rationale will be publicly visible and help inform the community.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? existingVote ? "Updating Vote..." : "Submitting Vote..."
                  : existingVote ? "Update Vote" : "Submit Vote"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}