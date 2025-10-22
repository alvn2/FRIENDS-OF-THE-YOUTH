import React from 'react';
import { REPORTS_DATA } from '../constants';
import { Report } from '../types';

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


const ReportCard: React.FC<{ report: Report }> = ({ report }) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-brand-red/10 text-brand-red rounded-lg flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{report.year}</span>
            </div>
        </div>
        <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{report.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{report.summary}</p>
        </div>
        <div className="w-full md:w-auto mt-4 md:mt-0">
             <a 
                href={report.url} 
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-red hover:bg-brand-red-dark"
                // In a real app, the URL would point to a PDF file. For now, we prevent default to avoid a broken link.
                onClick={(e) => { if(report.url === '#') e.preventDefault(); alert("This is a placeholder link.");}}
            >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download PDF
            </a>
        </div>
    </div>
);

const ReportsPage: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-dark-bg">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Reports & Financials</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
            We are committed to complete transparency. Here you can find our annual reports and financial statements to see how your contributions are making a difference.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
            {REPORTS_DATA.length > 0 ? (
                REPORTS_DATA.map(report => <ReportCard key={report.id} report={report} />)
            ) : (
                <div className="text-center bg-white dark:bg-dark-card p-10 rounded-lg shadow-md border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Our Journey is Just Beginning</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        As a newly founded organization, we are working hard to put our first donations into action. We will publish our first annual impact and financial report after the conclusion of our first full year of operations. Thank you for your trust and support.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;