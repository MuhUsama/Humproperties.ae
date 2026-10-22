import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
import ScrollToTop from "@/components/common/ScrollToTop";
import UnderConstructionView from "@/components/common/UnderConstructionView";
import IntroSplash from "@/components/common/IntroSplash";
import AdminPreviewBanner from "@/components/common/AdminPreviewBanner";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/adminAuth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let isUnderConstruction = false;
  let customContent = null;

  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "under_construction" },
    });
    isUnderConstruction = setting?.value === "true";

    if (isUnderConstruction) {
      const [titleSetting, messageSetting, phoneSetting, emailSetting, addressSetting] = await Promise.all([
        prisma.setting.findUnique({ where: { key: "under_construction_title" } }),
        prisma.setting.findUnique({ where: { key: "under_construction_message" } }),
        prisma.setting.findUnique({ where: { key: "contact_phone" } }),
        prisma.setting.findUnique({ where: { key: "contact_email" } }),
        prisma.setting.findUnique({ where: { key: "contact_address" } }),
      ]);
      customContent = {
        title: titleSetting?.value,
        message: messageSetting?.value,
        phone: phoneSetting?.value,
        email: emailSetting?.value,
        address: addressSetting?.value,
      };
    }
  } catch (err) {
    console.error("Error checking under_construction status:", err);
  }

  // Check if visitor is an authenticated admin
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const isAdmin = token ? verifySessionToken(token).valid : false;

  // If Under Construction is ON and visitor is NOT a logged-in admin, show Under Construction page
  if (isUnderConstruction && !isAdmin) {
    return <UnderConstructionView content={customContent} />;
  }

  return (
    <>
      <IntroSplash />
      {isUnderConstruction && isAdmin && <AdminPreviewBanner />}
      <ScrollToTop />
      <Navbar />
      {children}
      <FloatingWhatsApp />
      <Footer />
    </>
  );
}
