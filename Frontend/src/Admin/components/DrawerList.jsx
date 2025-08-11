import * as React from "react";
import DrawerList from "../../admin seller/components/drawerList/DrawerList";

import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HomeIcon from '@mui/icons-material/Home';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';

const menu = [
    {
        name: "Dashboard",
        path: "/admin",
        icon: <DashboardIcon className="text-primary-color" />,
        activeIcon: <DashboardIcon className="text-white" />,
    },
    {
        name: "Clinic",
        path: "/admin/clinic",
        icon: <HomeIcon className="text-primary-color" />,
        activeIcon: <HomeIcon className="text-white" />,
    },
    {
        name: "User",
        path: "/admin/user",
        icon: <AccountBoxIcon className="text-primary-color" />,
        activeIcon: <AccountBoxIcon className="text-white" />,
    },
    {
        name: "Booking",
        path: "/admin/booking",
        icon: <LocalOfferIcon className="text-primary-color" />,
        activeIcon: <LocalOfferIcon className="text-white" />,
    },
    {
        name: "Report",
        path: "/admin/report",
        icon: <IntegrationInstructionsIcon className="text-primary-color" />,
        activeIcon: <IntegrationInstructionsIcon className="text-white" />,
    },
    {
        name: "Account",
        path: "/admin/account",
        icon: <ElectricBoltIcon className="text-primary-color" />,
        activeIcon: <ElectricBoltIcon className="text-white" />,
    },
];

const menu2 = [
    {
        name: "Logout",
        path: "/",
        icon: <LogoutIcon className="text-primary-color" />,
        activeIcon: <LogoutIcon className="text-white" />,
    },
];

const AdminDrawerList = ({ toggleDrawer }) => {
    return (
        <DrawerList toggleDrawer={toggleDrawer} menu={menu} menu2={menu2} />
    );
};

export default AdminDrawerList;
