import { createFileRoute } from "@tanstack/react-router";
import { BuilderPage } from "@/components/builder";

export const Route = createFileRoute("/builder/$cvId")({
	component: BuilderRoute,
});

function BuilderRoute() {
	const { cvId } = Route.useParams();
	return <BuilderPage cvId={cvId} />;
}
