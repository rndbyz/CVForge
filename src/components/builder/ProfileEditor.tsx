import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/lib/schemas";
import { useBuilder } from "./BuilderContext";

export function ProfileEditor() {
	const { profile, setProfile } = useBuilder();
	const id = useId();

	function update(field: keyof Profile, value: string) {
		setProfile((prev) => ({ ...prev, [field]: value }));
	}

	return (
		<div className="grid gap-3">
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-name`} className="text-xs">
					Name
				</Label>
				<Input
					id={`${id}-name`}
					value={profile.name}
					onChange={(e) => update("name", e.target.value)}
					placeholder="John Doe"
					className="h-8 text-sm"
				/>
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-email`} className="text-xs">
					Email
				</Label>
				<Input
					id={`${id}-email`}
					value={profile.email}
					onChange={(e) => update("email", e.target.value)}
					placeholder="john@example.com"
					className="h-8 text-sm"
				/>
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-phone`} className="text-xs">
					Phone
				</Label>
				<Input
					id={`${id}-phone`}
					value={profile.phone}
					onChange={(e) => update("phone", e.target.value)}
					placeholder="+33 6 12 34 56 78"
					className="h-8 text-sm"
				/>
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-location`} className="text-xs">
					Location
				</Label>
				<Input
					id={`${id}-location`}
					value={profile.location}
					onChange={(e) => update("location", e.target.value)}
					placeholder="Paris, France"
					className="h-8 text-sm"
				/>
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-linkedin`} className="text-xs">
					LinkedIn
				</Label>
				<Input
					id={`${id}-linkedin`}
					value={profile.linkedin ?? ""}
					onChange={(e) => update("linkedin", e.target.value)}
					placeholder="https://linkedin.com/in/..."
					className="h-8 text-sm"
				/>
			</div>
			<div className="grid gap-1.5">
				<Label htmlFor={`${id}-github`} className="text-xs">
					GitHub
				</Label>
				<Input
					id={`${id}-github`}
					value={profile.github ?? ""}
					onChange={(e) => update("github", e.target.value)}
					placeholder="https://github.com/..."
					className="h-8 text-sm"
				/>
			</div>
		</div>
	);
}
