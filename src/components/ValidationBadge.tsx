import React, { FC } from 'react';

interface ValidationBadgeProps {
  isValid: boolean;
  errors?: string[];
}

const ValidationBadge: FC<ValidationBadgeProps> = ({ isValid, errors }) => {
  if (isValid) {
    return (
      <div className="glass inline-block px-2 py-1">
        <span className="text-green-600">✓ Rich-results ready</span>
      </div>
    );
  }
  return (
    <div className="glass inline-block px-2 py-1">
      <span className="text-red-600">
        {errors && errors.length > 0
          ? errors.join(', ')
          : 'Invalid JSON'}
      </span>
    </div>
  );
};

export default ValidationBadge;