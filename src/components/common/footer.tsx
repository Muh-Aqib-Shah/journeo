import React from 'react';

const Footer = () => {
  return (
    <div className="py-2 text-center text-sm font-medium text-primary">
      <p>&copy; {new Date().getFullYear()} Journeo. All Right Reserved.</p>
    </div>
  );
};

export default Footer;
