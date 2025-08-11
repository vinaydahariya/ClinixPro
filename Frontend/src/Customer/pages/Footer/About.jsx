import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-6 md:px-20">
      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">About ClinixPro</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          ClinixPro is your trusted platform to seamlessly connect with
          top-rated clinics near you. Our goal is to make healthcare booking
          hassle-free, fast, and reliable. Whether you are looking for a general
          check-up, specialized treatments, or premium healthcare services, we
          bring the best options to your fingertips.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed">
          We are dedicated to enhancing patient experience with:
        </p>
        <ul className="list-disc text-left mx-auto w-fit space-y-2 text-gray-700">
          <li>🔹 Easy online appointment booking</li>
          <li>🔹 Verified and trusted clinics</li>
          <li>🔹 Real-time availability and instant confirmation</li>
          <li>🔹 Personalized recommendations based on your needs</li>
        </ul>
        <p className="text-lg text-gray-600 leading-relaxed">
          With ClinixPro, you save time and effort while ensuring you get the
          best possible healthcare experience.
        </p>
      </div>
    </div>
  );
};

export default About;
