import { redirect } from "next/navigation";

export default function AddListingRedirect() {
  // Redirect to the default add listing page (Residential)
  redirect("/admin/add-listing/residential");
}
