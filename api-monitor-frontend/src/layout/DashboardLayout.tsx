import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import LoginModal from '../components/LoginModal';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-gray-950">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
            <LoginModal />
        </div>
    );
};

export default DashboardLayout;
