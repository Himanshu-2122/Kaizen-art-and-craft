export default function DashboardCards({ stats }: any) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card title="Products" value={stats.products} />
      <Card title="Orders"   value={stats.orders} />
      <Card title="Users"    value={stats.users} />
      <Card title="Revenue"  value={`₹${(stats.revenue || 0).toLocaleString("en-IN")}`} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white border border-[#E8E8E8] p-6 hover:border-[#FF6E31] transition-colors">
      <p className="text-sm text-[#666666] font-semibold">{title}</p>
      <p className="text-2xl font-black text-[#212121] mt-2">{value}</p>
    </div>
  );
}
