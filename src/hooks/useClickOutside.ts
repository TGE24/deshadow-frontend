import { useEffect, useRef } from "react";

/**
 * Custom hook to handle clicks outside of a referenced element
 * @param callback - Function to call when clicking outside
 * @param isActive - Whether the hook should be active (optional, defaults to true)
 * @returns ref - Reference to attach to the element
 */
export const useClickOutside = <T extends HTMLElement = HTMLDivElement>(
	callback: () => void,
	isActive: boolean = true
) => {
	const ref = useRef<T>(null);

	useEffect(() => {
		const handleClickOutside = (event: Event) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				callback();
			}
		};

		if (isActive) {
			document.addEventListener("mousedown", handleClickOutside);
			// Also handle touch events for mobile
			document.addEventListener("touchstart", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [callback, isActive]);

	return ref;
};
