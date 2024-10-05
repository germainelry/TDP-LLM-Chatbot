import React, { useState } from "react";
import "./ApplicationInfo.css";

function ApplicationInfo() {
  const [showFAQs, setShowFAQs] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);

  // FAQs to display with their corresponding answers
  const faqs = [
    {
      question: "What languages are best suited for the chatbot conversation?",
      answer: (
        <>
          The chatbot works best with English, but it can also understand and
          respond in other languages.
        </>
      ),
    },
    {
      question: "What if my questions are not answered by the chatbot?",
      answer: (
        <>
          Feel free to click on the chatbot's response and you will be directed
          to 2 options: <br />
          <br />
          1) Speak to a human: A customer service personnel will reach out to
          you. <br />
          2) Report Response: If you feel that the content is inappropriate or
          incorrect. This will help us improve the chatbot's responses.
        </>
      ),
    },
    {
      question: "Are my conversations with the chatbot secure?",
      answer: (
        <>
          Yes, your conversations with the chatbot are secure. We use encryption
          to protect your personal information and ensure confidentiality.
        </>
      ),
    },
    {
      question: "What services can the UOB chatbot assist with?",
      answer: (
        <>
          The UOB chatbot can assist with account inquiries, loan applications,
          credit card services, and general banking queries.
        </>
      ),
    },
    {
      question: "What should I do if the chatbot is not responding?",
      answer: (
        <>
          If the chatbot is unresponsive, you can try refreshing the page or
          restarting the chat. If the issue persists, please contact customer
          support.
        </>
      ),
    },
    {
      question: "How can I provide feedback about the chatbot?",
      answer: (
        <>You can provide feedback by clicking on the "Rate the bot" button!</>
      ),
    },
  ];

  const toggleAnswer = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <>
      <div className={`app-info-container ${showFAQs ? "move-up" : ""}`}>
        <h1 className="fw-light">Welcome to the UOB Chat Assistant</h1>
        <br />
        <p className="fw-light">
          The UOB Digital Assistant helps you with your banking needs, providing
          quick answers and support anytime. Whether it's about your account,
          loans, or services, the assistant is here to help. Follow the steps
          outlined by the chatbot to get started.
        </p>
        <br />
        <p className="fw-light">
          Tap the button below to watch a video on how to use the UOB Chat.
        </p>
        {!showFAQs ? (
          <>
            <button
              className="btn btn-outline-light faq-btn"
              onClick={() => setShowFAQs(true)}
            >
              <b>FAQs</b>
            </button>
            <button className="btn btn-outline-light watch-now-btn">
              <b>Watch Now</b>
            </button>
          </>
        ) : (
          <button
            className="btn btn-outline-light back-btn"
            onClick={() => setShowFAQs(false)}
          >
            <i className="bi bi-caret-up"></i>
            {" Back"}
          </button>
        )}

        {showFAQs && (
          <div className="faq-list-container">
            <ul className="faq-list">
              {faqs.map((faq, index) => (
                <li key={index} className="faq-item">
                  <div
                    className="faq-question fw-light"
                    onClick={() => toggleAnswer(index)}
                  >
                    <strong>{faq.question}</strong>
                  </div>
                  {activeFAQ === index && (
                    <div className="faq-answer">{faq.answer}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default ApplicationInfo;
