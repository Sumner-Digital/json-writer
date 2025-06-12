import React, { FC, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { vanillaRenderers, vanillaCells } from '@jsonforms/vanilla-renderers';
import { customRenderers } from '../renderers/withHelpText';

interface TemplateFormProps {
  schema: any;
  uischema: any;
  data: object;
  onChange(data: object): void;
}

const TemplateForm: FC<TemplateFormProps> = ({ schema, uischema, data, onChange }) => {
  const [errors, setErrors] = useState<any[]>([]);

  // Combine custom renderers with vanilla renderers
  const renderers = [...customRenderers, ...vanillaRenderers];

  return (
    <div className="glass p-4 flex flex-col gap-4"> {/* Added flexbox for layout control */}
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={renderers}
        cells={vanillaCells}
        onChange={({ data: newData, errors: newErrors }) => {
          onChange(newData);
          setErrors(newErrors || []); // Store errors
        }}
      />
      {errors.length > 0 && (
        <div className="form-error"> {/* Applied form-error class */}
          <h3>Validation Errors:</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                <strong>{error.dataPath}:</strong> {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Add buttons here and wrap them in a container */}
    </div>
  );
};

export default TemplateForm;