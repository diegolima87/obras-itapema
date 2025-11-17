import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultColor?: string;
}

export function ColorPicker({ label, value, onChange, defaultColor }: ColorPickerProps) {
  const handleColorChange = (newValue: string) => {
    // Validar formato hex
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange(newValue);
    } else if (newValue.startsWith('#')) {
      onChange(newValue.toUpperCase());
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2 items-center">
        <Input
          type="color"
          value={value}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-20 h-10 cursor-pointer p-1"
        />
        <Input
          value={value}
          onChange={(e) => handleColorChange(e.target.value)}
          placeholder="#132A72"
          pattern="^#[0-9A-Fa-f]{6}$"
          className="flex-1"
        />
        {defaultColor && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onChange(defaultColor)}
            title="Resetar para cor padrão"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Preview da cor */}
      <div
        className="h-12 rounded-lg border-2 transition-all"
        style={{ backgroundColor: value }}
      />
    </div>
  );
}
