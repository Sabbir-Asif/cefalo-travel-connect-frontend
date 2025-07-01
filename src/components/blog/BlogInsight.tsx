import type { BlogInsight } from "../../types/BlogInsight";

export function BlogInsight({ insights }: { insights: BlogInsight[] }) {
  if (insights.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">💡 Insights</h2>
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="border-l-4 border-primary pl-4 py-2 bg-gray-50 rounded-r">
            <h3 className="font-semibold text-md">{insight.label}</h3>
            <p className="text-sm">{insight.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
