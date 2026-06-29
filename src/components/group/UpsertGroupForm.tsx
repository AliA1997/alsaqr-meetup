import { useCallback, useEffect } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { GroupRecord, UpsertGroupRequest } from "@models/group";
import { FormTextInput, FormTextArea, FormAutocompleteInput, FormImageInput, SelectOption } from "@common/FormInputs";
import { ButtonLoader } from "@common/CustomLoader";
import TopicAutocomplete from "./TopicAutocomplete";
import agent from "@utils/common";

interface UpsertGroupFormProps {
    group?: GroupRecord;
    onClose: () => void;
    onUpdated?: () => void;
}


type UpsertGroupFormValues = {
    name: string;
    description: string;
    cityId?: string;
    topics: string[];
    topicPicker: string;
    image: string;
};


const validate = (values: UpsertGroupFormValues) => {
    const errors: Partial<Record<keyof UpsertGroupFormValues, string>> = {};
    if (!values.name?.trim()) errors.name = "Name is required";
    if (!values.description?.trim()) errors.description = "Description is required";
    if (!values.cityId) errors.cityId = "City is required";
    return errors;
};

const UpsertGroupForm = observer(({ group, onClose, onUpdated }: UpsertGroupFormProps) => {
    const { groupsFeedStore, myGroupsFeedStore, myEventsFeedStore, commonStore } = useStore();
    const { createGroup, updateGroup } = groupsFeedStore;
    const { cities, loadCities, searchCities, setCities } = commonStore;

    useEffect(() => {
        loadCities();
    }, [loadCities]);
    useEffect(() => {
        if(group?.cityId)
            loadCityById();
    }, [group?.id !== undefined])
    

    const loadCityById = useCallback(() => {
        agent.citiesApiClient.getCityById(group?.cityId!)
            .then(result => setCities(result.id, result));
    }, [group])

    const cityOptions: SelectOption[] = cities.map((c) => ({
        value: c.id,
        label: `${c.name}, ${c.country}`,
    }));

    const fetchCityOptions = useCallback(
        async (query: string): Promise<SelectOption[]> => {
            const results = await searchCities(query);
            return results.map((c) => ({ value: c.id, label: `${c.name}, ${c.country}` }));
        },
        [searchCities]
    );

    const initialValues: UpsertGroupFormValues = {
        name: group?.name ?? "",
        description: group?.description ?? "",
        // The autocomplete matches options by id, so seed it with the group's cityId.
        cityId: group?.cityId != null ? String(group.cityId) : "",
        topics: (group?.topics ?? []).map((t: any) => (typeof t === "string" ? t : t?.name)).filter(Boolean),
        topicPicker: "",
        image: typeof group?.images?.[0] === "string" ? group.images[0] : "",
    };

    const handleSubmit = async (
        values: UpsertGroupFormValues,
        helpers: FormikHelpers<UpsertGroupFormValues>
    ) => {
        const selectedCity = cities.find((c) => String(c.id) === values.cityId);

        const payload: UpsertGroupRequest = {
            name: values.name,
            description: values.description,
            hqCity: selectedCity ? selectedCity.name : '',
            topics: values.topics,
            images: values.image ? [values.image] : [],
        };
        try {
            if (group) {
                await updateGroup(group.id, { ...payload, id: group.id });
                onUpdated?.();
                onClose();
            } else {
                await createGroup(payload);
                onClose();
            }
        } finally {
            helpers.setSubmitting(false);
            await myEventsFeedStore.loadMyEvents();
            await myGroupsFeedStore.loadMyGroups();
        }
    };

    return (
        <div className="flex w-full flex-col">
            <h2 className="mb-2 text-xl font-bold">{group ? "Edit Group" : "Create Group"}</h2>
            <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form className="flex w-full flex-col">
                        <FormTextInput name="name" label="Name" placeholder="Group name" suggAutocomplete={false} required />
                        <FormTextArea name="description" label="Description" placeholder="What is this group about?" suggAutocomplete={false} required />
                        <FormAutocompleteInput name="cityId" label="City" options={cityOptions} fetchOptions={fetchCityOptions} suggAutocomplete={false} minSearchChars={3} required />
                        <TopicAutocomplete name="topics" pickerName="topicPicker" label="Topics" />
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
                                {isSubmitting ? <ButtonLoader /> : (group ? "Save" : "Create")}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
});

export default UpsertGroupForm;
