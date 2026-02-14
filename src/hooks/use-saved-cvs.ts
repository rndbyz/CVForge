import { type SavedCvs, type TailoredCV, savedCvsSchema } from "@/lib/schemas";
import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

const defaultSavedCvs: SavedCvs = [];

export function useSavedCvs() {
	const [cvs, setCvs] = useLocalStorage<SavedCvs>(
		"saved_cvs",
		savedCvsSchema,
		defaultSavedCvs,
	);

	const getCvById = useCallback(
		(id: string) => cvs.find((cv) => cv.id === id),
		[cvs],
	);

	const addCv = useCallback(
		(cv: TailoredCV) => {
			setCvs((prev) => [...prev, cv]);
		},
		[setCvs],
	);

	const updateCv = useCallback(
		(updated: TailoredCV) => {
			setCvs((prev) =>
				prev.map((cv) => (cv.id === updated.id ? updated : cv)),
			);
		},
		[setCvs],
	);

	const deleteCv = useCallback(
		(id: string) => {
			setCvs((prev) => prev.filter((cv) => cv.id !== id));
		},
		[setCvs],
	);

	return { cvs, getCvById, addCv, updateCv, deleteCv };
}
