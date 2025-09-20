import { fetchAllProposals, getPendingProposals, updateExpiredProposals } from "./utils";

export default async function UpdateProposalsPage() {
    await fetchAllProposals();
    await updateExpiredProposals();
    await getPendingProposals();
}
