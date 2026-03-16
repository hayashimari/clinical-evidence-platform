import { Suspense } from "react";

import { SearchWorkspace } from "@/components/search/search-workspace";

function SearchWorkspaceFallback() {
  return (
    <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white px-6 py-10 text-sm text-slate-500 shadow-sm">
      Loading search workspace...
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchWorkspaceFallback />}>
      <SearchWorkspace />
    </Suspense>
  );
}
