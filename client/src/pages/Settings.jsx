import { useState, useRef } from "react";
import { Save, Upload } from "lucide-react";
import { useFinance } from "../context/FinanceContext";

export default function Settings() {
  const { settings, profile, brandName, brandLogo, updateBrandName, updateBrandLogo, updateSettings, updateProfile } = useFinance();
  const [activeTab, setActiveTab] = useState("branding");

  const [companyForm, setCompanyForm] = useState(settings);
  const [profileForm, setProfileForm] = useState(profile);
  const [nameInput, setNameInput] = useState(brandName);
  const [savedMsg, setSavedMsg] = useState("");
  const fileInputRef = useRef(null);

  const tabs = [
    { id: "branding", label: "Branding" },
    { id: "company", label: "Company Info" },
    { id: "profile", label: "Profile" },
  ];

  const showSaved = () => {
    setSavedMsg("Saved!");
    setTimeout(() => setSavedMsg(""), 1500);
  };

  const handleBrandSave = (e) => {
    e.preventDefault();
    updateBrandName(nameInput);
    showSaved();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateBrandLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    updateBrandLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500">Manage branding, company, and account preferences</p>
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

      {activeTab === "branding" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5 max-w-xl">
          <div>
            <label className="block text-xs text-gray-500 mb-2">Logo</label>
            <div className="flex items-center gap-4">
              {brandLogo ? (
                <img src={brandLogo} alt="Logo" className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                  $
                </div>
              )}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Upload size={14} />
                  Upload logo
                </button>
                {brandLogo && (
                  <button type="button" onClick={handleRemoveLogo} className="text-xs text-red-500 hover:underline text-left">
                    Remove logo
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </div>
            </div>
          </div>

          <form onSubmit={handleBrandSave} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sidebar / app name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
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
        </div>
      )}

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