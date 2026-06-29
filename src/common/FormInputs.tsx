import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useField, useFormikContext } from "formik";

// Shared Tailwind for text controls — extracted so forms don't copy-paste it.
const fieldClassNames = `
    w-full rounded-md border border-gray-300 dark:border-gray-600
    bg-white dark:bg-[#0e1517] px-3 py-2 text-sm text-gray-900 dark:text-gray-100
    focus:border-[#55a8c2] focus:outline-none disabled:opacity-40
`;
const labelClassNames = `block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1`;
const errorClassNames = `mt-1 text-xs text-red-500`;

interface FormFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    suggAutocomplete?: boolean;
    required?: boolean;
}

export function FormTextInput({ name, label, placeholder, suggAutocomplete, required }: FormFieldProps) {
    const [field, meta] = useField(name);
    const showError = meta.touched && !!meta.error;
    return (
        <div className="flex w-full flex-col py-2">
            <label htmlFor={name} className={labelClassNames}>
                {label}{required ? <span className="text-red-500"> *</span> : null}
            </label>
            <input
                id={name}
                type="text"
                autoComplete={suggAutocomplete === false ? "off" : "on"}
                placeholder={placeholder}
                className={fieldClassNames}
                {...field}
            />
            {showError ? <span className={errorClassNames}>{meta.error}</span> : null}
        </div>
    );
}

export interface SelectOption {
    value: string | number;
    label: string;
}

interface FormSelectInputProps extends FormFieldProps {
    options: SelectOption[];
    // Shown as the disabled, empty default option.
    emptyLabel?: string;
    // Minimum characters typed before the autocomplete starts matching/showing
    // suggestions. Defaults to 0 (suggest immediately on focus).
    minSearchChars?: number;
    // When provided, the dropdown is sourced from the backend: each keystroke (past
    // `minSearchChars`) calls this, debounced, instead of filtering `options` locally.
    // `options` is still used to resolve the label of the already-selected value.
    fetchOptions?: (query: string) => Promise<SelectOption[]>;
}

export function FormSelectInput({ name, label, options, required, emptyLabel }: FormSelectInputProps) {
    const [field, meta] = useField(name);
    const showError = meta.touched && !!meta.error;
    return (
        <div className="flex w-full flex-col py-2">
            <label htmlFor={name} className={labelClassNames}>
                {label}{required ? <span className="text-red-500"> *</span> : null}
            </label>
            <select id={name} className={fieldClassNames} {...field}>
                <option value="">{emptyLabel ?? `Select ${label.toLowerCase()}`}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {showError ? <span className={errorClassNames}>{meta.error}</span> : null}
        </div>
    );
}

