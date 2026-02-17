import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/hooks";
import type { Certification } from "@/lib/schemas";
import { useBuilder } from "./BuilderContext";

export function CertificationEditor() {
	const { certifications, setCertifications, tailored, setTailored } =
		useBuilder();
	const [, , t] = useLocale();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingCert, setEditingCert] = useState<Certification | null>(null);
	const [form, setForm] = useState({
		name: "",
		issuer: "",
		date: "",
		expiryDate: "",
		credentialId: "",
	});

	function toggleCertification(id: string) {
		setTailored((prev) => ({
			...prev,
			certificationIds: (prev.certificationIds ?? []).includes(id)
				? (prev.certificationIds ?? []).filter((cid) => cid !== id)
				: [...(prev.certificationIds ?? []), id],
		}));
	}

	function openAdd() {
		setEditingCert(null);
		setForm({ name: "", issuer: "", date: "", expiryDate: "", credentialId: "" });
		setDialogOpen(true);
	}

	function openEdit(cert: Certification) {
		setEditingCert(cert);
		setForm({
			name: cert.name,
			issuer: cert.issuer,
			date: cert.date,
			expiryDate: cert.expiryDate ?? "",
			credentialId: cert.credentialId ?? "",
		});
		setDialogOpen(true);
	}

	function saveCertification() {
		if (!form.name.trim() || !form.issuer.trim() || !form.date.trim()) return;

		const data: Omit<Certification, "id"> = {
			name: form.name.trim(),
			issuer: form.issuer.trim(),
			date: form.date.trim(),
			expiryDate: form.expiryDate.trim() || undefined,
			credentialId: form.credentialId.trim() || undefined,
		};

		if (editingCert) {
			setCertifications((prev) =>
				prev.map((c) =>
					c.id === editingCert.id ? { ...data, id: c.id } : c,
				),
			);
		} else {
			const id = crypto.randomUUID();
			setCertifications((prev) => [...prev, { ...data, id }]);
		}
		setDialogOpen(false);
	}

	function deleteCertification(id: string) {
		setCertifications((prev) => prev.filter((c) => c.id !== id));
		setTailored((prev) => ({
			...prev,
			certificationIds: (prev.certificationIds ?? []).filter(
				(cid) => cid !== id,
			),
		}));
	}

	return (
		<div className="space-y-2">
			{certifications.map((cert) => (
				<div
					key={cert.id}
					className="flex items-center gap-2 rounded-md border p-2"
				>
					<Checkbox
						checked={(tailored.certificationIds ?? []).includes(cert.id)}
						onCheckedChange={() => toggleCertification(cert.id)}
					/>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium">{cert.name}</p>
						<p className="text-xs text-muted-foreground">
							{cert.issuer} — {cert.date}
							{cert.expiryDate ? ` → ${cert.expiryDate}` : ""}
						</p>
					</div>
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7"
						onClick={() => openEdit(cert)}
					>
						<Pencil className="h-3 w-3" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7 text-destructive"
						onClick={() => deleteCertification(cert.id)}
					>
						<Trash2 className="h-3 w-3" />
					</Button>
				</div>
			))}

			{certifications.length === 0 && (
				<p className="text-xs text-muted-foreground">{t("noCertifications")}</p>
			)}

			<Button variant="outline" size="sm" className="w-full" onClick={openAdd}>
				<Plus className="mr-1 h-3 w-3" />
				{t("addCertification")}
			</Button>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{editingCert ? t("editCertification") : t("newCertification")}
						</DialogTitle>
					</DialogHeader>
					<div className="grid gap-3 py-2">
						<div className="grid gap-1.5">
							<Label className="text-xs">{t("certName")}</Label>
							<Input
								value={form.name}
								onChange={(e) =>
									setForm((f) => ({ ...f, name: e.target.value }))
								}
								placeholder={t("certNamePlaceholder")}
								className="h-8 text-sm"
							/>
						</div>
						<div className="grid gap-1.5">
							<Label className="text-xs">{t("issuer")}</Label>
							<Input
								value={form.issuer}
								onChange={(e) =>
									setForm((f) => ({ ...f, issuer: e.target.value }))
								}
								placeholder={t("issuerPlaceholder")}
								className="h-8 text-sm"
							/>
						</div>
						<div className="grid gap-1.5">
							<Label className="text-xs">{t("date")}</Label>
							<Input
								value={form.date}
								onChange={(e) =>
									setForm((f) => ({ ...f, date: e.target.value }))
								}
								placeholder={t("datePlaceholder")}
								className="h-8 text-sm"
							/>
						</div>
						<div className="grid gap-1.5">
							<Label className="text-xs">{t("expiryDate")}</Label>
							<Input
								value={form.expiryDate}
								onChange={(e) =>
									setForm((f) => ({ ...f, expiryDate: e.target.value }))
								}
								placeholder={t("datePlaceholder")}
								className="h-8 text-sm"
							/>
						</div>
						<div className="grid gap-1.5">
							<Label className="text-xs">{t("credentialId")}</Label>
							<Input
								value={form.credentialId}
								onChange={(e) =>
									setForm((f) => ({ ...f, credentialId: e.target.value }))
								}
								placeholder="ABC-123456"
								className="h-8 text-sm"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							{t("cancel")}
						</Button>
						<Button onClick={saveCertification}>
							{editingCert ? t("saveBtn") : t("add")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
