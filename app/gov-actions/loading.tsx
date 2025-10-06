import { ProposalsLoadingSkeleton } from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <ProposalsLoadingSkeleton count={5} showHeader={true} />
      </div>
    </div>
  );
}