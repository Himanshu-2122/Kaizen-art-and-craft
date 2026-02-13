export default function DashboardCards({ stats }: any) {
  return (
    <div className="grid md:grid-cols-4 gap-6">

      <Card title="Products" value={stats.products} />
      <Card title="Orders" value={stats.orders} />
      <Card title="Users" value={stats.users} />
      <Card title="Revenue" value={`₹${stats.revenue}`} />

    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
