import React from 'react';

export default function AuroraBackground() {
  return (
    <div className="aurora-blur pointer-events-none">
      <div className="particle" style={{ top: '15%', left: '20%' }}></div>
      <div className="particle" style={{ top: '45%', left: '85%' }}></div>
      <div className="particle" style={{ top: '75%', left: '10%' }}></div>
      <div className="particle" style={{ top: '25%', left: '60%' }}></div>
      <div className="particle" style={{ top: '85%', left: '40%' }}></div>
    </div>
  );
}
