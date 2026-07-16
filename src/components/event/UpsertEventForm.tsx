import { useCallback, useEffect } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import { useStore } from "@stores/index";
import { EventRecord, UpsertEventRequest } from "@models/event";
import { FormTextInput, FormTextArea, FormAutocompleteInput, FormImageInput, FormCheckboxInput, SelectOption } from "@common/FormInputs";
import { ButtonLoader } from "@common/CustomLoader";

interface UpsertEventFormProps {
    // When provided the form edits this event, otherwise it creates a new one.
    event?: EventRecord;
    // Set when creating from a group details page — the event is pre-associated with this
    // group (events are only created from the group they belong to).
    groupId?: string;
    onClose: () => void;
    // Invoked after a successful edit (not on create or cancel) so the caller can
    // refresh whichever view it owns.
    onUpdated?: () => void;
}

type UpsertEventFormValues = {
    name: string;
    description: string;
    cityId: string;
    // Base64 data-URL of the chosen image; optional.
    image: string;
    // Whether the event is held online rather than at a physical location.
    isOnline: boolean;
};

// Centralized validation (Yup unavailable in this project). Name, description and city are
// required per the spec.
const validate = (values: UpsertEventFormValues) => {
    const errors: Partial<Record<keyof UpsertEventFormValues, string>> = {};
    if (!values.name?.trim()) errors.name = "Name is required";
    if (!values.description?.trim()) errors.description = "Description is required";
    if (!values.cityId) errors.cityId = "City is required";
    return errors;
};

const UpsertEventForm = observer(({ event, groupId, onClose, onUpdated }: UpsertEventFormProps) => {
    const { eventsFeedStore, myEventsFeedStore, commonStore } = useStore();
    const { createEvent, updateEvent } = eventsFeedStore;
    const { cities, loadCities, searchCities } = commonStore;
    const navigate = useNavigate();

    useEffect(() => {
        loadCities();
    }, [loadCities]);

    const cityOptions: SelectOption[] = cities.map((c) => ({
        value: c.id,
        label: `${c.name}, ${c.country}`,
    }));

    // Backend-reactive city options: queried per keystroke by the autocomplete. Stable
    // identity (store action) so the input's debounced fetch effect doesn't churn.
    const fetchCityOptions = useCallback(
        async (query: string): Promise<SelectOption[]> => {
            const results = await searchCities(query);
            return results.map((c) => ({ value: c.id, label: `${c.name}, ${c.country}` }));
        },
        [searchCities]
    );

    const initialValues: UpsertEventFormValues = {
        name: event?.name ?? "",
        description: event?.description ?? "",
        // The autocomplete matches options by id, so seed it with the hosted city's id.
        cityId: event?.citiesHosted?.[0]?.id != null ? String(event.citiesHosted[0].id) : "",
        image: typeof event?.images?.[0] === "string" ? event.images[0] : "",
        isOnline: event?.isOnline ?? false,
    };

    const handleSubmit = async (
        values: UpsertEventFormValues,
        helpers: FormikHelpers<UpsertEventFormValues>
    ) => {
        const selectedCity = cities.find((c) => String(c.id) === values.cityId);

        const payload: UpsertEventRequest = {
            name: values.name,
            description: values.description,
            groupId: event?.groupId ?? groupId,
            city: selectedCity ? selectedCity.name : '',
            stateOrProvince: selectedCity ? selectedCity.stateOrProvince : '',
            images: values.image ? [values.image] : [],
            isOnline: values.isOnline,
        };
        try {
            if (event) {
                await updateEvent(event.id, { ...payload, id: event.id });
                onUpdated?.();
                onClose();
            } else {
                const created = await createEvent(payload);
                onClose();
                // When created from a group's details page, refresh that page in place so the
                // new event shows up. Otherwise navigate to the new event's details page.
                if (onUpdated) onUpdated();
                else if (created?.slug) navigate(`/events/${created.slug}`);
            }
        } finally {
            helpers.setSubmitting(false);
            await myEventsFeedStore.loadMyEvents();
        }
    };

    return (
        <div className="flex w-full flex-col">
            <h2 className="mb-2 text-xl font-bold">{event ? "Edit Event" : "Create Event"}</h2>
            <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form className="flex w-full flex-col">
                        <FormTextInput name="name" label="Name" placeholder="Event name" suggAutocomplete={false} required />
                        <FormTextArea name="description" label="Description" suggAutocomplete={false} placeholder="What is this event about?" required />
                        <FormAutocompleteInput name="cityId" label="City" suggAutocomplete={false} options={cityOptions} fetchOptions={fetchCityOptions} minSearchChars={3} required />
                        <FormCheckboxInput name="isOnline" label="This is an online event" />
                        <FormImageInput name="image" label="Image" />
                        <div className="mt-4 flex justify-between">
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={onClose}
                                className="rounded-full bg-gray-100 px-5 py-2 font-bold text-gray-900 disabled:opacity-40"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-full bg-[#55a8c2] px-5 py-2 font-bold text-white disabled:opacity-40"
                            >
                                {isSubmitting ? <ButtonLoader /> : (event ? "Save" : "Create")}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
});

export default UpsertEventForm;
