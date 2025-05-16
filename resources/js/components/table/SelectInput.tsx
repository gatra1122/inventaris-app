import Select from 'react-select';

export interface OptionType {
  value: string;
  label: string;
}

interface Props {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: OptionType[];
  isDisabled?: boolean;
  isLoading?: boolean;
}

const SelectInput: React.FC<Props> = ({ name, value, onChange, options, isDisabled, isLoading }) => {
  const selectedOption = options.find(opt => opt.value === value) || null;

  const handleChange = (option: any) => {
    const fakeEvent = {
      target: {
        name,
        value: option?.value || '',
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(fakeEvent);
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={handleChange}
      isDisabled={isDisabled}
      isLoading={isLoading}
      className='form-select'
      classNamePrefix="form-select"
    />
  );
};

export default SelectInput;