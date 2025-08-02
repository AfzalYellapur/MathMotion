import GlassyButton from './ui/GlassyButton';

interface GenerateButtonProps {
  onGenerate: () => void;
  disabled?: boolean; // optional prop
}

export default function GenerateButton({ onGenerate, disabled }: GenerateButtonProps) {
  return (
    <GlassyButton onClick={onGenerate} disabled={disabled}>
      Generate
    </GlassyButton>
  );
}
