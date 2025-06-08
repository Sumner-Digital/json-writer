import React, { FC } from 'react';
import { JsonForms } from '@jsonforms/react';
import { vanillaRenderers, vanillaCells } from '@jsonforms/vanilla-renderers';

interface TemplateFormProps {
  schema: any;
  uischema: any;
  data: object;
  onChange(data: object): void;
}

const TemplateForm: FC<TemplateFormProps> = ({ schema, uischema, data, onChange }) => {
  return (
    <div className="glass grid grid-cols-2 gap-4 p-4">
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={vanillaRenderers}
        cells={vanillaCells}
        onChange={({ data: newData, errors }) => onChange(newData)}
      />
    </div>
  );
};

export default TemplateForm;