import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useStore } from "@stores/index";
import { HostedCity, UpsertLocalGuideRequest } from "@models/localGuide";
import { FormTextInput, FormTextArea, FormSelectInput, SelectOption } from "@common/FormInputs";
import { ButtonLoader } from "@common/CustomLoader";

interface LocalGuideWizardProps {
    onClose: () => void;
}

type WizardValues = {
    name: string;
    bio: string;
    email: string;
    phone: string;
    countryOfOrigin: string;
    cityId: string;
};

// Each step lists the fields validated before the user may advance.
const steps: { title: string; fields: (keyof WizardValues)[] }[] = [
    { title: "About you", fields: ["name", "bio"] },
    { title: "Contact", fields: ["email", "phone", "countryOfOrigin"] },
    { title: "Where do you guide?", fields: ["cityId"] },
];

const validate = (values: WizardValues) => {
    const errors: Partial<Record<keyof WizardValues, string>> = {};
    if (!values.name?.trim()) errors.name = "Name is required";
    if (!values.cityId) errors.cityId = "City is required";
    return errors;
};

const LocalGuideWizard = observer(({ onClose }: LocalGuideWizardProps) => {
    const { authStore, localGuidesFeedStore, commonStore } = useStore();
    const { currentSessionUser } = authStore;
    const { myLocalGuide, upsertLocalGuide } = localGuidesFeedStore;
    const { cities, loadCities } = commonStore;
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        loadCities();
    }, [loadCities]);

    const cityOptions: SelectOption[] = cities.map((c) => ({
        value: c.id,
        label: `${c.name}, ${c.country}`,
    }));

    // Pre-populate from the logged-in user's profile; every value stays editable.
    const fullName = [currentSessionUser?.firstName, currentSessionUser?.lastName]
        .filter(Boolean)
        .join(" ");
    // Match the guide's existing hosted city to a known city option when editing.
    const existingCity = myLocalGuide?.hostedCities?.[0];
    const existingCityId = existingCity
        ? cities.find((c) => c.name === existingCity.city && c.country === existingCity.country)?.id
        : undefined;
    const initialValues: WizardValues = {
        name: myLocalGuide?.name ?? fullName ?? currentSessionUser?.username ?? "",
        bio: currentSessionUser?.bio ?? "",
        email: currentSessionUser?.email ?? "",
        phone: currentSessionUser?.phone ?? "",
        countryOfOrigin: currentSessionUser?.countryOfOrigin ?? "",
        cityId: existingCityId ? String(existingCityId) : "",
    };

    const isLastStep = stepIndex === steps.length - 1;

    const handleSubmit = async (values: WizardValues, helpers: FormikHelpers<WizardValues>) => {
        // Submit only fires from the final step's button.
        if (!isLastStep) {
            helpers.setSubmitting(false);
            return;
        }
        const selectedCity = cities.find((c) => String(c.id) === values.cityId);
        const hostedCities: HostedCity[] = selectedCity
            ? [{
                city: selectedCity.name,
                stateOrProvince: selectedCity.stateOrProvince ?? "",
                country: selectedCity.country,
                latitude: selectedCity.latitude,
                longitude: selectedCity.longitude,
            }]
            : [];
        const payload: UpsertLocalGuideRequest = {
            id: myLocalGuide?.id,
            name: values.name,
            bio: values.bio,
            email: values.email,
            phone: values.phone,
            countryOfOrigin: values.countryOfOrigin,
            hostedCities,
        };
        try {
            await upsertLocalGuide(payload);
            onClose();
        } finally {
            helpers.setSubmitting(false);
        }
    };

    return (
        <div className="flex w-full flex-col">
            <h2 className="text-xl font-bold">
                {myLocalGuide ? "Edit your local guide" : "Register as Local Guide"}
            </h2>
            <p className="mb-2 text-sm text-gray-500">
                Step {stepIndex + 1} of {steps.length} — {steps[stepIndex].title}
            </p>
            <Formik initialValues={initialValues} enableReinitialize validate={validate} onSubmit={handleSubmit}>
                {({ isSubmitting, validateForm, setTouched, values }) => {
                    const goNext = async () => {
                        const errors = await validateForm();
                        const stepFields = steps[stepIndex].fields;
                        const stepHasError = stepFields.some((f) => (errors as Record<string, string>)[f]);
                        if (stepHasError) {
                            setTouched(
                                stepFields.reduce((acc, f) => ({ ...acc, [f]: true }), {}),
                                false
                            );
                            return;
                        }
                        setStepIndex((i) => Math.min(i + 1, steps.length - 1));
                    };
                    return (
                        <Form className="flex w-full flex-col">
                            {stepIndex === 0 && (
                                <>
                                    <FormTextInput name="name" label="Display name" required />
                                    <FormTextArea name="bio" label="Short bio" placeholder="Tell visitors about yourself" />
                                </>
                            )}
                            {stepIndex === 1 && (
                                <>
                                    <FormTextInput name="email" label="Contact email" />
                                    <FormTextInput name="phone" label="Phone" />
                                    <FormTextInput name="countryOfOrigin" label="Country of origin" />
                                </>
                            )}
                            {stepIndex === 2 && (
                                <FormSelectInput name="cityId" label="City" options={cityOptions} required />
                            )}

                            <div className="mt-4 flex justify-between">
                                <button
                                    type="button"
                                    onClick={stepIndex === 0 ? onClose : () => setStepIndex((i) => Math.max(i - 1, 0))}
                                    className="rounded-full bg-gray-100 px-5 py-2 font-bold text-gray-900 disabled:opacity-40"
                                >
                                    {stepIndex === 0 ? "Cancel" : "Back"}
                                </button>
                                {isLastStep ? (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !values.name}
                                        className="rounded-full bg-[#55a8c2] px-5 py-2 font-bold text-white disabled:opacity-40"
                                    >
                                        {isSubmitting ? <ButtonLoader /> : (myLocalGuide ? "Save" : "Finish")}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={goNext}
                                        className="rounded-full bg-[#55a8c2] px-5 py-2 font-bold text-white disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
});

export default LocalGuideWizard;
