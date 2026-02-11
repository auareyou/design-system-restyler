"use client";

import styles from "./LeverSlider.module.css";

interface Props {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  defaultValue: number;
  onChange: (value: number) => void;
}

export default function LeverSlider({
  label,
  min,
  max,
  step,
  value,
  defaultValue,
  onChange,
}: Props) {
  const isDefault = value === defaultValue;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <div className={styles.valueArea}>
          <span className={styles.value}>{value}</span>
          {!isDefault && (
            <button
              className={styles.reset}
              onClick={() => onChange(defaultValue)}
            >
              Reset
            </button>
          )}
        </div>
      </div>
      <input
        className={styles.slider}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
