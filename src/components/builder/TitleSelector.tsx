import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBuilder } from "./BuilderContext";

export function TitleSelector() {
	const { cvTitles, setCvTitles, tailored, setTailored } = useBuilder();
	const [adding, setAdding] = useState(false);
	const [newValue, setNewValue] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editValue, setEditValue] = useState("");

	function addTitle() {
		if (!newValue.trim()) return;
		const id = crypto.randomUUID();
		setCvTitles((prev) => [...prev, { id, value: newValue.trim() }]);
		setNewValue("");
		setAdding(false);
	}

	function startEdit(id: string, value: string) {
		setEditingId(id);
		setEditValue(value);
	}

	function saveEdit() {
		if (!editingId || !editValue.trim()) return;
		setCvTitles((prev) =>
			prev.map((t) =>
				t.id === editingId ? { ...t, value: editValue.trim() } : t,
			),
		);
		setEditingId(null);
	}

	function deleteTitle(id: string) {
		setCvTitles((prev) => prev.filter((t) => t.id !== id));
		if (tailored.titleId === id) {
			setTailored((prev) => ({ ...prev, titleId: undefined }));
		}
	}

	function selectTitle(id: string) {
		setTailored((prev) => ({
			...prev,
			titleId: prev.titleId === id ? undefined : id,
		}));
	}

	return (
		<div className="space-y-2">
			{cvTitles.map((t) => (
				<div
					key={t.id}
					className="flex items-center gap-2 rounded-md border p-2"
				>
					<input
						type="radio"
						name="cv-title"
						checked={tailored.titleId === t.id}
						onChange={() => selectTitle(t.id)}
						className="shrink-0"
					/>
					{editingId === t.id ? (
						<div className="flex flex-1 items-center gap-1">
							<Input
								value={editValue}
								onChange={(e) => setEditValue(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && saveEdit()}
								className="h-7 text-sm"
								autoFocus
							/>
							<Button
								size="icon"
								variant="ghost"
								className="h-7 w-7"
								onClick={saveEdit}
							>
								<Check className="h-3 w-3" />
							</Button>
							<Button
								size="icon"
								variant="ghost"
								className="h-7 w-7"
								onClick={() => setEditingId(null)}
							>
								<X className="h-3 w-3" />
							</Button>
						</div>
					) : (
						<>
							<span className="flex-1 text-sm">{t.value}</span>
							<Button
								size="icon"
								variant="ghost"
								className="h-7 w-7"
								onClick={() => startEdit(t.id, t.value)}
							>
								<Pencil className="h-3 w-3" />
							</Button>
							<Button
								size="icon"
								variant="ghost"
								className="h-7 w-7 text-destructive"
								onClick={() => deleteTitle(t.id)}
							>
								<Trash2 className="h-3 w-3" />
							</Button>
						</>
					)}
				</div>
			))}

			{adding ? (
				<div className="flex items-center gap-1">
					<Input
						value={newValue}
						onChange={(e) => setNewValue(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && addTitle()}
						placeholder="e.g. Senior Full Stack Developer"
						className="h-8 text-sm"
						autoFocus
					/>
					<Button
						size="icon"
						variant="ghost"
						className="h-8 w-8"
						onClick={addTitle}
					>
						<Check className="h-3 w-3" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						className="h-8 w-8"
						onClick={() => {
							setAdding(false);
							setNewValue("");
						}}
					>
						<X className="h-3 w-3" />
					</Button>
				</div>
			) : (
				<Button
					variant="outline"
					size="sm"
					className="w-full"
					onClick={() => setAdding(true)}
				>
					<Plus className="mr-1 h-3 w-3" />
					Add title
				</Button>
			)}
		</div>
	);
}
