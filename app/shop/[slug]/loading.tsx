export default function Loading() {
    return (
      <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-16 sm:px-10 lg:grid-cols-2" aria-busy="true">
        <div className="aspect-square animate-pulse rounded-[28px] bg-muted" />
        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-10 w-3/4 animate-pulse rounded-xl bg-muted" />
          <div className="h-8 w-32 animate-pulse rounded-xl bg-muted" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mt-6 h-12 w-48 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }