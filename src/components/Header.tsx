import { Link } from "@tanstack/react-router";
import { Download, FileText, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { useLocale } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
	downloadExport,
	exportAllData,
	importAllData,
	readJsonFile,
} from "@/lib/data-io";
import type { Locale } from "@/lib/i18n";

export default function Header() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [locale, setLocale, t] = useLocale();

	const handleExport = () => {
		const data = exportAllData();
		downloadExport(data);
		toast.success(locale === "fr" ? "Données exportées" : "Data exported successfully");
	};

	const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const json = await readJsonFile(file);
			const result = importAllData(json);
			if (result.success) {
				toast.success(locale === "fr" ? "Importé. Rechargement..." : "Data imported successfully. Reloading...");
				setTimeout(() => window.location.reload(), 500);
			} else {
				toast.error(result.error ?? (locale === "fr" ? "Échec de l'import" : "Import failed"));
			}
		} catch {
			toast.error(locale === "fr" ? "Impossible de lire le fichier" : "Failed to read file");
		}

		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const otherLocale: Locale = locale === "en" ? "fr" : "en";

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
						{t("export")}
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => fileInputRef.current?.click()}
					>
						<Upload className="mr-1 h-4 w-4" />
						{t("import")}
					</Button>
					<input
						ref={fileInputRef}
						type="file"
						accept=".json"
						onChange={handleImport}
						className="hidden"
					/>
					<Button
						variant="outline"
						size="sm"
						className="ml-2 w-10 font-medium"
						onClick={() => setLocale(otherLocale)}
					>
						{otherLocale.toUpperCase()}
					</Button>
				</div>
			</div>
		</header>
	);
}
