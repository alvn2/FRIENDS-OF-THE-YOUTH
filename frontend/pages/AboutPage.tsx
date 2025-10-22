import React from 'react';

const FocusArea: React.FC<{ label: string; description: string }> = ({ label, description }) => (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-bold text-lg text-brand-red">{label}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
    </div>
);


const AboutPage: React.FC = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Our Mission</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              At Friends of the Youth (FOTY), our mission is to break the cycle of poverty and despair by providing comprehensive support to the youth of Kenya. We believe every young person deserves the chance to reach their full potential, and we are committed to creating pathways to success through education, healthcare, and safe housing.
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Founded in {new Date().getFullYear()}, FOTY was born from a simple yet powerful idea: that empowering the youth is the most critical investment in a nation's future. Our journey has just begun, starting as a grassroots initiative fueled by a passion to address the challenges facing young people in our communities. Our vision is to grow into a leading advocate and provider of youth services, building a stronger, more hopeful future for Kenya, one young person at a time.
            </p>
          </div>
          <div className="space-y-4 bg-white dark:bg-dark-card p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-4">Our Core Focus Areas</h3>
              <FocusArea label="Educational Programs" description="To provide scholarships, learning materials, and mentorship that unlock academic and career opportunities." />
              <FocusArea label="Healthcare Access" description="To ensure youth have access to essential physical and mental health services for their overall well-being." />
              <FocusArea label="Shelter & Support" description="To create safe and stable housing environments for at-risk youth, giving them a foundation to thrive." />
              <FocusArea label="Mentorship & Skills" description="To connect young people with mentors and provide skills training for personal and professional growth." />
          </div>
        </div>
      </div>

      {/* YouTube Video Section */}
      <section className="bg-gray-50 dark:bg-dark-card py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            Follow Our Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Our story is just beginning. Watch this space and our social channels as we document our first steps in empowering the next generation of leaders in Kenya.
          </p>
          <div className="relative overflow-hidden rounded-lg shadow-2xl" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/Stp3j1V4w-A" // Placeholder URL for a relevant video
              title="FOTY's Impact Story on YouTube"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;