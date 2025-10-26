import React, { useState } from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Us",
      details: "support@sandysstore.com",
      description: "Send us an email anytime",
      link: "mailto:support@sandysstore.com"
    },
    {
      icon: "📞",
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 6pm",
      link: "tel:+15551234567"
    },
    {
      icon: "💬",
      title: "Live Chat",
      details: "Start Chat",
      description: "24/7 customer support",
      link: "#chat"
    },
    {
      icon: "📍",
      title: "Visit Us",
      details: "123 Commerce St, City",
      description: "Visit our headquarters",
      link: "https://maps.google.com"
    }
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unused items in original packaging."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and times vary by location."
    },
    {
      question: "How can I track my order?",
      answer: "You'll receive a tracking number via email once your order ships. You can also track it from your dashboard."
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-40">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">Contact Us</h1>
              <p className="lead mb-4">
                We're here to help! Get in touch with us for any questions or support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {contactMethods.map((method, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card border-0 text-center h-100 shadow-sm">
                  <div className="card-body p-4">
                    <div className="display-4 mb-3">{method.icon}</div>
                    <h5 className="fw-bold mb-3">{method.title}</h5>
                    <a 
                      href={method.link} 
                      className="text-primary fw-semibold text-decoration-none d-block mb-2"
                    >
                      {method.details}
                    </a>
                    <p className="text-muted small mb-0">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-5">
            {/* Contact Form */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold mb-4">Send us a Message</h3>
                  
                  {submitStatus === "success" && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you within 24 hours.
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setSubmitStatus(null)}
                      ></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label fw-semibold">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label fw-semibold">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="subject" className="form-label fw-semibold">
                          Subject *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          placeholder="What is this regarding?"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="message" className="form-label fw-semibold">
                          Message *
                        </label>
                        <textarea
                          className="form-control form-control-lg"
                          id="message"
                          name="message"
                          rows="6"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          placeholder="Tell us how we can help you..."
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg px-5"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Sending...
                            </>
                          ) : (
                            "Send Message"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Get in Touch</h5>
                  
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">📍 Office Address</h6>
                    <p className="text-muted mb-0">
                      123 Commerce Street<br />
                      Business District<br />
                      City, State 12345<br />
                      United States
                    </p>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">🕒 Business Hours</h6>
                    <p className="text-muted mb-0">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">🌐 Follow Us</h6>
                    <div className="d-flex gap-3">
                      {["📘", "📷", "🐦", "💼"].map((icon, index) => (
                        <a
                          key={index}
                          href="#"
                          className="text-decoration-none text-muted"
                          style={{ fontSize: "1.5rem" }}
                        >
                          {icon}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="border-top pt-4">
                    <h6 className="fw-semibold mb-3">💡 Quick Help</h6>
                    <Link to="/faq" className="text-primary text-decoration-none d-block mb-2">
                      Frequently Asked Questions
                    </Link>
                    <Link to="/shipping" className="text-primary text-decoration-none d-block mb-2">
                      Shipping Information
                    </Link>
                    <Link to="/returns" className="text-primary text-decoration-none d-block">
                      Return Policy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <h2 className="fw-bold mb-3">Frequently Asked Questions</h2>
                <p className="text-muted lead">Quick answers to common questions</p>
              </div>
              
              <div className="accordion" id="faqAccordion">
                {faqs.map((faq, index) => (
                  <div key={index} className="accordion-item border-0 mb-3 shadow-sm">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq${index}`}
                        style={{ fontSize: "1.1rem" }}
                      >
                        {faq.question}
                      </button>
                    </h3>
                    <div
                      id={`faq${index}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body text-muted">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Still have questions? <Link to="/support" className="text-primary text-decoration-none">Visit our support center</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;