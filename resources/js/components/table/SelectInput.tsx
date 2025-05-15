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
    // classNames={{
    //   clearIndicator: () => '',
    //   control: () => '!rounded-none !border-0',
    //   dropdownIndicator: () => '',
    //   container: () => '',
    //   group: () => '',
    //   groupHeading: () => '',
    //   indicatorsContainer: ({ isDisabled }) => `${isDisabled ? 'bg-gray-100' : ''}`,
    //   indicatorSeparator: () => '',
    //   input: () => '',
    //   loadingIndicator: () => '',
    //   loadingMessage: () => '',
    //   menu: () => '',
    //   menuList: () => '',
    //   menuPortal: () => '',
    //   multiValue: () => '',
    //   multiValueLabel: () => '',
    //   multiValueRemove: () => '',
    //   noOptionsMessage: () => '',
    //   option: () => '',
    //   placeholder: () => '',
    //   singleValue: () => '',
    //   valueContainer: ({ isDisabled }) => `${isDisabled ? 'bg-gray-100' : ''}`,
    // }}
    />
  );
};

export default SelectInput;