export default function AuthInput({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    required = true
}) {
    return (
        <div className="mb-4">

            <label className="block mb-1 font-medium">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-gray-500"
            />

        </div>
    );
}