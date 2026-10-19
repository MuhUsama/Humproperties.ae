import UnderConstructionView from "@/components/common/UnderConstructionView";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Under Construction | Mohd. Alfalasi Real Estate UAE",
  description: "Website currently under construction and system upgrade.",
};

export default async function UnderConstructionPage() {
  let content = null;
  try {
    const [titleSetting, messageSetting, phoneSetting, emailSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: "under_construction_title" } }),
      prisma.setting.findUnique({ where: { key: "under_construction_message" } }),
      prisma.setting.findUnique({ where: { key: "contact_phone" } }),
      prisma.setting.findUnique({ where: { key: "contact_email" } }),
    ]);

    content = {
      title: titleSetting?.value,
      message: messageSetting?.value,
      phone: phoneSetting?.value,
      email: emailSetting?.value,
    };
  } catch (err) {
    console.error("Failed to load under construction settings:", err);
  }

  return <UnderConstructionView content={content} />;
}
