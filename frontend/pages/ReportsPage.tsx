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
        <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{report.title} - {report.year}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{report.summary}</p>
        </div>
        <a 
            href={report.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 md:mt-0 flex-shrink-0 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark"
        >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Download PDF
        </a>
    </div>
);

const ReportsPage: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-dark-bg">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Annual Reports</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
            Transparency is a core value at FOTY. Here you can find our annual reports detailing our financial health, program impact, and future goals.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
            {REPORTS_DATA.length > 0 ? (
                REPORTS_DATA.map(report => (
                    <ReportCard key={report.id} report={report} />
                ))
            ) : (
                <div className="p-12 text-center bg-white dark:bg-dark-card rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Reports Coming Soon</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">As a new organization, our first annual report will be published after our first year of operation. Please check back later.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
