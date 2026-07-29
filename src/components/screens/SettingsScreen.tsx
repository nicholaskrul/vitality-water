import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ActivityLevel, UnitType } from '../../types';
import { uploadAvatarImage } from '../../data';
import { supabase } from '../../lib/supabase';

interface SettingsScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [weight, setWeight] = useState<number>(profile.weightKg || 70);
  const [activity, setActivity] = useState<ActivityLevel>(profile.activityLevel || 'Med');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editStatus, setEditStatus] = useState(profile.status);
  const [editAvatar, setEditAvatar] = useState(profile.avatarUrl);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (profile) {
      setWeight(profile.weightKg || 70);
      setActivity(profile.activityLevel || 'Med');
      setEditName(profile.name);
      setEditStatus(profile.status);
      setEditAvatar(profile.avatarUrl);
    }
  }, [profile]);

  // Handle Photo Selection from Camera Roll / File Picker
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const publicUrl = await uploadAvatarImage(user.id, file);
      if (publicUrl) {
        setEditAvatar(publicUrl);
        onUpdateProfile({ avatarUrl: publicUrl });
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 2000);
      }
    }
    setIsUploading(false);
  };

  const activityMultipliers: Record<ActivityLevel, number> = {
    Low: 1.0,
    Med: 1.2,
    High: 1.5,
  };

  const validWeight = Number(weight) || 70;
  const calculatedMl = Math.round(validWeight * 35 * activityMultipliers[activity]);

  const handleUpdateGoal = () => {
    onUpdateProfile({
      weightKg: validWeight,
      activityLevel: activity,
      dailyTargetMl: calculatedMl,
    });
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 2000);
  };

  const handleSaveProfileModal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      status: editStatus,
      avatarUrl: editAvatar,
    });
    setIsEditingProfile(false);
  };

  const handleUnitToggle = (unit: UnitType) => {
    onUpdateProfile({ preferredUnit: unit });
  };

  const handleRemindersToggle = () => {
    onUpdateProfile({ smartReminders: !profile.smartReminders });
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-6 space-y-6 pb-28 pt-2 font-['Inter']">
      {/* Hidden File Input for Phone Camera Roll / File Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Success Banner */}
      {updateSuccess && (
        <div className="p-3 bg-[#00677f] text-white text-xs font-semibold rounded-2xl text-center shadow-lg animate-fadeIn">
          Profile updated successfully!
        </div>
      )}

      {/* Profile Header Card */}
      <div className="relative overflow-hidden bg-[#e7eeff] rounded-2xl p-6 shadow-sm border border-white/60">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#00677f]/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div
            className="relative cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
            title="Change Avatar Photo"
          >
            <div className="w-16 h-16 rounded-full border-2 border-[#00677f]/20 overflow-hidden shadow-sm bg-white">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-semibold">
                  Uploading...
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#00677f] rounded-full flex items-center justify-center border-2 border-[#e7eeff] shadow-sm">
              <span className="material-symbols-outlined text-[13px] text-white">photo_camera</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-['Montserrat'] text-xl font-bold text-[#111c2d]">
                {profile.name}
              </h2>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-[11px] font-bold text-[#00677f] hover:underline cursor-pointer"
              >
                Edit Name
              </button>
            </div>
            <p className="text-xs font-semibold text-[#3c494e]">{profile.status}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 text-[11px] font-bold text-[#00677f] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">add_a_photo</span>
              Change Photo
            </button>
          </div>
        </div>
      </div>

      {/* Hydration Goal Calculator */}
      <section className="space-y-3">
        <h3 className="text-[11px] font-bold text-[#3c494e] uppercase tracking-wider ml-1">
          Personalized Goal Calculator
        </h3>
        <div className="bg-[#f0f3ff] rounded-2xl p-6 space-y-6 shadow-sm border border-white/60">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#3c494e]">Weight (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 bg-[#d8e3fb] rounded-xl px-4 text-sm font-semibold text-[#111c2d] outline-none focus:ring-2 focus:ring-[#00677f]/20 transition-all border border-white/50"
                  placeholder="70"
                />
                <span className="absolute right-4 top-3.5 text-sm text-[#3c494e] font-semibold">
                  kg
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#3c494e]">
                Daily Activity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Med', 'High'] as ActivityLevel[]).map((level) => {
                  const isActive = activity === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setActivity(level)}
                      className={`h-12 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 border-transparent ${
                        isActive
                          ? 'bg-[#00677f] text-white shadow-sm'
                          : 'bg-[#d8e3fb] text-[#3c494e] hover:bg-[#dee8ff]'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-[#00d2ff]/20 rounded-2xl p-4 flex items-center justify-between border border-white/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00677f]/10 rounded-full flex items-center justify-center text-[#00677f]">
                <span className="material-symbols-outlined text-xl">water_drop</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#00566a] uppercase">Daily Target</p>
                <p className="font-['Montserrat'] text-xl font-bold text-[#00677f]">
                  {profile.preferredUnit === 'oz'
                    ? `${Math.round(calculatedMl * 0.033814)} oz`
                    : `${calculatedMl.toLocaleString()} ml`}
                </p>
              </div>
            </div>
            <button
              onClick={handleUpdateGoal}
              className="bg-[#00677f] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md hover:bg-[#00566a] active:scale-95 transition-all cursor-pointer"
            >
              Update
            </button>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="space-y-3">
        <h3 className="text-[11px] font-bold text-[#3c494e] uppercase tracking-wider ml-1">
          Preferences
        </h3>
        <div className="bg-[#f0f3ff] rounded-2xl overflow-hidden shadow-sm border border-white/60">
          <div className="p-4 flex items-center justify-between border-b border-[#bbc9cf]/20">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#3c494e]">straighten</span>
              <span className="text-sm font-semibold text-[#111c2d]">Preferred Units</span>
            </div>
            <div className="flex bg-[#d8e3fb] p-1 rounded-xl">
              <button
                onClick={() => handleUnitToggle('ml')}
                className={`px-4 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  profile.preferredUnit === 'ml'
                    ? 'bg-white text-[#00677f] shadow-sm'
                    : 'text-[#3c494e]'
                }`}
              >
                ml
              </button>
              <button
                onClick={() => handleUnitToggle('oz')}
                className={`px-4 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  profile.preferredUnit === 'oz'
                    ? 'bg-white text-[#00677f] shadow-sm'
                    : 'text-[#3c494e]'
                }`}
              >
                oz
              </button>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#3c494e]">
                notifications_active
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#111c2d]">Smart Reminders</span>
                <span className="text-[10px] text-[#3c494e]">Reminds you based on local weather</span>
              </div>
            </div>
            <button
              onClick={handleRemindersToggle}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 cursor-pointer ${
                profile.smartReminders ? 'bg-[#00677f]' : 'bg-[#d8e3fb]'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${
                  profile.smartReminders ? 'right-1' : 'left-1'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </section>

      <div className="pt-2 flex flex-col items-center gap-2">
        <div className="w-12 h-1 bg-[#d8e3fb] rounded-full"></div>
        <p className="text-xs text-[#bbc9cf] italic">Vitality Water v2.4.0</p>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleSaveProfileModal}
            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-[#e7eeff] space-y-4"
          >
            <h3 className="font-['Montserrat'] text-lg font-bold text-[#111c2d]">Edit Profile</h3>

            <div className="flex flex-col items-center gap-2 py-2">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#00677f] bg-slate-100">
                <img src={editAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-semibold">
                    Uploading...
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#e7eeff] text-[#00677f] hover:bg-[#d8e3fb] rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">photo_camera</span>
                Choose from Camera Roll
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#3c494e] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 bg-[#f0f3ff] rounded-xl px-3 text-sm text-[#111c2d] outline-none border border-[#e7eeff]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#3c494e] block mb-1">
                  Membership Status
                </label>
                <input
                  type="text"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full h-10 bg-[#f0f3ff] rounded-xl px-3 text-sm text-[#111c2d] outline-none border border-[#e7eeff]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 py-2.5 bg-[#f0f3ff] text-[#3c494e] rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#dee8ff]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#00677f] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#00566a] shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
