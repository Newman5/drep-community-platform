"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Calendar,
  Clock,
  Users,
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Form validation schema
const voteFormSchema = z.object({
  vote: z.enum(["yes", "no", "abstain"], {
    required_error: "Please select your vote.",
  }),
  rationale: z.string().optional(),
});

type VoteFormData = z.infer<typeof voteFormSchema>;

// Mock proposal data
const proposalData = {
  id: "PROP-2025-001",
  title: "Fund Development of DRep Tools and Education Platform",
  category: "Development & Infrastructure",
  requestedAmount: "150,000 ADA",
  submissionDate: "2025-09-15",
  votingDeadline: "2025-10-15",
  status: "Active",
  requiredThreshold: 51,
  currentResults: {
    yes: 65,
    no: 20,
    abstain: 15,
    totalVotes: 1250,
  },
  daysRemaining: 25,
};

export default function VotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<VoteFormData>({
    resolver: zodResolver(voteFormSchema),
  });

  const onSubmit = async (data: VoteFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Vote submitted:", data);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-lg">
                Your vote has been successfully submitted and recorded on the
                blockchain.
              </AlertDescription>
            </Alert>

            <div className="mt-8 text-center">
              <h1 className="text-2xl font-bold mb-4">
                Thank you for participating!
              </h1>
              <p className="text-muted-foreground mb-6">
                Your voice matters in shaping the future of Cardano governance.
              </p>
              <Button onClick={() => (window.location.href = "/proposals")}>
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
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              {proposalData.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-4">{proposalData.title}</h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Submitted: {proposalData.submissionDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {proposalData.daysRemaining} days remaining
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {proposalData.currentResults.totalVotes} votes cast
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Proposal Details */}
              <Card>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <Label className="font-medium">Transaction</Label>
                      <p className="text-muted-foreground">{proposalData.id}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Voting deadline</Label>
                      <p className="text-muted-foreground">
                        {proposalData.votingDeadline}
                      </p>
                    </div>
                  </div>

                  <ul>
                    <li>
                      <Link
                        href={`/proposals/${proposalData.id}`}
                        className="flex items-center gap-2"
                      >
                        <LinkIcon className="h-4 w-4" /> GovTool
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>

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
                              Your rationale will be publicly visible and help
                              inform the community.
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
                          {isSubmitting ? "Submitting Vote..." : "Submit Vote"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Results</CardTitle>
                  <CardDescription>
                    {proposalData.currentResults.totalVotes} votes •{" "}
                    {proposalData.requiredThreshold}% threshold required
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Yes</span>
                      </div>
                      <span className="text-sm font-bold">
                        {proposalData.currentResults.yes}%
                      </span>
                    </div>
                    <Progress
                      value={proposalData.currentResults.yes}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium">No</span>
                      </div>
                      <span className="text-sm font-bold">
                        {proposalData.currentResults.no}%
                      </span>
                    </div>
                    <Progress
                      value={proposalData.currentResults.no}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MinusCircle className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">Abstain</span>
                      </div>
                      <span className="text-sm font-bold">
                        {proposalData.currentResults.abstain}%
                      </span>
                    </div>
                    <Progress
                      value={proposalData.currentResults.abstain}
                      className="h-2"
                    />
                  </div>

                  <Separator />

                  <div className="text-center text-sm text-muted-foreground">
                    Threshold: {proposalData.requiredThreshold}% Yes votes
                    required
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
