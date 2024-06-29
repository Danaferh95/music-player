import React from "react";

export const Progress = ({
  value,
  onChange,
  onMouseUp,
  onTouchEnd,
  progress,
}) => {
  return (
    <div>
      <input
        type="range"
        min="1"
        max="100"
        step="1"
        value={value}
        id="myRange"
        onChange={onChange}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        style={{
          background: `linear-gradient(90deg, var(--darkPink) 0%, #ffffff ${Math.floor(
            value
          )}%, white ${Math.floor(
            value
          )}%, white ${Math.floor(
            progress
          )}%, var(--lightPurple) ${Math.floor(
            progress
          )}%, black 100%)`,
          // background: `linear-gradient(90deg, var(--progressUsed) ${Math.floor(
          //   value
          // )}%, var(--progressLeft) ${Math.floor(value)}%)`,
        }}
      />
    </div>
  );
};