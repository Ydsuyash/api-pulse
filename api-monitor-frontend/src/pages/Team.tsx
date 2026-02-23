import { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Shield, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMyTeams, createTeam, inviteMember, getTeamMembers } from '../services/api';

const Team = () => {
    const [teams, setTeams] = useState<any[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');

    const fetchTeams = async () => {
        try {
            const { data } = await getMyTeams();
            setTeams(data);
            if (data.length > 0 && !selectedTeam) {
                setSelectedTeam(data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch teams', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async (teamId: string) => {
        try {
            const { data } = await getTeamMembers(teamId);
            setMembers(data);
        } catch (error) {
            console.error('Failed to fetch members', error);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            fetchMembers(selectedTeam.id);
        }
    }, [selectedTeam]);

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await createTeam({ name: newTeamName });
            toast.success('Team created');
            setTeams([...teams, { ...data, role: 'ADMIN' }]);
            setSelectedTeam({ ...data, role: 'ADMIN' });
            setShowCreateModal(false);
            setNewTeamName('');
        } catch (error) {
            toast.error('Failed to create team');
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeam) return;
        try {
            await inviteMember(selectedTeam.id, inviteEmail);
            toast.success('Member invited');
            fetchMembers(selectedTeam.id);
            setShowInviteModal(false);
            setInviteEmail('');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to invite user');
        }
    };

    if (loading) return <div className="text-center text-gray-500 py-10">Loading teams...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Team Management</h1>
                    <p className="text-gray-400">Manage your teams and collaborate with others.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <UserPlus className="w-5 h-5" />
                    <span>Create Team</span>
                </button>
            </div>

            {teams.length === 0 ? (
                <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-200">No teams yet</h3>
                    <p className="text-gray-500 mt-2">Create a team to start collaborating.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Team Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Teams</h3>
                        {teams.map((team) => (
                            <button
                                key={team.id}
                                onClick={() => setSelectedTeam(team)}
                                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center justify-between ${selectedTeam?.id === team.id
                                        ? 'bg-indigo-600/10 border-indigo-600/50 text-indigo-400'
                                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'
                                    }`}
                            >
                                <span className="font-medium truncate">{team.name}</span>
                                <span className="text-xs bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                                    {team.role}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Team Details */}
                    <div className="lg:col-span-3 space-y-6">
                        {selectedTeam && (
                            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-500" />
                                        {selectedTeam.name} Members
                                    </h2>
                                    {selectedTeam.role === 'ADMIN' && (
                                        <button
                                            onClick={() => setShowInviteModal(true)}
                                            className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors flex items-center gap-2"
                                        >
                                            <Mail className="w-4 h-4" />
                                            Invite Member
                                        </button>
                                    )}
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-800">
                                                <th className="pb-3 text-xs font-medium text-gray-500 uppercase">User</th>
                                                <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                                                <th className="pb-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {members.map((member) => (
                                                <tr key={member.id} className="group">
                                                    <td className="py-4 text-gray-200 font-medium">
                                                        {member.user.name || 'Unknown'}
                                                    </td>
                                                    <td className="py-4 text-gray-400">{member.user.email}</td>
                                                    <td className="py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.role === 'ADMIN'
                                                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                            }`}>
                                                            {member.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                                                            {member.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        {selectedTeam.role === 'ADMIN' && member.userId !== selectedTeam.ownerId && (
                                                            <button className="text-gray-500 hover:text-red-400 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Team Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold text-gray-100 mb-4">Create New Team</h3>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Team Name"
                                required
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-400 hover:text-gray-200">Cancel</button>
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold text-gray-100 mb-4">Invite Member</h3>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <input
                                type="email"
                                placeholder="User Email"
                                required
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-100 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-gray-400 hover:text-gray-200">Cancel</button>
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">Invite</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Team;
