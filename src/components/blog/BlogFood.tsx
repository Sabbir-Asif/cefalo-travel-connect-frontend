import type { Food } from "../../types/Food";

export function BlogFood({ food }: { food: Food[] }) {
  if (food.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">🍽️ Food Experience</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {food.map((f) => (
          <div key={f.id} className="border p-4 rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg">{f.name}</h3>
            <p>Category: {f.category}</p>
            <p>Provider: {f.provider}</p>
            <p>📍 {f.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
