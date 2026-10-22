"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Lets the admin link an off plan listing to one of the developers managed under /admin/developers
export default function DeveloperSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (developerId: string) => void;
}) {
  const [developers, setDevelopers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/developers?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDevelopers(data.data);
      })
      .catch((err) => console.error("Failed to fetch developers", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-2 md:col-span-2">
      <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
        Developer
      </label>
      <select
        name="developerId"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all font-medium cursor-pointer"
      >
        <option value="">{loading ? "Loading developers..." : "No developer"}</option>
        {developers.map((dev) => (
          <option key={dev.id} value={dev.id}>{dev.name}</option>
        ))}
      </select>
      <p className="text-xs text-gray-500">
        The listing appears under this developer on the Off Plan page.{" "}
        <Link href="/admin/developers" className="text-brand-gold font-semibold hover:underline">
          Manage developers
        </Link>
      </p>
    </div>
  );
}
