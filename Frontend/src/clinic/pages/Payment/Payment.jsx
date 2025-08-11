import { Button, Card, Divider } from '@mui/material';
import React, { useState } from 'react';
import TransactionTable from './TransactionTable';
import Payouts from './PayoutsTable';
import { useSelector } from 'react-redux';
import { getPriceTotal, getLastPayment } from '../../../util/totalEarning';
import { useNavigate } from 'react-router-dom';
import SettlementForm from './SettlementForm';

const tab = [
    { name: "Transaction", path: "/clinic-dashboard/transaction" },
    // { name: "Payouts", path: "/clinic-dashboard/payouts" }
];

const Payment = () => {
    const [activeTab, setActiveTab] = useState(tab[0].name);
    const { booking } = useSelector((store) => store);
    const navigate = useNavigate();

    // ✅ Settlement form state
    const [openSettlement, setOpenSettlement] = useState(false);

    const handleActiveTab = (item) => {
        setActiveTab(item.name);
        navigate(item.path);
    };

    return (
        <div>
            {/* ✅ Earnings Card */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
                <Card className='col-span-1 p-5 rounded-md space-y-4 relative'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-gray-600 font-medium'>Total Earning</h1>
                        {/* ✅ Settlement Link */}
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setOpenSettlement(true)}
                        >
                            Settlement
                        </Button>
                    </div>
                    <h1 className='font-bold text-xl pb-1'>
                        ₹{getPriceTotal(booking.bookings)}
                    </h1>
                    <Divider />
                    <p className='text-gray-600 font-medium pt-1'>
                        Last Payment :
                        <strong> ₹{getLastPayment(booking.bookings)}</strong>
                    </p>
                </Card>
            </div>

            {/* ✅ Tabs */}
            <div className='mt-20'>
                <div className='flex gap-4'>
                    {tab.map((item) => (
                        <Button
                            key={item.name}
                            onClick={() => handleActiveTab(item)}
                            variant={activeTab === item.name ? "contained" : "outlined"}
                        >
                            {item.name}
                        </Button>
                    ))}
                </div>

                {/* ✅ Show Transaction table by default */}
                <div className='mt-5'>
                    {activeTab === "Transaction" ? <TransactionTable /> : <Payouts />}
                </div>
            </div>

            {/* ✅ Settlement Form Modal */}
            <SettlementForm 
                open={openSettlement} 
                onClose={() => setOpenSettlement(false)} 
            />
        </div>
    );
};

export default Payment;
