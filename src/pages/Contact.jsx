import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-blue-50 w-full">
      <div className="w-full py-12">
        {/* Header with Animation */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6 animate-slide-down">
            📞 Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up">
            Have questions about sustainable living? Want personalized eco-friendly recommendations? 
            We're here to help you on your journey to a greener lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-slide-left">
            {/* Company Info */}
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-lg p-8 border border-green-200 transform hover:scale-105 transition-all duration-300 mx-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-3xl animate-bounce">🌿</div>
                <h2 className="text-2xl font-bold text-green-800">EcoSwitch</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Your trusted partner in sustainable living. We help you discover eco-friendly 
                alternatives to everyday products, making it easier to live sustainably in India.
              </p>
              
              {/* Contact Details with Icons and Animation */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200 group">
                  <div className="text-2xl group-hover:animate-bounce">📧</div>
                  <div>
                    <p className="font-semibold text-green-800">Email</p>
                    <p className="text-gray-600">hello@ecoswitch.com</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 group">
                  <div className="text-2xl group-hover:animate-bounce">📞</div>
                  <div>
                    <p className="font-semibold text-blue-800">Phone</p>
                    <p className="text-gray-600">+91-800-ECO-SWITCH</p>
                    <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM IST</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200 group">
                  <div className="text-2xl group-hover:animate-bounce">📍</div>
                  <div>
                    <p className="font-semibold text-purple-800">Address</p>
                    <p className="text-gray-600">Green Tower, Eco Complex</p>
                    <p className="text-gray-600">Bangalore, Karnataka 560001</p>
                    <p className="text-sm text-gray-500">India</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200 group">
                  <div className="text-2xl group-hover:animate-bounce">💬</div>
                  <div>
                    <p className="font-semibold text-green-800">WhatsApp</p>
                    <p className="text-gray-600">+91-98765-43210</p>
                    <p className="text-sm text-gray-500">Quick support & recommendations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
                     </div>

          {/* Contact Form */}
          <div className="animate-slide-right">
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-lg p-8 border border-green-200 mx-4">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="mr-3">✍️</span>
                Send us a Message
              </h3>
              
              {isSubmitted ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="text-6xl mb-4 animate-bounce">✅</div>
                  <h4 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h4>
                  <p className="text-gray-600">Thank you for reaching out. We'll get back to you soon!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👤 Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💬 Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300 resize-none"
                      placeholder="Tell us how we can help you with sustainable living..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 mx-4">
          <div className="text-center p-6 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
            <div className="text-4xl mb-4 animate-bounce" style={{animationDelay: '0.2s'}}>🌱</div>
            <h4 className="text-lg font-semibold text-green-800 mb-2">Eco Consultations</h4>
            <p className="text-gray-600 text-sm">
              Free 15-minute consultations to help you start your sustainable journey
            </p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
            <div className="text-4xl mb-4 animate-bounce" style={{animationDelay: '0.4s'}}>📦</div>
            <h4 className="text-lg font-semibold text-blue-800 mb-2">Bulk Orders</h4>
            <p className="text-gray-600 text-sm">
              Special pricing for businesses and communities switching to eco-friendly products
            </p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
            <div className="text-4xl mb-4 animate-bounce" style={{animationDelay: '0.6s'}}>🎓</div>
            <h4 className="text-lg font-semibold text-purple-800 mb-2">Workshops</h4>
            <p className="text-gray-600 text-sm">
              Join our workshops on sustainable living, zero waste, and eco-friendly practices
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-down {
          from { 
            opacity: 0; 
            transform: translateY(-30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-left {
          from { 
            opacity: 0; 
            transform: translateX(-50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slide-right {
          from { 
            opacity: 0; 
            transform: translateX(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        
        .animate-slide-left {
          animation: slide-left 0.8s ease-out 0.4s both;
        }
        
        .animate-slide-right {
          animation: slide-right 0.8s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
};

export default Contact;
