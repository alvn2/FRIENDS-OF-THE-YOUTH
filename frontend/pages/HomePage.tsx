import React from 'react';
import { Link } from 'react-router-dom';
import { NEWS_DATA } from '../constants';

// --- SVG Icons ---
const YouthEmpowermentIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18a3 3 0 100-6 3 3 0 000 6zM15 18a3 3 0 100-6 3 3 0 000 6z" />
        <path d="M9 12v-2a3 3 0 013-3h0a3 3 0 013 3v2" />
        <path d="M12 12h-1c-2.5 0-4.5-2-4.5-4.5V6" />
        <path d="M12 12h1c2.5 0 4.5-2-4.5-4.5V6" />
    </svg>
);

const MentalHealthIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
        <path d="M12 15c-3.33 0-6 1.33-6 4" />
        <path d="M18 19c0-2.67-2.67-4-6-4" />
        <path d="M12 6V3" />
        <path d="M12 21v-3" />
    </svg>
);

const SustainableGoalsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path d="M12 3v18" />
        <path d="M3.4 12h17.2" />
        <path d="M18.6 6.4a9 9 0 00-13.2 0" />
        <path d="M18.6 17.6a9 9 0 00-13.2 0" />
    </svg>
);

const SocialSupportIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const DonateIcon = () => <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const VolunteerIcon = () => <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M12 14.354V21" /></svg>;
const ShareIcon = () => <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 112.632-3.316m-2.632 3.316l2.632 3.316m0 0a3 3 0 105.367-2.632m-5.367 2.632l5.367 2.632" /></svg>;

// --- Section Components ---
const CauseCard: React.FC<{ title: string; description: string; icon: React.ReactNode; bgColor: string }> = ({ title, description, icon, bgColor }) => (
    <div className={`p-8 rounded-xl shadow-sm ${bgColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
        <div className="bg-white text-brand-primary dark:text-brand-primary rounded-full w-16 h-16 flex items-center justify-center mb-5 ring-1 ring-black/5">
            {icon}
        </div>
        <h3 className="text-2xl font-serif-display font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
);

const ImpactNumber: React.FC<{ value: string; label: string; subLabel: string }> = ({ value, label, subLabel }) => (
    <div className="text-center">
        <p className="text-4xl sm:text-5xl font-extrabold text-brand-primary">{value}</p>
        <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-2">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subLabel}</p>
    </div>
);

const ActionCard: React.FC<{ title: string; description: string; buttonText: string; link: string; icon: React.ReactNode }> = ({ title, description, buttonText, link, icon }) => (
    <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
        {icon}
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">{description}</p>
        <Link to={link} className="mt-auto inline-block px-8 py-3 text-base font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark transition-colors">
            {buttonText}
        </Link>
    </div>
);

const HomePage: React.FC = () => {
    const causes = [
        { icon: <YouthEmpowermentIcon />, title: "Youth Empowerment", description: "Training, mentorship, and leadership development for young innovators.", bgColor: "bg-pink-100/60 dark:bg-pink-900/30" },
        { icon: <MentalHealthIcon />, title: "Mental Health", description: "Creating safe spaces and support systems that promote youth well-being.", bgColor: "bg-blue-100/60 dark:bg-blue-900/30" },
        { icon: <SustainableGoalsIcon />, title: "Sustainable Development", description: "Engaging youth in environmental education and sustainability projects.", bgColor: "bg-green-100/60 dark:bg-green-900/30" },
        { icon: <SocialSupportIcon />, title: "Social Support", description: "Running charity initiatives that uplift vulnerable and marginalized communities.", bgColor: "bg-purple-100/60 dark:bg-purple-900/30" },
    ];
    const latestArticle = NEWS_DATA[0];

    return (
        <div>
            {/* Hero Section with Video */}
            <section className="relative h-[80vh] min-h-[500px] flex items-center text-white">
                <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-kenyan-student-in-class-raising-his-hand-4679-large.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        Empowering Kenya's Future, <br /> One Youth at a Time.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-200">
                        We are a new foundation dedicated to creating sustainable change through education, health, and mentorship.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link to="/donate" className="px-8 py-4 text-lg font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark transition-transform transform hover:scale-105 shadow-lg">
                            Donate Now
                        </Link>
                        <Link to="/about" className="px-8 py-4 text-lg font-semibold text-gray-900 bg-white rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105 shadow-lg">
                            Our Mission
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* Our Foundational Goals Section */}
            <section className="py-16 bg-white dark:bg-dark-bg">
                 <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-12">
                        Our Foundational Goals
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <ImpactNumber value="1,000" label="Youths Supported" subLabel="Our goal by 2025" />
                        <ImpactNumber value="3" label="Core Programs" subLabel="Education, Health & Shelter" />
                        <ImpactNumber value="100%" label="Kenyan-Led" subLabel="For the community, by the community" />
                    </div>
                 </div>
            </section>
            
            {/* Our Core Focus Section */}
            <section className="py-16 bg-gray-50 dark:bg-dark-card">
                 <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
                        Our Core Focus
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {causes.map((cause, index) => (
                            <CauseCard
                                key={index}
                                icon={cause.icon}
                                title={cause.title}
                                description={cause.description}
                                bgColor={cause.bgColor}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* How You Can Help Section */}
            <section className="py-16 bg-white dark:bg-dark-bg">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
                        How You Can Help
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <ActionCard 
                            title="Donate"
                            description="Your donation provides essential resources like school supplies, healthcare, and safe shelter for a young person in need."
                            buttonText="Donate Now"
                            link="/donate"
                            icon={<DonateIcon />}
                        />
                         <ActionCard 
                            title="Volunteer"
                            description="Lend your time and skills. Whether it's mentoring, event support, or program planning, your help is invaluable."
                            buttonText="Join Us"
                            link="/volunteer"
                            icon={<VolunteerIcon />}
                        />
                         <ActionCard 
                            title="Spread the Word"
                            description="Share our mission with your friends, family, and network. A simple share can inspire others to join our cause."
                            buttonText="Share Our Story"
                            link="/news"
                            icon={<ShareIcon />}
                        />
                    </div>
                </div>
            </section>

             {/* Latest News Section */}
             <section className="py-16 bg-gray-50 dark:bg-dark-card">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        <div>
                            <img src={latestArticle.image} alt={latestArticle.title} className="rounded-lg shadow-xl w-full h-auto object-cover" />
                        </div>
                        <div className="text-center md:text-left">
                            <p className="font-semibold text-gray-500 dark:text-gray-400">From Our Newsdesk</p>
                            <h2 className="text-3xl md:text-4xl font-extrabold my-3">
                                {latestArticle.title}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">{latestArticle.date}</p>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                {latestArticle.excerpt}
                            </p>
                            <Link to={`/news/${latestArticle.id}`} className="inline-block px-6 py-3 text-base font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark">
                                Read Full Story
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;