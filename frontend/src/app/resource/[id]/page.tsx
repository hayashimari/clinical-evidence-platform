import { ResourceDetailPreview } from "@/components/resource/resource-detail-preview";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ResourceDetailPreview resourceId={id} />;
}
