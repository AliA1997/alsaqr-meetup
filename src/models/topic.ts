// Canonical topic loaded from `GET /api/Topics`. Used as the option source for the
// group form's topic autocomplete (mapped to `SelectOption` { value, label }).
export interface Topic {
    id: number;
    name: string;
}
