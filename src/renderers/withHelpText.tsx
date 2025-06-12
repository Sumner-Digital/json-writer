import React from 'react';
import { 
  RankedTester, 
  rankWith, 
  isStringControl,
  ControlProps
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';

/**
 * Custom text control renderer that adds help text support
 */
const TextControlWithHelpComponent = (props: ControlProps) => {
  const { 
    uischema,
    schema,
    path,
    label,
    visible,
    enabled,
    id,
    errors,
    data,
    handleChange
  } = props;

  // Extract help text from UI schema or schema description
  const helpText = (uischema as any)?.['ui:help'] || (schema as any)?.description || '';

  if (!visible) {
    return null;
  }

  return (
    <div className="control">
      <label htmlFor={id} className="control-label">
        {label}
        {errors && errors.length > 0 && <span className="error-mark">*</span>}
      </label>
      <input
        id={id}
        type="text"
        className="form-control"
        value={data || ''}
        disabled={!enabled}
        onChange={(ev) => handleChange(path, ev.target.value)}
        placeholder={(uischema as any)?.['ui:placeholder'] || ''}
      />
      {helpText && (
        <div className="help-text">
          {helpText}
        </div>
      )}
      {errors && errors.length > 0 && (
        <div className="validation-error">
          {errors}
        </div>
      )}
    </div>
  );
};

// Apply the HOC to get proper props injection
export const TextControlWithHelp = withJsonFormsControlProps(TextControlWithHelpComponent);

// Tester for the custom renderer - ranks it higher than default to override
export const textControlWithHelpTester: RankedTester = rankWith(
  10, // Higher rank to override default
  isStringControl
);

// Export the custom renderer entry
export const textWithHelpRenderer = {
  tester: textControlWithHelpTester,
  renderer: TextControlWithHelp
};

// Export all custom renderers as an array
export const customRenderers = [
  textWithHelpRenderer
];