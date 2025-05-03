import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/BackArrow.css';

const BackArrow = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const goBack = () => {
    setIsClicked(true);
    const id = setTimeout(() => {
      navigate(-1);
    }, 300);
    setTimeoutId(id);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <div className="back-arrow-container">
      <div
        className={`back-arrow ${isClicked ? 'clicked' : ''}`}
        onClick={goBack}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-label="חזור לעמוד הקודם"
      >
        <div className="arrow-trail"></div>
        <div className="pulse-ring"></div>
        <ArrowLeft className="arrow-icon" size={28} strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default BackArrow;