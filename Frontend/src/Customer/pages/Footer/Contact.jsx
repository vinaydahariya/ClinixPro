import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16 px-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
        <p className="text-gray-600 text-lg">
          We'd love to hear from you!  
          You can reach out to us via the following:
        </p>
        <div className="space-y-4 text-gray-700">
          <p className="text-lg">
            📞 <span className="font-medium">Phone:</span> +91 7007338198
          </p>
          <p className="text-lg">
            ✉ <span className="font-medium">Email:</span> clinixpro108@gmail.com
          </p>
        </div>
        <p className="text-sm text-gray-500">
          (Our support team is available 24/7 to assist you.)
        </p>
      </div>
    </div>
  );
};

export default Contact;
