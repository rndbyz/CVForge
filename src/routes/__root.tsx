import { createRootRoute, HeadContent, Link, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import Header from "../components/Header";
import appCss from "../styles.css?url";

function NotFound() {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-4">
			<h1 className="text-6xl font-bold text-muted-foreground">404</h1>
			<p className="text-lg text-muted-foreground">Page not found</p>
			<Link to="/" className="text-sm text-primary underline underline-offset-4 hover:text-primary/80">
				Back to home
			</Link>
		</div>
	);
}

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "CVForge" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	shellComponent: RootDocument,
	notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Header />
				<main className="h-[calc(100vh-3.5rem)]">{children}</main>
				<Toaster />
				<Scripts />
			</body>
		</html>
	);
}
