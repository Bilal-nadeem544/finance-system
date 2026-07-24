import { Landmark, Wallet } from "lucide-react";

export default function AccountCard({ account }) {
  const Icon = account.type === "Cash" ? Wallet : Landmark;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 min-w-[240px]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Icon size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{account.name}</p>
            <p className="text-xs text-gray-500">{account.type} · {account.bank}</p>
          </div>
        </div>
      </div>
      <p className="text-xl font-semibold text-gray-800 mt-4">
        ${account.balance.toLocaleString()}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">Current balance</p>
    </div>
  );
}