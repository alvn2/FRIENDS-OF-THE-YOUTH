import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { ACHIEVEMENTS_DATA } from '../constants';

const DonatePage: React.FC = () => {
  const [amount, setAmount] = useState(50);
  const [donationType, setDonationType] = useState<'One-Time' | 'Monthly'>('One-Time');
  const { user, addAchievement } = useAuth();
  const { addNotification } = useNotification();


  const handleAmountClick = (value: number) => {
    setAmount(value);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setAmount(isNaN(value) ? 0 : value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (donationType === 'Monthly') {
      console.log(`Simulating API Call: Create Stripe Subscription for ${user?.email || 'guest'} with amount $${amount}/month`);
      // Backend logic would create a Stripe Customer and Subscription.
      // The webhook handler would listen for `invoice.payment_succeeded` to log each monthly donation.
      if(user) {
        const monthlySupporterAchievement = ACHIEVEMENTS_DATA.find(a => a.id === 'monthly_supporter');
        if (monthlySupporterAchievement) {
            addAchievement(monthlySupporterAchievement);
            addNotification(`Achievement Unlocked: ${monthlySupporterAchievement.name}!`, 'success');
        }
      }

    } else {
      console.log(`Simulating API Call: Create Stripe one-time charge for ${user?.email || 'guest'} with amount $${amount}`);
    }

    // Award achievements
    if (user) {
        const firstDonationAchievement = ACHIEVEMENTS_DATA.find(a => a.id === 'first_donation');
        if (firstDonationAchievement && !user.achievements.some(a => a.id === firstDonationAchievement.id)) {
            addAchievement(firstDonationAchievement);
            addNotification(`Achievement Unlocked: ${firstDonationAchievement.name}!`, 'success');
        }

        if (amount >= 100) {
            const generousGiverAchievement = ACHIEVEMENTS_DATA.find(a => a.id === 'generous_giver');
            if (generousGiverAchievement) {
                addAchievement(generousGiverAchievement);
                addNotification(`Achievement Unlocked: ${generousGiverAchievement.name}!`, 'success');
            }
        }
    }

    addNotification(`Thank you for your generous ${donationType.toLowerCase()} donation of $${amount}!`, 'success');
  };

  const amountOptions = [25, 50, 100, 250];

  return (
    <section className="bg-white dark:bg-dark-bg py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-gray-50 dark:bg-dark-card p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-2">Make a Donation</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Your contribution helps us empower the youth of Kenya.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">Select Donation Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDonationType('One-Time')}
                  className={`py-3 px-4 rounded-lg text-center font-semibold transition-colors ${donationType === 'One-Time' ? 'bg-brand-red text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  One-Time
                </button>
                <button
                  type="button"
                  onClick={() => setDonationType('Monthly')}
                  className={`py-3 px-4 rounded-lg text-center font-semibold transition-colors ${donationType === 'Monthly' ? 'bg-brand-red text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">Choose an Amount</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {amountOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleAmountClick(opt)}
                    className={`py-3 px-4 rounded-lg text-center font-semibold transition-colors ${amount === opt ? 'bg-brand-red text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  >
                    ${opt}
                  </button>
                ))}
              </div>
              <div className="relative">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                 <input
                    type="number"
                    value={amount}
                    onChange={handleCustomAmountChange}
                    className="w-full pl-7 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                    placeholder="Custom Amount"
                 />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-5 text-lg font-medium text-center text-white rounded-lg bg-brand-red hover:bg-brand-red-dark focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800"
              >
                {donationType === 'Monthly' ? `Sponsor Monthly for $${amount}` : `Donate $${amount} Now`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DonatePage;
