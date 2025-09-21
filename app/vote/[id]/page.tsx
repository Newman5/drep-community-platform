"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import * as z from "zod";
import {
  Clock,
  CheckCircle,
  XCircle,
  MinusCircle,
  LinkIcon,
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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { GovAction } from "@prisma/client";

// Form validation schema
const voteFormSchema = z.object({
  vote: z.enum(["yes", "no", "abstain"], {
    required_error: "Please select your vote.",
  }),
  rationale: z.string().optional(),
});

type VoteFormData = z.infer<typeof voteFormSchema>;

export default function VotePage() {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id as string);
  console.log("Proposal ID from URL:", decodedId);

  const [data, setData] = useState<GovAction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/proposals/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch proposal: ${response.statusText}`);
        }

        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<VoteFormData>({
    resolver: zodResolver(voteFormSchema),
  });

  const onSubmit = async (data: VoteFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          govActionId: decodedId,
          vote: data.vote,
          rationale: data.rationale,
          voter: "test-user"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit vote');
      }

      const result = await response.json();
      console.log("Vote submitted:", result);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit vote');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-lg">
                Your vote has been successfully submitted.
              </AlertDescription>
            </Alert>

            <div className="mt-8 text-center">
              <h1 className="text-2xl font-bold mb-4">
                Thank you for participating!
              </h1>
              <p className="text-muted-foreground mb-6">
                Your voice matters in shaping the future of Cardano governance.
              </p>
              <Button onClick={() => (window.location.href = "/vote")}>
                View All Proposals
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {data !== null && (
            <>
              <div className="mb-8">
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error}</div>}

                <Badge variant="secondary" className="mb-4">
                  {data.category}
                </Badge>
                <h1 className="text-xl font-bold mb-4">{data.id}</h1>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <Link
                    href={`/proposals/${data.id}`}
                    className="flex items-center gap-2"
                  >
                    <LinkIcon className="h-4 w-4" /> GovTool
                  </Link>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> days remaining
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Voting Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Cast Your Vote</CardTitle>
                      <CardDescription>
                        Your vote will be recorded on the Cardano blockchain and
                        cannot be changed.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-6"
                        >
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
                                      <RadioGroupItem
                                        value="abstain"
                                        id="abstain"
                                      />
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
                                  Your rationale will be publicly visible and
                                  help inform the community.
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
                                ? "Submitting Vote..."
                                : "Submit Vote"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
