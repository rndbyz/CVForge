import { Link } from "@tanstack/react-router";
import { Download, FileText, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	downloadExport,
	exportAllData,
	importAllData,
	readJsonFile,
} from "@/lib/data-io";

export default function Header() {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleExport = () => {
		const data = exportAllData();
		downloadExport(data);
		toast.success("Data exported successfully");
	};

	const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const json = await readJsonFile(file);
			const result = importAllData(json);
			if (result.success) {
				toast.success("Data imported successfully. Reloading...");
				setTimeout(() => window.location.reload(), 500);
			} else {
				toast.error(result.error ?? "Import failed");
			}
		} catch {
			toast.error("Failed to read file");
		}

		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return (
		<header className="border-b bg-background">
			<div className="flex h-14 items-center px-4">
				<Link to="/" className="flex items-center gap-2">
					<FileText className="h-6 w-6 text-primary" />
					<span className="text-lg font-semibold">CVForge</span>
				</Link>

				<div className="ml-auto flex items-center gap-1">
					<Button variant="ghost" size="sm" onClick={handleExport}>
						<Download className="mr-1 h-4 w-4" />
						Export
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => fileInputRef.current?.click()}
					>
						<Upload className="mr-1 h-4 w-4" />
						Import
					</Button>
					<input
						ref={fileInputRef}
						type="file"
						accept=".json"
						onChange={handleImport}
						className="hidden"
					/>
				</div>
			</div>
		</header>
	);
}
