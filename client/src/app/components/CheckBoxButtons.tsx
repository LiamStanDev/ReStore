import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";

interface Props {
  items: string[];
  checked: string[];
  onChange: (item: string[]) => void;
}

const CheckBoxButtons = ({ items, checked, onChange }: Props) => {
  const [checkedItems, setCheckedItem] = useState(checked || []);

  // 按下按鈕有兩種情況，
  // 1. 按下按鈕添加篩選
  // 2. 按下按鈕取消篩選
  const handleChecked = (value: string) => {
    const currentIndex = checkedItems.findIndex((item) => item === value);
    let newChecked: string[] = [];

    if (currentIndex === -1) {
      // 1. 按下按鈕添加篩選
      newChecked = [...checkedItems, value];
    } else {
      // 2. 按下按鈕取消篩選
      newChecked = checkedItems.filter((item) => item !== value);
    }

    setCheckedItem(newChecked);
    onChange(newChecked);
  };

  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          key={item}
          control={
            <Checkbox
              checked={checkedItems.indexOf(item) !== -1}
              onClick={() => handleChecked(item)}
            />
          }
          label={item}
        />
      ))}
    </FormGroup>
  );
};

export default CheckBoxButtons;
