import { Link } from "@tanstack/react-router";
import { FileText, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
	return (
		<header className="border-b bg-background">
			<div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
				<Link to="/" className="flex items-center gap-2">
					<FileText className="h-6 w-6 text-primary" />
					<span className="text-lg font-semibold">CV Optimizer</span>
				</Link>
				<nav className="flex items-center gap-1">
					<Button variant="ghost" size="sm" asChild>
						<Link
							to="/"
							activeProps={{ className: "bg-accent" }}
							activeOptions={{ exact: true }}
						>
							<Home className="mr-1.5 h-4 w-4" />
							Home
						</Link>
					</Button>
					<Button variant="ghost" size="sm" asChild>
						<Link to="/settings" activeProps={{ className: "bg-accent" }}>
							<Settings className="mr-1.5 h-4 w-4" />
							Settings
						</Link>
					</Button>
				</nav>
			</div>
		</header>
	);
}