// Typeahead variant of FormSelectInput for long option lists (e.g. cities). The Formik
// field stores the selected option's `value`; the input shows the matching label and
// filters the dropdown as the user types.
export function FormAutocompleteInput({ name, label, options, required, placeholder, suggAutocomplete, emptyLabel, minSearchChars = 0, fetchOptions }: FormSelectInputProps) {
    const [field, meta, helpers] = useField(name);
    const { setFieldTouched } = useFormikContext();
    const showError = meta.touched && !!meta.error;
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedLabel = useMemo(
        () => options.find((o) => String(o.value) === String(field.value))?.label ?? "",
        [options, field.value]
    );
    const [query, setQuery] = useState(selectedLabel);
    const [open, setOpen] = useState(false);

    // Remote (backend-reactive) mode state: options fetched per keystroke and a flag for
    // the in-flight request. Unused when `fetchOptions` is not supplied.
    const [remoteOptions, setRemoteOptions] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(false);
    // Monotonic id so a slow response from an earlier keystroke can't overwrite a newer one.
    const requestIdRef = useRef(0);

    // Debounced backend fetch. Re-runs as the user types; cancels the pending timer on the
    // next keystroke so we only call the API once typing settles.
    useEffect(() => {
        if (!fetchOptions) return;
        const q = query.trim();
        if (q.length < minSearchChars) {
            setRemoteOptions([]);
            setLoading(false);
            return;
        }
        const requestId = ++requestIdRef.current;
        setLoading(true);
        const handle = setTimeout(() => {
            fetchOptions(q)
                .then((opts) => {
                    if (requestId === requestIdRef.current) setRemoteOptions(opts);
                })
                .catch(() => {
                    if (requestId === requestIdRef.current) setRemoteOptions([]);
                })
                .finally(() => {
                    if (requestId === requestIdRef.current) setLoading(false);
                });
        }, 300);
        return () => clearTimeout(handle);
    }, [query, fetchOptions, minSearchChars]);

    // Sync the visible text when the value or options resolve (cities load after first
    // render, or when editing an existing record) — but never while the user is typing.
    useEffect(() => {
        if (!open) setQuery(selectedLabel);
    }, [selectedLabel, open]);

    // Close the dropdown on an outside click.
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    // Cap the rendered matches so a large list (thousands of cities) stays responsive.
    // Don't match (or show suggestions) until at least `minSearchChars` are typed. In
    // remote mode the backend already filtered, so we render `remoteOptions` as-is.
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (q.length < minSearchChars) return [];
        if (fetchOptions) return remoteOptions.slice(0, 50);
        const matches = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
        return matches.slice(0, 50);
    }, [options, query, minSearchChars, fetchOptions, remoteOptions]);

    const handleSelect = (opt: SelectOption) => {
        helpers.setValue(opt.value);
        setQuery(opt.label);
        setOpen(false);
        setFieldTouched(name, true, false);
    };

    return (
        <div className="flex w-full flex-col py-2" ref={containerRef}>
            <label htmlFor={name} className={labelClassNames}>
                {label}{required ? <span className="text-red-500"> *</span> : null}
            </label>
            <div className="relative">
                <input
                    id={name}
                    type="text"
                    autoComplete={suggAutocomplete === false ? "off" : "on"}
                    placeholder={placeholder ?? emptyLabel ?? `Search ${label.toLowerCase()}`}
                    className={fieldClassNames}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                        // Typing invalidates a prior selection until a new option is picked.
                        if (field.value) helpers.setValue("");
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setFieldTouched(name, true, false)}
                />
                {open && (loading || filtered.length > 0) ? (
                    <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-[#0e1517]">
                        {loading ? (
                            <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">Searching…</li>
                        ) : filtered.map((opt) => (
                            <li key={opt.value}>
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSelect(opt)}
                                    className="block w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-[#55a8c2]/10 dark:text-gray-100"
                                >
                                    {opt.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
            {showError ? <span className={errorClassNames}>{meta.error}</span> : null}
        </div>
    );
}

// Single-image picker that stores the chosen file as a base64 data-URL string in the
// Formik field, with an inline preview. Pairs with `images: string[]` payloads.
export function FormImageInput({ name, label, required }: FormFieldProps) {
    const [field, meta, helpers] = useField<string>(name);
    const showError = meta.touched && !!meta.error;
    const value = field.value;

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        // Reset the input value so picking the same file again still fires onChange.
        e.target.value = "";
        debugger;
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            helpers.setValue(reader.result as string);
        }
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex w-full flex-col py-2">
            <label className={labelClassNames}>
                {label}{required ? <span className="text-red-500"> *</span> : null}
            </label>
            {value ? (
                <div className="relative mb-2 w-full overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
                    <img src={value} alt="Preview" className="h-40 w-full object-cover sm:h-48" />
                    <button
                        type="button"
                        onClick={() => helpers.setValue("")}
                        className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-white hover:bg-black/80"
                    >
                        Remove
                    </button>
                </div>
            ) : null}
            {/* The input is a sibling of the label (not nested). Nesting it inside a label
                that also has htmlFor fires the file dialog twice, which cancels the picker. */}
            <label
                htmlFor={name}
                className="cursor-pointer rounded-md border border-dashed border-gray-300 px-3 py-4 text-center text-sm text-gray-500 hover:border-[#55a8c2] dark:border-gray-600 dark:text-gray-400"
            >
                {value ? "Change image" : "Click to upload an image"}
            </label>
            <input autoComplete="off" name={name} id={name} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            {showError ? <span className={errorClassNames}>{meta.error}</span> : null}
        </div>
    );
}

interface FormCheckboxInputProps {
    name: string;
    label: string;
}

// Boolean toggle bound to a Formik field. Stores `true`/`false` (not a string) via
// Formik's checkbox handling, with the label beside the box.
export function FormCheckboxInput({ name, label }: FormCheckboxInputProps) {
    const [field, meta] = useField({ name, type: "checkbox" });
    const showError = meta.touched && !!meta.error;
    return (
        <div className="flex w-full flex-col py-2">
            <label htmlFor={name} className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <input
                    id={name}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#55a8c2] focus:ring-[#55a8c2]"
                    {...field}
                />
                {label}
            </label>
            {showError ? <span className={errorClassNames}>{meta.error}</span> : null}
        </div>
    );
}

interface FormTextAreaProps extends FormFieldProps {
    rows?: number;
}

export function FormTextArea({ name, label, placeholder, required, suggAutocomplete, rows = 4 }: FormTextAreaProps) {
    const [field, meta] = useField(name);
    const showError = meta.touched && !!meta.error;
    return (
        <div className="flex w-full flex-col py-2">
            <label htmlFor={name} className={labelClassNames}>
                {label}{required ? <span className="text-red-500"> *</span> : null}
            </label>
            <textarea
                id={name}
                rows={rows}
                autoComplete={suggAutocomplete === false ? "off" : "on"}
                placeholder={placeholder}
                className={fieldClassNames}
                {...field}
            />
            {showError ? <span className={errorClassNames}>{meta.error}</span> : null}
        </div>
    );
}
