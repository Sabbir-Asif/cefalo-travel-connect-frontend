import type { Lodge } from "../../types/Lodge";

export function BlogLodge({ lodges }: { lodges: Lodge[] }) {
  if (lodges.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">🏨 Lodging</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {lodges.map((lodge) => (
          <div key={lodge.id} className="rounded-lg border p-4 bg-gray-50">
            {lodge.cover_image && (
              <img src={lodge.cover_image} alt={lodge.name} className="rounded w-full h-40 object-cover mb-2" />
            )}
            <h3 className="font-semibold text-lg">{lodge.name}</h3>
            <p>📍 {lodge.location_name}</p>
            <p>💵 Price: ${lodge.price}</p>
            {lodge.description && <p className="text-sm mt-1">{lodge.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
