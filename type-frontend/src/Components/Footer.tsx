import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      
      <div className="footer-section">
        <span className="footer-text">
          &copy; {currentYear} built by 
          <a href="https://nitinyadav.dev" target="_blank" rel="noopener noreferrer" className="footer-link highlight">
            {" Nitin Yadav"}
          </a>
        </span>
      </div>

      <div className="footer-section hidden-mobile">
        <span className="footer-text subtle">
          built with react & express
        </span>
      </div>

      <div className="footer-section">
        <div className="footer-links">
          <a href="https://github.com/NitinYadav354" target="_blank" rel="noopener noreferrer" className="footer-icon-link" title="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <a href="mailto:nyadav4625@gmail.com" className="footer-icon-link" title="Contact">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
          <span className="version-tag">v2.0.0</span>
        </div>
      </div>

    </footer>
  );
};