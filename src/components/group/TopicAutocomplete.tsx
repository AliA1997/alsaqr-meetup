import { useEffect } from "react";
import { useField } from "formik";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { FormAutocompleteInput, SelectOption } from "@common/FormInputs";

interface TopicAutocompleteProps {
    // Formik field holding the selected topic names (string[]).
    name: string;
    // Transient Formik field the underlying single-select autocomplete writes into.
    pickerName: string;
    label?: string;
}

// Multi-select topic picker built on the shared single-select `FormAutocompleteInput`.
// The autocomplete writes the picked topic into a transient `pickerName` field; this
// wrapper moves it into the `name` array and renders the selections as removable chips.
const TopicAutocomplete = observer(({ name, pickerName, label = "Topics" }: TopicAutocompleteProps) => {
    const { commonStore } = useStore();
    const { topics, loadTopics } = commonStore;

    // Load the topic source once; cached and reused across mounts/keystrokes.
    useEffect(() => {
        loadTopics();
    }, [loadTopics]);

    const [topicsField, , topicsHelpers] = useField<string[]>(name);
    const [pickerField, , pickerHelpers] = useField<string>(pickerName);

    const selected = topicsField.value ?? [];

    // Hide already-selected topics from the option list.
    const options: SelectOption[] = topics
        .filter((t) => !selected.includes(t.name))
        .map((t) => ({ value: t.name, label: t.name }));

    // When a topic is picked, append it to the array and reset the transient field.
    useEffect(() => {
        const picked = pickerField.value;
        if (picked && !selected.includes(picked)) {
            topicsHelpers.setValue([...selected, picked]);
            pickerHelpers.setValue("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickerField.value]);

    const removeTopic = (topic: string) =>
        topicsHelpers.setValue(selected.filter((t) => t !== topic));

    return (
        <div className="flex w-full flex-col">
            <FormAutocompleteInput
                name={pickerName}
                label={label}
                options={options}
                placeholder="Search topics"
                emptyLabel="Search topics"
            />
            {selected.length > 0 ? (
                <div className="flex flex-wrap gap-2 pb-2">
                    {selected.map((t) => (
                        <span
                            key={t}
                            className="flex items-center gap-1 rounded-full bg-[#55a8c2]/10 px-3 py-1 text-sm text-[#55a8c2]"
                        >
                            {t}
                            <button
                                type="button"
                                aria-label={`Remove ${t}`}
                                onClick={() => removeTopic(t)}
                                className="font-bold leading-none hover:text-red-500"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            ) : null}
        </div>
    );
});

export default TopicAutocomplete;
