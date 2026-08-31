import type { Sex, StudentIdCardInput } from "@/lib/card-fields";

type RequestFieldsFormProps = {
  fields: StudentIdCardInput;
  onChange: (fields: StudentIdCardInput) => void;
  disabled?: boolean;
  allowPhoto?: boolean;
  allowCampus?: boolean;
  campuses?: string[];
  programmes?: string[];
};

const fieldClass =
  "w-full rounded-md border border-input-border bg-surface px-3 py-2 text-[15px] text-foreground outline-none focus:border-accent disabled:bg-background disabled:text-muted";

const labelClass = "mb-1 block text-[13px] font-medium text-foreground";

export function RequestFieldsForm({
  fields,
  onChange,
  disabled,
  allowPhoto = true,
  allowCampus = true,
  campuses = [],
  programmes = [],
}: RequestFieldsFormProps) {
  function set<K extends keyof StudentIdCardInput>(
    key: K,
    value: StudentIdCardInput[K],
  ) {
    onChange({ ...fields, [key]: value });
  }

  const programmeOptions = unique([...programmes, fields.programme]);
  const campusOptions = unique([...campuses, fields.campus]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="sm:col-span-2">
        <span className={labelClass}>Full name</span>
        <input
          className={fieldClass}
          value={fields.fullName}
          disabled={disabled}
          autoComplete="name"
          onChange={(event) => set("fullName", event.target.value)}
        />
      </label>
      <label>
        <span className={labelClass}>Sex</span>
        <select
          className={fieldClass}
          value={fields.sex}
          disabled={disabled}
          onChange={(event) => set("sex", event.target.value as Sex)}
        >
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
      </label>
      <label>
        <span className={labelClass}>Date of birth</span>
        <input
          className={fieldClass}
          type="date"
          value={fields.dateOfBirth}
          disabled={disabled}
          onChange={(event) => set("dateOfBirth", event.target.value)}
        />
      </label>
      <label>
        <span className={labelClass}>Place of birth</span>
        <input
          className={fieldClass}
          value={fields.placeOfBirth}
          disabled={disabled}
          onChange={(event) => set("placeOfBirth", event.target.value)}
        />
      </label>
      <label>
        <span className={labelClass}>Matricule</span>
        <input
          className={fieldClass}
          value={fields.matricule}
          disabled={disabled}
          onChange={(event) => set("matricule", event.target.value)}
        />
      </label>
      <label>
        <span className={labelClass}>Programme</span>
        <select
          className={fieldClass}
          value={fields.programme}
          disabled={disabled}
          onChange={(event) => set("programme", event.target.value)}
        >
          <option value="">Select Programme</option>
          {programmeOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className={labelClass}>Campus</span>
        <select
          className={fieldClass}
          value={fields.campus}
          disabled={disabled || !allowCampus}
          onChange={(event) => set("campus", event.target.value)}
        >
          <option value="">Select Campus</option>
          {campusOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      {allowPhoto ? (
        <label className="sm:col-span-2">
          <span className={labelClass}>Photo</span>
          <input
            className="block w-full text-[14px] file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-[13px] file:font-semibold file:text-white"
            type="file"
            accept="image/*"
            disabled={disabled}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => set("photoSrc", String(reader.result ?? ""));
              reader.readAsDataURL(file);
            }}
          />
          <span className="mt-1 block text-[13px] text-muted">
            One person, face clear, no sunglasses, no hat, looking at the camera.
          </span>
        </label>
      ) : null}
    </div>
  );
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}
