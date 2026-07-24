export default function StatCard({ icon: Icon, iconBg, iconColor, label, value, change, changeLabel, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[200px]">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-semibold text-gray-800 mt-0.5">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1 ${trend === "up" ? "text-green-600" : "text-red-500"}`}>
              {change > 0 ? "+" : ""}
              {change}% {changeLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}