import { useState } from "react";
import { Save } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

export default function Settings() {
  const { settings, profile, categories, updateSettings, updateProfile, addCategory, removeCategory } = useFinance();
  const [activeTab, setActiveTab] = useState("company");

  const [companyForm, setCompanyForm] = useState(settings);
  const [profileForm, setProfileForm] = useState(profile);
  const [newCategory, setNewCategory] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const tabs = [
    { id: "company", label: "Company Info" },
    { id: "categories", label: "Categories" },
    { id: "profile", label: "Profile" },
  ];

  const showSaved = () => {
    setSavedMsg("Saved!");
    setTimeout(() => setSavedMsg(""), 1500);
  };

  const handleCompanySave = (e) => {
    e.preventDefault();
    updateSettings(companyForm);
    showSaved();
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    showSaved();
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    addCategory(newCategory.trim());
    setNewCategory("");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500">Manage company, categories, and account preferences</p>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? "border-green-500 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "company" && (
        <form onSubmit={handleCompanySave} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 max-w-xl">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Company name</label>
            <input
              type="text"
              value={companyForm.companyName}
              onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Base currency</label>
            <select
              value={companyForm.currency}
              onChange={(e) => setCompanyForm({ ...companyForm, currency: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
            >
              <option>PKR - Pakistani Rupee</option>
              <option>USD - US Dollar</option>
              <option>AED - UAE Dirham</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Fiscal year start</label>
            <select
              value={companyForm.fiscalYearStart}
              onChange={(e) => setCompanyForm({ ...companyForm, fiscalYearStart: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
            >
              <option>January</option>
              <option>July</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="flex items-center gap-1.5 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              <Save size={16} />
              Save changes
            </button>
            {savedMsg && <span className="text-xs text-green-600">{savedMsg}</span>}
          </div>
        </form>
      )}

      {activeTab === "categories" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 max-w-xl">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Expense categories</h2>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-800">{cat}</span>
                <button onClick={() => removeCategory(cat)} className="text-xs text-gray-500 hover:text-red-500">
                  Remove
                </button>
              </div>
            ))}
            {categories.length === 0 && <p className="text-sm text-gray-400">No categories yet.</p>}
          </div>
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
            />
            <button onClick={handleAddCategory} className="bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Add
            </button>
          </div>
        </div>
      )}

      {activeTab === "profile" && (
        <form onSubmit={handleProfileSave} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 max-w-xl">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-lg">
              {profileForm.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{profileForm.name}</p>
              <p className="text-xs text-gray-500">{profileForm.role}</p>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Full name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800"
            />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="flex items-center gap-1.5 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              <Save size={16} />
              Save changes
            </button>
            {savedMsg && <span className="text-xs text-green-600">{savedMsg}</span>}
          </div>
        </form>
      )}
    </div>
  );
}