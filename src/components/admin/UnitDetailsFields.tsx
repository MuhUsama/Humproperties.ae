import { UNIT_DETAIL_FIELDS } from "@/lib/unitDetails";

interface UnitDetailsFieldsProps {
  defaults?: Record<string, unknown>;
}

export function UnitDetailsFields({ defaults }: UnitDetailsFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
          Unit Details
        </label>
        <p className="text-xs text-gray-400 mt-1">Optional. Fields left empty are hidden on the website.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {UNIT_DETAIL_FIELDS.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
              {field.label}
            </label>
            <input
              type="text"
              name={field.key}
              defaultValue={String(defaults?.[field.key] ?? "")}
              placeholder={field.placeholder}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-gray-400 font-medium"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
