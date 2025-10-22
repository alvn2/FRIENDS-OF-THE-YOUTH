import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { ACHIEVEMENTS_DATA } from '../constants';
import api from '../services/api';

// --- SVG Icons ---
const MpesaLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 250 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="250" height="100" rx="10" fill="#A4C639" />
      <text x="125" y="65" fontFamily="Arial, sans-serif" fontSize="50" fontWeight="bold" fill="white" textAnchor="middle">M-PESA</text>
    </svg>
);

const PendingIcon: React.FC = () => (
    <div className="animate-pulse">
        <svg className="w-16 h-16 mx-auto text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h3m12 0h-3" />
        </svg>
    </div>
);

const SuccessIcon: React.FC = () => (
    <svg className="w-16 h-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ErrorIcon: React.FC = () => (
    <svg className="w-16 h-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const DonationPage: React.FC = () => {
  const { user, addAchievement } = useAuth();
  const { addNotification } = useNotification();
  const [amount, setAmount] = useState(2500);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [donationStatus, setDonationStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  
  useEffect(() => {
    if (user && user.phone) {
        setPhone(user.phone);
    }
  }, [user]);

  const handleAmountClick = (value: number) => {
    setAmount(value);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setAmount(isNaN(value) ? 0 : value);
  };
  
  const awardAchievements = async () => {
    if (user) {
        const firstDonationAchievement = ACHIEVEMENTS_DATA.find(a => a.id === 'first_donation');
        if (firstDonationAchievement) {
            await addAchievement(firstDonationAchievement);
            addNotification(`Achievement Unlocked: ${firstDonationAchievement.name}!`, 'success', { persistent: true, persistentType: 'achievement', link: '/settings' });
        }

        if (amount >= 10000) {
            const generousGiverAchievement = ACHIEVEMENTS_DATA.find(a => a.id === 'generous_giver');
            if (generousGiverAchievement) {
                await addAchievement(generousGiverAchievement);
                addNotification(`Achievement Unlocked: ${generousGiverAchievement.name}!`, 'success', { persistent: true, persistentType: 'achievement', link: '/settings' });
            }
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDonationStatus('pending');

    const donationData = { phone, amount };

    try {
        // This simulates a call to a backend that uses the Daraja API to initiate an STK push.
        await api.post('/donations/initiate-mpesa', donationData);
        addNotification('Request sent! Check your phone for a PIN prompt.', 'info');
        
        // SIMULATE backend callback after user enters PIN.
        // In a real app, this would be handled by a WebSocket or polling for status.
        setTimeout(() => {
            setDonationStatus('success');
            setIsLoading(false);
            awardAchievements();
        }, 15000); // 15-second simulation for user to find phone and enter PIN.
        
    } catch (err: any) {
        addNotification(err.response?.data?.msg || 'Failed to initiate payment. Please check the phone number.', 'error');
        setIsLoading(false);
        setDonationStatus('error');
    }
  };
  
  const resetDonationForm = () => {
      setDonationStatus('idle');
      setAmount(2500);
      if (!user?.phone) {
          setPhone('');
      }
  };

  const renderContent = () => {
    switch (donationStatus) {
      case 'pending':
        return (
          <div className="text-center p-8">
            <div className="mb-4"><PendingIcon /></div>
            <h3 className="text-2xl font-bold">Awaiting Confirmation</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              A prompt has been sent to <strong>{phone}</strong>. Please enter your M-Pesa PIN to complete the donation of <strong>KES {amount.toLocaleString()}</strong>.
            </p>
            <p className="mt-4 text-sm text-gray-500">This may take a few moments...</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center p-8">
            <div className="mb-4"><SuccessIcon /></div>
            <h3 className="text-2xl font-bold">Thank You!</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Your generous donation has been received. You are making a real difference!</p>
            <button onClick={resetDonationForm} className="mt-6 text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-5 py-2.5">
              Make Another Donation
            </button>
          </div>
        );
      case 'error':
        return (
          <div className="text-center p-8">
            <div className="mb-4"><ErrorIcon /></div>
            <h3 className="text-2xl font-bold">Transaction Failed</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">The request was cancelled or timed out. Please try again.</p>
            <button onClick={resetDonationForm} className="mt-6 text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-5 py-2.5">
              Try Again
            </button>
          </div>
        );
      case 'idle':
      default:
        return (
          <>
            <div className="flex justify-center mb-6"><MpesaLogo className="h-12" /></div>
            <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-2">Donate with M-Pesa</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Fast, secure, and direct. Your contribution matters.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Choose an Amount (KES)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[1000, 2500, 5000, 10000].map(opt => (
                    <button key={opt} type="button" onClick={() => handleAmountClick(opt)} className={`py-3 px-4 rounded-lg font-semibold transition-colors ${amount === opt ? 'bg-brand-red text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>KES {opt.toLocaleString()}</button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">KES</span>
                  <input type="number" value={amount} onChange={handleCustomAmountChange} className="w-full pl-12 p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-600 rounded-lg" placeholder="Custom Amount" required />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">M-Pesa Phone Number</label>
                <input type="tel" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-600 rounded-lg" required placeholder="e.g. 0712345678" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-3 px-5 text-lg font-medium text-white rounded-lg bg-brand-red hover:bg-brand-red-dark disabled:bg-gray-400">
                {isLoading ? 'Processing...' : `Donate KES ${amount.toLocaleString()}`}
              </button>
            </form>
          </>
        );
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-dark-bg py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-xl min-h-[520px] flex flex-col justify-center transition-all duration-300">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default DonationPage;