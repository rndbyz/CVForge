import { useNavigate, useBlocker } from "@tanstack/react-router";
import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	RotateCcw,
	Save,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	useCvTitles,
	useEducation,
	useExperiences,
	useIntroductions,
	useProfile,
	useResolvedCv,
	useSavedCvs,
	useSkills,
} from "@/hooks";
import type { TailoredCV } from "@/lib/schemas";
import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import { BuilderProvider } from "./BuilderContext";
import { CvPreview } from "./CvPreview";
import { KnowledgePanel } from "./KnowledgePanel";

function deepEqual(a: unknown, b: unknown): boolean {
	return JSON.stringify(a) === JSON.stringify(b);
}

export function BuilderPage({ cvId }: { cvId: string }) {
	const navigate = useNavigate();
	const [panelOpen, setPanelOpen] = useState(true);

	// Shared KB hooks (auto-persisted to localStorage)
	const [profile, setProfile] = useProfile();
	const [cvTitles, setCvTitles] = useCvTitles();
	const [introductions, setIntroductions] = useIntroductions();
	const [skills, setSkills] = useSkills();
	const [experiences, setExperiences] = useExperiences();
	const [education, setEducation] = useEducation();

	// Multi-CV storage
	const { getCvById, updateCv } = useSavedCvs();
	const savedCv = getCvById(cvId);

	// Working copy (in-memory, not persisted until save)
	const [workingCopy, setWorkingCopy] = useState<TailoredCV | null>(null);
	const savedRef = useRef<TailoredCV | null>(null);

	// Initialize working copy from saved CV
	useEffect(() => {
		if (savedCv && !workingCopy) {
			setWorkingCopy(savedCv);
			savedRef.current = savedCv;
		}
	}, [savedCv, workingCopy]);

	// CV name editing
	const [cvName, setCvNameState] = useState(savedCv?.name ?? "Untitled CV");
	useEffect(() => {
		if (savedCv) setCvNameState(savedCv.name);
	}, [savedCv]);

	const setCvName = useCallback((name: string) => {
		setCvNameState(name);
		setWorkingCopy((prev) => (prev ? { ...prev, name } : prev));
	}, []);

	// Detect unsaved changes
	const hasUnsavedChanges = useMemo(() => {
		if (!workingCopy || !savedRef.current) return false;
		return !deepEqual(workingCopy, savedRef.current) || cvName !== savedRef.current.name;
	}, [workingCopy, cvName]);

	// Save handler
	const onSave = useCallback(() => {
		if (!workingCopy) return;
		const updated = {
			...workingCopy,
			name: cvName,
			updatedAt: new Date().toISOString(),
		};
		updateCv(updated);
		savedRef.current = updated;
		setWorkingCopy(updated);
	}, [workingCopy, cvName, updateCv]);

	// Reset handler
	const onReset = useCallback(() => {
		if (savedRef.current) {
			setWorkingCopy(savedRef.current);
			setCvNameState(savedRef.current.name);
		}
	}, []);

	// Back navigation with unsaved changes dialog
	const [showLeaveDialog, setShowLeaveDialog] = useState(false);

	const handleBack = useCallback(() => {
		if (hasUnsavedChanges) {
			setShowLeaveDialog(true);
		} else {
			navigate({ to: "/" });
		}
	}, [hasUnsavedChanges, navigate]);

	const confirmLeave = useCallback(() => {
		setShowLeaveDialog(false);
		navigate({ to: "/" });
	}, [navigate]);

	// Block in-app navigation via TanStack Router
	useBlocker({
		shouldBlockFn: () => hasUnsavedChanges,
		withResolver: false,
		blockerFn: () => {
			setShowLeaveDialog(true);
		},
	});

	// Block browser close/refresh
	useEffect(() => {
		if (!hasUnsavedChanges) return;
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
		};
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, [hasUnsavedChanges]);

	// Resolve CV for preview
	const resolved = useResolvedCv(
		profile,
		workingCopy ?? {
			id: cvId,
			name: "Untitled CV",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			selectedSkillNames: [],
			experiences: [],
			educationIds: [],
		},
		cvTitles,
		introductions,
		skills,
		experiences,
		education,
	);

	// Handle CV not found
	if (!savedCv) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<p className="text-lg text-muted-foreground">CV not found</p>
					<Button
						variant="link"
						onClick={() => navigate({ to: "/" })}
						className="mt-2"
					>
						Go back to list
					</Button>
				</div>
			</div>
		);
	}

	return (
		<BuilderProvider
			value={{
				profile,
				setProfile,
				cvTitles,
				setCvTitles,
				introductions,
				setIntroductions,
				skills,
				setSkills,
				experiences,
				setExperiences,
				education,
				setEducation,
				tailored: workingCopy ?? savedCv,
				setTailored: setWorkingCopy as (
					value: TailoredCV | ((prev: TailoredCV) => TailoredCV),
				) => void,
				cvName,
				setCvName,
				onSave,
				onReset,
				hasUnsavedChanges,
			}}
		>
			<div className="flex h-full flex-col">
				{/* Toolbar */}
				<div className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3">
					<Button variant="ghost" size="icon" onClick={handleBack}>
						<ArrowLeft className="h-4 w-4" />
					</Button>

					<Input
						value={cvName}
						onChange={(e) => setCvName(e.target.value)}
						className="h-8 w-56 text-sm font-medium"
					/>

					<div className="ml-auto flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onReset}
							disabled={!hasUnsavedChanges}
						>
							<RotateCcw className="mr-1 h-3.5 w-3.5" />
							Reset
						</Button>
						<Button
							size="sm"
							onClick={onSave}
							disabled={!hasUnsavedChanges}
						>
							<Save className="mr-1 h-3.5 w-3.5" />
							Save
						</Button>
					</div>
				</div>

				{/* Main content */}
				<div className="flex flex-1 overflow-hidden">
					{/* Side panel */}
					<aside
						className={cn(
							"shrink-0 border-r bg-card transition-all duration-300 overflow-hidden",
							panelOpen ? "w-95" : "w-0",
						)}
					>
						{panelOpen && <KnowledgePanel />}
					</aside>

					{/* Toggle button */}
					<button
						type="button"
						onClick={() => setPanelOpen((prev) => !prev)}
						className="flex w-6 shrink-0 items-center justify-center border-r bg-background hover:bg-accent transition-colors"
					>
						{panelOpen ? (
							<ChevronLeft className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</button>

					{/* Center: CV Preview */}
					<div className="flex-1 overflow-auto flex items-start justify-center p-6 bg-muted/30">
						<CvPreview resolved={resolved} />
					</div>
				</div>
			</div>

			{/* Leave confirmation dialog */}
			<AlertDialog
				open={showLeaveDialog}
				onOpenChange={(open) => !open && setShowLeaveDialog(false)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Unsaved changes</AlertDialogTitle>
						<AlertDialogDescription>
							You have unsaved changes. Are you sure you want to leave? Your
							changes will be lost.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmLeave}>
							Discard & Leave
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</BuilderProvider>
	);
}
