import { FC } from 'react';

const LoadingSpinner: FC = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-content">
        <div className="boxes">
          <div className="box">
            <div></div><div></div><div></div><div></div>
          </div>
          <div className="box">
            <div></div><div></div><div></div><div></div>
          </div>
          <div className="box">
            <div></div><div></div><div></div><div></div>
          </div>
          <div className="box">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
