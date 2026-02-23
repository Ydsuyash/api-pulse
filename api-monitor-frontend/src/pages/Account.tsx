import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Phone, Camera, Lock, Save, Loader } from 'lucide-react';
import { updateProfile, changePassword, uploadAvatar } from '../services/api';
import toast from 'react-hot-toast';

const Account = () => {
    const { user } = useAuth(); // Assuming login or a generic 'updateUser' can refresh the context
    const [isLoading, setIsLoading] = useState(false);

    // Profile State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        avatar: user?.avatar || '',
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let avatarUrl = profileData.avatar;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('avatar', selectedFile);
                const { data } = await uploadAvatar(formData);
                avatarUrl = data.avatar;
            }

            await updateProfile({
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone,
                avatar: avatarUrl,
            });

            // Update local state to show new avatar immediately
            setProfileData(prev => ({ ...prev, avatar: avatarUrl }));
            toast.success('Profile updated successfully');
            // Refresh page to update context (for TopBar) - temporary solution
            window.location.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        setIsLoading(true);
        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success('Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-100">Account Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Section */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
                    <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-400" />
                        Profile Information
                    </h2>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden">
                                    {profileData.avatar ? (
                                        <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-gray-400">
                                            {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-indigo-500"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-indigo-500"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-indigo-500"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Profile Picture</label>
                            <div className="relative">
                                <Camera className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    onChange={handleFileChange}
                                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Allowed formats: PNG, JPG, JPEG. Max size: 5MB.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            <span>Save Changes</span>
                        </button>
                    </form>
                </div>

                {/* Security Section */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 h-fit">
                    <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-400" />
                        Security
                    </h2>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-indigo-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-indigo-500"
                                    placeholder="••••••••"
                                    minLength={6}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Confirm New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-indigo-500"
                                    placeholder="••••••••"
                                    minLength={6}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 border border-gray-700"
                        >
                            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                            <span>Update Password</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Account;
