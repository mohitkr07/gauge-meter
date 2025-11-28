import { Typography } from '@/components/common';
import React, { useMemo, useRef, useEffect } from 'react';

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  width?: number;
  animationDuration?: number;
}

const GaugeChart = ({
  value,
  min = 300,
  max = 900,
  title = 'CMR',
  width = 300,
  animationDuration = 1500,
}: GaugeChartProps) => {
  const needleRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const angle = useMemo(() => {
    const range = max - min;
    if (range <= 0) return -90;

    const clampedValue = Math.min(Math.max(value, min), max);
    const scale = ((clampedValue - min) / range) * 176;
    return scale - 178;
  }, [value, min, max]);

  useEffect(() => {
    const needle = needleRef.current;
    if (!needle || hasAnimated.current) return;

    const animation = needle.animate([{ transform: 'rotate(-180deg)' }, { transform: `rotate(${angle}deg)` }], {
      duration: animationDuration,
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      fill: 'forwards',
    });

    animation.onfinish = () => {
      hasAnimated.current = true;
      // Set final state explicitly
      needle.style.transform = `rotate(${angle}deg)`;
    };

    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency - only runs once on mount

  // Handle subsequent value changes
  useEffect(() => {
    const needle = needleRef.current;
    if (!needle || !hasAnimated.current) return;

    needle.style.transform = `rotate(${angle}deg)`;
  }, [angle]);

  return (
    <div className="flex flex-col">
      <div className="relative flex flex-col items-center">
        <p className="text-gray-500 text-sm mb-1">{title}</p>

        <div className="gauge-wrapper">
          <div className="gauge">
            <div className="gauge-inner"></div>

            <div ref={needleRef} className="needle" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="needle-head"></div>
            </div>
          </div>

          <div className="gauge-center">
            <p className="gauge-value">{value}</p>
            <p className="gauge-label">Low Risk</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Typography type="s12" className="!text-neutral-400">
          {min}
        </Typography>
        <Typography type="s12" className="!text-neutral-400">
          {max}
        </Typography>
      </div>
    </div>
  );
};

export default GaugeChart;
