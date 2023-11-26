import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

interface Props {
  options: any[];
  onChange: (evnet: any) => void;
  selectedValue: string;
}
const RadioButtonGroup = ({ options, onChange, selectedValue }: Props) => {
  return (
    <FormControl>
      <RadioGroup onChange={onChange} value={selectedValue}>
        {options.map(({ lable, value }) => (
          <FormControlLabel
            key={value}
            label={lable}
            value={value}
            control={<Radio />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonGroup;
