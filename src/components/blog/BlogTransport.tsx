import type { Transport } from "../../types/Transport";

export function BlogTransport({ transports }: { transports: Transport[] }) {
  if (transports.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">🚍 Transport Info</h2>
      <div className="grid gap-4">
        {transports.map((t) => (
          <div key={t.id} className="border rounded-lg p-4 space-y-1 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{t.name}</span>
              <span className="badge badge-secondary">{t.type}</span>
            </div>
            <p>🛫 {t.starting_location} → 🛬 {t.destination}</p>
            <p>🕒 {t.departure_time ? new Date(t.departure_time).toLocaleString() : "N/A"} → {t.arrival_time ? new Date(t.arrival_time).toLocaleString() : "N/A"}</p>
            <p>💸 Fare: {t.fare}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
