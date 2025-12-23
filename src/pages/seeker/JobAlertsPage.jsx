import { useState, useEffect } from 'react';
import {
    Bell, Plus, Trash2, MapPin, Briefcase,
    Tag, Search, ShieldCheck, X,
    BellOff, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import jobAlertService from '../../services/jobAlertService';
import Button from '../../components/Button';
import Input from '../../components/Input';

const JobAlertsPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAlert, setNewAlert] = useState({
        keywords: '',
        category: '',
        jobType: '',
        preferredLocation: ''
    });

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const data = await jobAlertService.getMyAlerts();
            setAlerts(data);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAlert = async (e) => {
        e.preventDefault();
        try {
            await jobAlertService.createAlert(newAlert);
            fetchAlerts();
            setShowCreateModal(false);
            setNewAlert({ keywords: '', category: '', jobType: '', preferredLocation: '' });
        } catch (error) {
            console.error('Error creating alert:', error);
        }
    };

    const handleDeleteAlert = async (id) => {
        try {
            await jobAlertService.deleteAlert(id);
            setAlerts(alerts.filter(a => a.id !== id));
        } catch (error) {
            console.error('Error deleting alert:', error);
        }
    };

    const handleToggleAlert = async (id) => {
        try {
            await jobAlertService.toggleAlert(id);
            setAlerts(alerts.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
        } catch (error) {
            console.error('Error toggling alert:', error);
        }
    };

    return (
        <div className="pb-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                                <Bell className="text-secondary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Stay Notified</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-serif font-black text-primary dark:text-white mb-4 leading-tight">
                            Personalized <span className="italic text-secondary underline decoration-secondary/30 underline-offset-[8px]">Job Alerts</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-heading">We'll notify you as soon as jobs matching your preferences are posted.</p>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="rounded-2xl shadow-xl shadow-secondary/20 h-14 px-8"
                    >
                        <Plus className="mr-2" size={20} /> Create New Alert
                    </Button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-[2.5rem] bg-white/50 dark:bg-gray-800 animate-pulse border border-gray-100 dark:border-gray-700" />
                        ))}
                    </div>
                ) : alerts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {alerts.map((alert) => (
                            <div key={alert.id} className={`group bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border ${alert.isActive ? 'border-gray-100 dark:border-gray-700' : 'border-dashed border-gray-200 dark:border-gray-800 opacity-60'} shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-500 relative flex flex-col`}>
                                <div className="flex items-center justify-between mb-8">
                                    <div className={`p-3 rounded-2xl ${alert.isActive ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                                        {alert.isActive ? <Bell size={20} /> : <BellOff size={20} />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleAlert(alert.id)}
                                            className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest transition-all ${alert.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
                                        >
                                            {alert.isActive ? 'Active' : 'Paused'}
                                        </button>
                                        <button onClick={() => handleDeleteAlert(alert.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <h3 className="text-xl font-black text-primary dark:text-white uppercase tracking-tight truncate">
                                        {alert.keywords || 'Any Role'}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {alert.category && (
                                            <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-[10px] font-bold text-gray-500 flex items-center gap-1.5">
                                                <Tag size={12} /> {alert.category}
                                            </span>
                                        )}
                                        {alert.jobType && (
                                            <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-[10px] font-bold text-gray-500 flex items-center gap-1.5">
                                                <Briefcase size={12} /> {alert.jobType.replace('_', ' ')}
                                            </span>
                                        )}
                                        {alert.preferredLocation && (
                                            <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-[10px] font-bold text-gray-500 flex items-center gap-1.5">
                                                <MapPin size={12} /> {alert.preferredLocation}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-700/50 flex items-center justify-between group-hover:border-secondary/20 transition-colors">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matching Jobs</span>
                                    <div className="flex items-center gap-1 text-secondary">
                                        <Sparkles size={14} className="animate-pulse" />
                                        <span className="text-xs font-bold">Premium Match</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center bg-white/50 dark:bg-gray-800/50 rounded-[4rem] border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300 animate-bounce">
                            <Bell size={40} />
                        </div>
                        <h2 className="text-3xl font-serif font-black text-primary dark:text-white mb-4">No alerts set up</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-heading mb-10 max-w-sm mx-auto">
                            Don't miss out on your dream job. Create an alert and we'll keep an eye out for you.
                        </p>
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            size="lg"
                            className="rounded-2xl"
                        >
                            Create Your First Alert
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Alert Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-primary/20 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-[3rem] w-full max-w-lg shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
                        <div className="p-10">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-serif font-black text-primary dark:text-white">New <span className="text-secondary italic">Job Alert</span></h2>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateAlert} className="space-y-6">
                                <Input
                                    label="Keywords (Comma separated)"
                                    placeholder="e.g. Frontend, React, Senior"
                                    value={newAlert.keywords}
                                    onChange={(e) => setNewAlert({ ...newAlert, keywords: e.target.value })}
                                    required
                                    icon={Search}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Category</label>
                                        <select
                                            value={newAlert.category}
                                            onChange={(e) => setNewAlert({ ...newAlert, category: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-secondary outline-none font-bold text-sm text-primary dark:text-white"
                                        >
                                            <option value="">Any Category</option>
                                            <option value="TECHNOLOGY">Technology</option>
                                            <option value="MARKETING">Marketing</option>
                                            <option value="DESIGN">Design</option>
                                            <option value="HEALTHCARE">Healthcare</option>
                                            <option value="FINANCE">Finance</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Job Type</label>
                                        <select
                                            value={newAlert.jobType}
                                            onChange={(e) => setNewAlert({ ...newAlert, jobType: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-secondary outline-none font-bold text-sm text-primary dark:text-white"
                                        >
                                            <option value="">Any Type</option>
                                            <option value="FULL_TIME">Full Time</option>
                                            <option value="PART_TIME">Part Time</option>
                                            <option value="CONTRACT">Contract</option>
                                        </select>
                                    </div>
                                </div>

                                <Input
                                    label="Preferred Location"
                                    placeholder="e.g. Addis Ababa or Remote"
                                    value={newAlert.preferredLocation}
                                    onChange={(e) => setNewAlert({ ...newAlert, preferredLocation: e.target.value })}
                                    icon={MapPin}
                                />

                                <div className="pt-6 flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        fullWidth
                                        className="rounded-2xl h-14"
                                        onClick={() => setShowCreateModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        className="rounded-2xl h-14 shadow-lg shadow-secondary/20"
                                    >
                                        Start Alerting
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobAlertsPage;
