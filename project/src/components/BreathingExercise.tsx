import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X } from 'lucide-react';

interface BreathingExerciseProps {
  onClose?: () => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const phases = {
    inhale: { duration: 4, instruction: 'Inhale slowly', color: 'bg-blue-500' },
    hold1: { duration: 4, instruction: 'Hold your breath', color: 'bg-green-500' },
    exhale: { duration: 4, instruction: 'Exhale slowly', color: 'bg-purple-500' },
    hold2: { duration: 4, instruction: 'Hold empty', color: 'bg-orange-500' }
  };

  const phaseOrder: Array<keyof typeof phases> = ['inhale', 'hold1', 'exhale', 'hold2'];

  useEffect(() => {
    if (isActive && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const currentIndex = phaseOrder.indexOf(currentPhase);
            if (currentIndex === phaseOrder.length - 1) {
              // End of cycle
              if (cycle >= 3) {
                setIsCompleted(true);
                setIsActive(false);
                return 0;
              } else {
                setCycle(prev => prev + 1);
                setCurrentPhase('inhale');
                return phases.inhale.duration;
              }
            } else {
              const nextPhase = phaseOrder[currentIndex + 1];
              setCurrentPhase(nextPhase);
              return phases[nextPhase].duration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentPhase, cycle, isCompleted]);

  const startExercise = () => {
    setIsActive(true);
    setIsCompleted(false);
    setCycle(1);
    setCurrentPhase('inhale');
    setTimeLeft(4);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setIsCompleted(false);
    setCycle(1);
    setCurrentPhase('inhale');
    setTimeLeft(4);
  };

  const getProgressPercentage = () => {
    const currentPhaseDuration = phases[currentPhase].duration;
    return ((currentPhaseDuration - timeLeft) / currentPhaseDuration) * 100;
  };

  const getCircleSize = () => {
    if (currentPhase === 'inhale') {
      return 20 + (getProgressPercentage() * 0.8); // Grow from 20% to 100%
    } else if (currentPhase === 'exhale') {
      return 100 - (getProgressPercentage() * 0.8); // Shrink from 100% to 20%
    } else {
      return 100; // Hold phases maintain size
    }
  };

  if (isCompleted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎉</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Exercise Complete!</h3>
          <p className="text-gray-600 mb-6">
            Great job! You've completed 3 cycles of box breathing. 
            Take a moment to notice how you feel.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetExercise}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            <button
              onClick={onClose}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Box Breathing Exercise</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Breathing Circle */}
        <div className="mb-8">
          <div className="relative w-64 h-64 mx-auto mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`${phases[currentPhase].color} rounded-full transition-all duration-1000 ease-in-out`}
                style={{
                  width: `${getCircleSize()}%`,
                  height: `${getCircleSize()}%`,
                  opacity: 0.7
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">{timeLeft}</div>
                <div className="text-sm text-gray-600">seconds</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            {phases[currentPhase].instruction}
          </h4>
          <p className="text-gray-600 text-sm">
            Cycle {cycle} of 3 • {currentPhase.toUpperCase()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${phases[currentPhase].color} h-2 rounded-full transition-all duration-1000`}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {!isActive ? (
            <button
              onClick={startExercise}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Exercise
            </button>
          ) : (
            <button
              onClick={pauseExercise}
              className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </button>
          )}
          <button
            onClick={resetExercise}
            className="flex items-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-xs text-gray-500">
          <p>Follow the breathing circle: inhale as it grows, exhale as it shrinks</p>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
