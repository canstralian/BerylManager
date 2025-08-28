import { Switch } from "@/components/ui/switch";

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  "data-testid"?: string;
}

export default function ToggleSwitch({ checked, onCheckedChange, disabled = false, "data-testid": testId }: ToggleSwitchProps) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      data-testid={testId}
      className="data-[state=checked]:bg-success"
    />
  );
}
