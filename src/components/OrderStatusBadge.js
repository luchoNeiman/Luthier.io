const STATUS_STYLES = {
  Active: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  Closed: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  Shipped: "border-sky-500/30 bg-sky-500/15 text-sky-300",
  Canceled: "border-rose-500/30 bg-rose-500/15 text-rose-300",
};

export default function OrderStatusBadge({ status }) {
  const normalizedStatus = STATUS_STYLES[status] ? status : "Active";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${STATUS_STYLES[normalizedStatus]}`}
    >
      {normalizedStatus}
    </span>
  );
}
