import { useCallback, useEffect, useState } from "react";
import type { z } from "zod";

export function useLocalStorage<T>(
	key: string,
	schema: z.ZodType<T>,
	defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
	const [storedValue, setStoredValue] = useState<T>(defaultValue);

	// Hydrate from localStorage on mount (client-side only)
	useEffect(() => {
		try {
			const item = window.localStorage.getItem(key);
			if (item) {
				const parsed = JSON.parse(item);
				const result = schema.safeParse(parsed);
				if (result.success) {
					setStoredValue(result.data);
				}
			}
		} catch {
			// Invalid JSON or storage error — keep default
		}
	}, [key, schema]);

	const setValue = useCallback(
		(value: T | ((prev: T) => T)) => {
			setStoredValue((prev) => {
				const nextValue = value instanceof Function ? value(prev) : value;
				try {
					window.localStorage.setItem(key, JSON.stringify(nextValue));
				} catch {
					// Storage full or unavailable
				}
				return nextValue;
			});
		},
		[key],
	);

	const clearValue = useCallback(() => {
		setStoredValue(defaultValue);
		try {
			window.localStorage.removeItem(key);
		} catch {
			// Storage unavailable
		}
	}, [key, defaultValue]);

	return [storedValue, setValue, clearValue];
}
