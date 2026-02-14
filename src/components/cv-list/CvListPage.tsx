import { useNavigate } from "@tanstack/react-router";
import { DatabaseZap, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSavedCvs } from "@/hooks";
import { importAllData } from "@/lib/data-io";
import demoSeed from "@/lib/demo-seed.json";
import type { TailoredCV } from "@/lib/schemas";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

function createEmptyCv(): TailoredCV {
	const now = new Date().toISOString();
	return {
		id: crypto.randomUUID(),
		name: "Untitled CV",
		createdAt: now,
		updatedAt: now,
		titleId: undefined,
		introductionId: undefined,
		selectedSkillNames: [],
		experiences: [],
		educationIds: [],
	};
}

export function CvListPage() {
	const { cvs, addCv, deleteCv } = useSavedCvs();
	const navigate = useNavigate();
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const handleAdd = () => {
		const cv = createEmptyCv();
		addCv(cv);
		navigate({ to: "/builder/$cvId", params: { cvId: cv.id } });
	};

	const handleOpen = (id: string) => {
		navigate({ to: "/builder/$cvId", params: { cvId: id } });
	};

	const handleDelete = () => {
		if (deleteId) {
			deleteCv(deleteId);
			setDeleteId(null);
		}
	};

	return (
		<div className="flex h-full items-start justify-center overflow-auto p-8">
			<div className="w-full max-w-4xl">
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-2xl font-bold">My CVs</h1>
					{cvs.length === 0 && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								importAllData(demoSeed);
								window.location.reload();
							}}
						>
							<DatabaseZap className="mr-1 h-3.5 w-3.5" />
							Load Demo Data
						</Button>
					)}
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{/* Add CV card */}
					<button type="button" onClick={handleAdd} className="group">
						<Card className="flex h-full min-h-[140px] cursor-pointer items-center justify-center border-dashed transition-colors hover:border-primary hover:bg-accent/50">
							<div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary">
								<Plus className="h-8 w-8" />
								<span className="text-sm font-medium">New CV</span>
							</div>
						</Card>
					</button>

					{/* Existing CVs */}
					{cvs.map((cv) => (
						<Card
							key={cv.id}
							className="group relative min-h-[140px] cursor-pointer transition-colors hover:border-primary/50"
							onClick={() => handleOpen(cv.id)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") handleOpen(cv.id);
							}}
							tabIndex={0}
							role="button"
						>
							<CardHeader>
								<CardTitle className="text-base">{cv.name}</CardTitle>
								<CardDescription>
									Updated{" "}
									{new Date(cv.updatedAt).toLocaleDateString(undefined, {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</CardDescription>
							</CardHeader>
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
								onClick={(e) => {
									e.stopPropagation();
									setDeleteId(cv.id);
								}}
							>
								<Trash2 className="h-4 w-4 text-destructive" />
							</Button>
						</Card>
					))}
				</div>
			</div>

			{/* Delete confirmation */}
			<AlertDialog
				open={deleteId !== null}
				onOpenChange={(open) => !open && setDeleteId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete CV</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete this CV. Your knowledge base data
							will not be affected.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
