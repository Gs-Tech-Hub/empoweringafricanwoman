import { redirect } from "next/navigation";
import LocationManager from "@/components/admin/location-manager";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Manage Locations",
};

export default async function AdminLocationsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const [locations, media] = await Promise.all([
    prisma.branch.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        region: true,
        mediaAssetId: true,
        latitude: true,
        longitude: true,
        mapEmbedUrl: true,
        sortOrder: true,
        published: true,
      },
    }),
    prisma.mediaAsset.findMany({
      where: { mediaType: "IMAGE" },
      select: { id: true, fileName: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="section-subtitle">Manage</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-brand-primary">
          Locations
        </h1>
        <p className="mt-2 text-brand-muted">
          Manage regional location details and their published status.
        </p>
      </div>
      <LocationManager initialLocations={locations} media={media} />
    </div>
  );
}
