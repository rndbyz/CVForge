import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBuilder } from "./BuilderContext";

export function IntroductionSelector() {
	const { introductions, setIntroductions, tailored, setTailored } =
		useBuilder();
	const [adding, setAdding] = useState(false);
	const [newLabel, setNewLabel] = useState("");
	const [newText, setNewText] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editLabel, setEditLabel] = useState("");
	const [editText, setEditText] = useState("");

	function addIntro() {
		if (!newLabel.trim() || !newText.trim()) return;
		const id = crypto.randomUUID();
		setIntroductions((prev) => [
			...prev,
			{ id, label: newLabel.trim(), text: newText.trim() },
		]);
		setNewLabel("");
		setNewText("");
		setAdding(false);
	}

	function startEdit(id: string, label: string, text: string) {
		setEditingId(id);
		setEditLabel(label);
		setEditText(text);
	}

	function saveEdit() {
		if (!editingId || !editLabel.trim() || !editText.trim()) return;
		setIntroductions((prev) =>
			prev.map((i) =>
				i.id === editingId
					? { ...i, label: editLabel.trim(), text: editText.trim() }
					: i,
			),
		);
		setEditingId(null);
	}

	function deleteIntro(id: string) {
		setIntroductions((prev) => prev.filter((i) => i.id !== id));
		if (tailored.introductionId === id) {
			setTailored((prev) => ({ ...prev, introductionId: undefined }));
		}
	}

	function selectIntro(id: string) {
		setTailored((prev) => ({
			...prev,
			introductionId: prev.introductionId === id ? undefined : id,
		}));
	}

	return (
		<div className="space-y-2">
			{introductions.map((intro) => (
				<div key={intro.id} className="rounded-md border p-2">
					{editingId === intro.id ? (
						<div className="space-y-2">
							<Input
								value={editLabel}
								onChange={(e) => setEditLabel(e.target.value)}
								placeholder="Label"
								className="h-7 text-sm"
								autoFocus
							/>
							<Textarea
								value={editText}
								onChange={(e) => setEditText(e.target.value)}
								placeholder="Introduction text..."
								className="min-h-[80px] text-sm"
							/>
							<div className="flex justify-end gap-1">
								<Button
									size="sm"
									variant="ghost"
									onClick={() => setEditingId(null)}
								>
									Cancel
								</Button>
								<Button size="sm" onClick={saveEdit}>
									Save
								</Button>
							</div>
						</div>
					) : (
						<>
							<div className="flex items-center gap-2">
								<input
									type="radio"
									name="cv-intro"
									checked={tailored.introductionId === intro.id}
									onChange={() => selectIntro(intro.id)}
									className="shrink-0"
								/>
								<span className="flex-1 text-sm font-medium">
									{intro.label}
								</span>
								<Button
									size="icon"
									variant="ghost"
									className="h-7 w-7"
									onClick={() => startEdit(intro.id, intro.label, intro.text)}
								>
									<Pencil className="h-3 w-3" />
								</Button>
								<Button
									size="icon"
									variant="ghost"
									className="h-7 w-7 text-destructive"
									onClick={() => deleteIntro(intro.id)}
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
							<p className="mt-1 pl-6 text-xs text-muted-foreground line-clamp-2">
								{intro.text}
							</p>
						</>
					)}
				</div>
			))}

			{adding ? (
				<div className="space-y-2 rounded-md border p-2">
					<Input
						value={newLabel}
						onChange={(e) => setNewLabel(e.target.value)}
						placeholder="Label (e.g. Technical Focus)"
						className="h-7 text-sm"
						autoFocus
					/>
					<Textarea
						value={newText}
						onChange={(e) => setNewText(e.target.value)}
						placeholder="Introduction text..."
						className="min-h-[80px] text-sm"
					/>
					<div className="flex justify-end gap-1">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => {
								setAdding(false);
								setNewLabel("");
								setNewText("");
							}}
						>
							Cancel
						</Button>
						<Button size="sm" onClick={addIntro}>
							Add
						</Button>
					</div>
				</div>
			) : (
				<Button
					variant="outline"
					size="sm"
					className="w-full"
					onClick={() => setAdding(true)}
				>
					<Plus className="mr-1 h-3 w-3" />
					Add introduction
				</Button>
			)}
		</div>
	);
}
